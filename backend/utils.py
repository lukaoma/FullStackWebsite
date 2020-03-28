from flask import abort
import requests, json, us, base64

from constants import Config
from db import database
from city import City
from housing import Housing
from commute import Commute


def retrieve_params(search_params: dict, name_set: set):
    """ Finds the matching values for the names in name_set in searchparams filters.

    Parameters
    ------------
    searchparams : dict
        Flask-RESTless generated dict for search parameters in GET request.
    name_set : set
        Set of parameter name strings to retrieve.

    Returns
    ------------
    dict
        Dictionary of parameter names linked to their values in filters.
    """
    results = {}
    if "filters" in search_params:
        for p in search_params["filters"]:
            if p["name"] in name_set:
                results[p["name"]] = p["val"]
    return results


def decode_latlng(latlng: str):
    """ Converts a comma-separated latitude/longitude string into its respective values.
    
    Parameters
    ------------
    latlng : str
        Comma-separated latitude/longitude (e.g. "30.6125,-90.27554")

    Returns
    ------------
    dict
        Dict containing latitude under 'lat', longitude under 'lng'
    """
    try:
        lat, lng = (float(x) for x in latlng.split(","))
        return {"lat": lat, "lng": lng}
    except ValueError:
        return None


def request_latlng(address: str):
    """ Use an address string to get the latitude/longitude pair from Google Places API.
    
    Parameters
    ------------
    address : str
        String representation of address

    Raises
    ------------
    RequestException
        If Google can't find the address or sends a bad requests/error.

    Returns
    ------------
    tuple - (float,float)
        Tuple of (latitude, longitude) float values
    """
    maps_places_srch = (
        "https://maps.googleapis.com/maps/api/place/findplacefromtext/json"
    )
    maps_places_det = "https://maps.googleapis.com/maps/api/place/details/json"

    # try:
    place_res = requests.get(
        url=maps_places_srch,
        params={"key": Config.GOOGLE.KEY, "input": address, "inputtype": "textquery"},
    ).json()
    if len(place_res["candidates"]) == 0:
        raise requests.exceptions.RequestException(str(place_res))
    place_id = place_res["candidates"][0]["place_id"]

    place = requests.get(
        url=maps_places_det, params={"key": Config.GOOGLE.KEY, "placeid": place_id}
    ).json()
    place_geom = place["result"]["geometry"]["location"]
    # except requests.exceptions.RequestException as e:
    #     # Should move this outside if we want to handle differently?
    #     abort(404, 'Google couldn\'t hack it')

    return place_geom


def decode_address_string(address: str):
    """ Convert address or lat/lng string into latitude/longitude values.
    
    Parameters
    ------------
    address : str
        String representation of address or comma-separated latitude/longitude pair

    Returns
    ------------
    tuple - (float,float)
        Tuple of (latitude, longitude) float values
    """
    latlng = decode_latlng(address)
    if latlng is not None:
        return latlng
    else:
        return request_latlng(address)


def decode_polyline(polyline_str: str):
    """Pass a Google Maps encoded polyline string; returns list of lat/lon pairs
    
    Parameters
    ------------
    polyline_str : str
        Polyline string

    Returns
    ------------
    list (tuples)
        A list of latitude,longitude tuples that represent the waypoints in the polyline.
    """
    i, lat, lng = 0, 0, 0
    coords = []
    changes = {"latitude": 0, "longitude": 0}

    # Coordinates have variable length when encoded, so just keep
    # track of whether we've hit the end of the string. In each
    # while loop iteration, a single coordinate is decoded.
    while i < len(polyline_str):
        # Gather lat/lon changes, store them in a dictionary to apply them later
        for unit in ["latitude", "longitude"]:
            shift, result = 0, 0

            while True:
                byte = ord(polyline_str[i]) - 63
                result |= (byte & 0x1F) << shift
                shift += 5
                i += 1
                if not byte >= 0x20:
                    break
            if result & 1:
                changes[unit] = ~(result >> 1)
            else:
                changes[unit] = result >> 1
        lat += changes["latitude"]
        lng += changes["longitude"]
        coords.append((lat / 100000.0, lng / 100000.0))
    return coords


def commute_return(db_model: dict):
    """ Convert database record into consumer information.
    
    Parameters
    ------------
    db_model : dict
        Dictionary representation of commute instance.

    Raises
    ------------
    MissingTransitElementsException
        If the passed instance does not have any city information.

    Returns
    ------------
    dict
        Dictionary of information to return to the user.
    """
    city_key = "city"
    if "city" not in db_model and "city_id" not in db_model:
        raise MissingTransitElementsException()
    elif "city" not in db_model:
        city_key = "city_id"
    for k in ("polyline", "name", "timespan", "fare", "walk_dist", "walk_time"):
        # ['name', , 'walk_time', 'polyline', 'walk_dist', 'req_count', 'city', '', 'timespan', 'fare', 'id', 'housing']
        if k not in db_model:
            return "MISSING KEYS " + str(k)

    polyline = decode_polyline(db_model["polyline"])
    req_str = "|".join((",".join((str(v) for v in p)) for p in polyline))
    try:
        img = requests.get(
            "http://maps.googleapis.com/maps/api/staticmap",
            params={
                "size": "400x400",
                "path": req_str,
                "sensor": "false",
                "key": Config.GOOGLE.KEY,
            },
        )
    except requests.exceptions.RequestException:
        img = "NO IMAGE"
    res = {
        "name": db_model["name"],
        "city_id": db_model[city_key],
        "mode": db_model["mode"],
        "timespan": str(db_model["timespan"]),
        "fare": f"${db_model['fare']}",
        "img": str(base64.b64encode(img.content)),
        "walk_dist": db_model["walk_dist"],
        "walk_time": db_model["walk_time"],
        "distance": db_model["distance"],
    }
    return res


def request_commute(home: str, work: str, mode: str):
    """ Requests a route from Google given a starting node and ending node.
    
    Parameters
    ------------
    home : str
        Comma-separated latitude/longitude representation of starting location.
    work : str
        Comma-separated latitude/longitude representation of ending location.
    mode : str
        Method of transit (e.g. 'walking', 'driving', 'transit')

    Raises
    ------------
    RequestException
        If the commute could not be requested properly using the given coordinates

    Returns
    ------------
    list
        List of database instance dictionaries for requested routes
    """
    maps_dir = "https://maps.googleapis.com/maps/api/directions/json"

    # try:
    params = {
        "key": Config.GOOGLE.KEY,
        "origin": home,
        "destination": work,
        "mode": mode,
    }
    req = requests.get(url=maps_dir, params=params).json()
    # except requests.exceptions.RequestException as e:
    #     abort(404, 'Google couldn\'t hack it')
    if req["status"] != "OK":
        raise requests.exceptions.RequestException()
        # abort(404, 'Google couldn\'t hack it')

    # If this function is entered, we know there's been no results in the database
    # Generate new commute, store in database, and return res
    results = []
    for route in req["routes"]:
        route_res = {}
        legs = route["legs"]

        name = "not_found"
        # FIXME: we only use the first line, maybe combine some?
        try:

            def leg_iter(leg_seq):
                for leg in leg_seq:
                    yield from leg["steps"]

            line = next(
                filter(lambda l: l["travel_mode"] == "TRANSIT", leg_iter(legs))
            )["transit_details"]["line"]
        except StopIteration:
            name = f"{mode} : from {home} to {work}"
            line = None

        walk_time = 0
        walk_distance = 0
        total_distance = 0
        for leg in legs:
            total_distance += leg["distance"]["value"]
            for step in leg["steps"]:
                if step["travel_mode"] == "WALKING":
                    walk_distance += step["distance"]["value"]
                    walk_time += step["duration"]["value"]

        if line != None:
            name = (
                f"{line['vehicle']['name']} {line['agencies'][0]['name']} {line['short_name']}"
                if line != None
                else route_res["name"]
            )
        polyline_raw = route["overview_polyline"]["points"]
        items = legs[0]["start_address"].split(", ")  # TODO: how to get this?
        city, state = items[-3], items[-2]
        state, zipcode = state.strip().split()
        timespan = sum(leg["duration"]["value"] for leg in legs)
        fare = route["fare"]["text"] if "fare" in route else "free"
        fare_value = route["fare"]["value"] if "fare" in route else 0.0
        long_state = us.states.lookup(state).name

        city_query = City.query.filter_by(name=city, state=long_state).first()
        if city_query is None:
            return {"err": f'unsuported city "{city}" "{long_state}"'}

        db_entry = {
            "name": name,
            "city_id": city_query.id,
            "home": home,
            "work": work,
            "mode": mode,
            "timespan": timespan,
            "fare": fare_value,
            "polyline": polyline_raw,
            "walk_dist": walk_distance,
            "walk_time": walk_time,
            "distance": total_distance,
            "req_count": 1,  # FIXME
        }
        results.append(db_entry)

    return results


def commute_log_data(home: str, work: str, mode: str):
    """ Enters all routes of the given mode for a start and end location into the database.
    
    Parameters
    ------------
    home : str
        Comma-separated latitude/longitude representation of starting location.
    work : str
        Comma-separated latitude/longitude representation of ending location.
    mode : str
        Method of transit (e.g. 'walking', 'driving', 'transit')

    Raises
    ------------
    RequestException
        If the commute couldn't requested for the given home/work locations.

    Returns
    ------------
    dict
        Dictionary of information to return to the user.
    """
    results = []
    for db_entry in request_commute(home, work, mode):
        route = Commute(**db_entry)
        database.session.add(route)
        city_query = City.query.get(db_entry["city_id"])
        city_query.commute.append(route)

        # May need to change - exact latitude longitude may not align between Google and Realtor
        latlng = decode_latlng(home)
        if latlng is not None:
            home_query = Housing.query.filter_by(
                latitude=latlng["lat"], longitude=latlng["lng"]
            ).first()
            if home_query is not None:
                home_query.routes.append(route)
            database.session.commit()

        route_res = commute_return(db_entry)
        results.append(route_res)

    return results
