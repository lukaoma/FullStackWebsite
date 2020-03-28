import requests, json, time, random, string, us, re, sys
from urllib import parse
from xml.etree import ElementTree

from constants import Config

from requests import Response, Session
from typing import Dict, List

from simple_rest_client.api import API

import click
import random

BACKEND_BASE = "http://localhost:81/api/"
WIKI_BASE = "https://en.wikipedia.org/api/rest_v1"
DATA_USA_BASE = "https://datausa.io/api/data"
DATA_USA_PROFILE_GEO = "https://datausa.io/api/profile/geo/"
POPULATION_LOWER_BOUND = 100000


@click.group()
def cli():
    pass


@click.command()
@click.option(
    "--population_lower_bound",
    "-p",
    default=POPULATION_LOWER_BOUND,
    help="Population lower bound.",
)
@click.option("--api", default=BACKEND_BASE, help="The API to use.")
def scrape_cities(population_lower_bound, api):
    api = API(api_root_url=BACKEND_BASE, json_encode_body=True)

    api.add_resource(resource_name="city")
    api.add_resource(resource_name="housing")
    api.add_resource(resource_name="commute")

    def scrape_cities():
        headers: Dict[str, str] = {"User-Agent": ''.join(random.choice(string.ascii_lowercase) for i in range(20))}

        params: Dict[str, str] = {
            "drilldowns": "Place",
            "measure": "Population",
            "year": "latest",
        }

        with requests.session() as session:
            print("| scraping cities")
            # DataUSA classifies several "statistical areas" as cities, which Wikipedia chokes on (and also sometimes DataUSA itself)
            bad_geos: List[str] = [
                "16000US1836003",
                "16000US2148006",
                "16000US4752006",
                "16000US0637692",
                "16000US1303440",
                "16000US1304204",
                "16000US1349008",
                "16000US1571550",
                "16000US7206593",
            ]
            fields: List[str] = [
                "Population",
                "Median Age",
                "Median Household Income",
                "Poverty Rate",
                "Number of Employees",
                "Median Property Value",
            ]

            top_level = [
                place
                for place in session.get(
                    DATA_USA_BASE, headers=headers, params=params
                ).json()["data"]
                if place["Population"] >= int(population_lower_bound)
                and place["ID Place"] not in bad_geos
            ]
            place_ids: List[str] = (place["ID Place"] for place in top_level)

            i: int = 0

            # this is the dumbest hack but the API we were using turned out to be deprecated and I had to find a solution on a quick turnaround.
            for id in place_ids:
                stats = session.get(DATA_USA_PROFILE_GEO + id, headers=headers).json()[
                    "stats"
                ]

                parsed_stats = {}

                for stat in stats:
                    if sanitize(stat["title"]) in fields:
                        parsed_stats[sanitize(stat["title"])] = sanitize(stat["value"])

                normalized_stats = {}

                short_state = top_level[i]["Place"].split(",")[-1].strip()

                print("| =>", id)
                print("|    => pulled")

                normalized_stats["name"] = (top_level[i]["Place"]).split(",")[0]
                normalized_stats["state"] = str(us.states.lookup(short_state))
                normalized_stats["population"] = extract_int(parsed_stats["Population"])
                normalized_stats["median_age"] = extract_float(
                    parsed_stats["Median Age"]
                )
                normalized_stats["median_wage"] = extract_income(
                    parsed_stats["Median Household Income"]
                )
                normalized_stats["poverty_rate"] = extract_percentage(
                    parsed_stats["Poverty Rate"]
                )
                normalized_stats["num_employees"] = extract_int(
                    parsed_stats["Number of Employees"]
                )
                normalized_stats["median_property_value"] = extract_income(
                    parsed_stats["Median Property Value"]
                )
                normalized_stats["geo"] = id

                print("|       => DataUSA stats")

                # -- begin Doug's code, not my fault --
                # Scrape banner, images and description from Wikipedia
                wiki_city = session.get(
                    f'{WIKI_BASE}/page/summary/{normalized_stats["name"]},_{short_state}?redirect=true'
                ).json()

                # Can get coordinates from this page if necessary
                if "coordinates" in wiki_city:
                    normalized_stats["latitude"] = wiki_city["coordinates"]["lat"]
                    normalized_stats["longitude"] = wiki_city["coordinates"]["lon"]
                if "extract" in wiki_city:
                    normalized_stats["desc"] = wiki_city["extract"]

                print("|       => Wikipedia description")

                wiki_images = session.get(
                    f'{WIKI_BASE}/page/media-list/{normalized_stats["name"]},_{short_state}?redirect=true'
                )
                wiki_json = wiki_images.json()

                # Store images into Python list, and pickle for later retrieval
                images = []

                for image in wiki_json["items"]:
                    # this API is unstable so sometimes it just decides to not give us the key we need
                    if "srcset" in image:
                        images.append(
                            {"url": image["srcset"][0]["src"].replace("//", "")}
                        )
                normalized_stats["images"] = images

                print("|       => Wikipedia images")

                i += 1
                yield normalized_stats

    def sanitize(string):
        return re.sub(
            "<[^>]*>", "", string
        )  # look at that, Downing actually did teach me something

    def extract_int(string):
        if "M" in string:
            string = string.replace("M", "")
            return int(float(string) * 10 ** 6)
        elif "," in string:
            string = string.replace(",", "")
            return int(string)
        else:
            raise Exception("um")

    def extract_income(string):
        string = string.replace("$", "")

        return extract_int(string)

    def extract_float(string):
        return float(string)

    def extract_percentage(string):
        string = string.replace(".", "")
        string = string.replace("%", "")

        return float(string) * 10 ** -3

    for city in scrape_cities():
        q = {"filters": [{"name": "name", "op": "==", "val": city["name"]}]}

        if api.city.list(params={"q": json.dumps(q)}).body["num_results"] == 0:
            print("|       => adding", city["name"], "to DB")
            api.city.create(body=city)
        else:
            print("|       => skipping", city["name"])
    print("| city scraping complete")


@click.command()
@click.option("--api", default=BACKEND_BASE, help="The API to use.")
@click.option("-n", "--num-houses", default=20, help="The number of houses to fetch.")
def scrape_houses(api, num_houses):
    api = API(api_root_url=BACKEND_BASE, json_encode_body=True, params={'results_per_page': 10000})

    api.add_resource(resource_name="city")
    api.add_resource(resource_name="housing")
    api.add_resource(resource_name="commute")

    label_city = {
        "locality",
        "sublocality",
        "sublocality_level_1",
        "sublocality_level_2",
        "sublocality_level_3",
        "sublocality_level_4",
    }
    label_state = {"administrative_area_level_1"}

    # arg_dict = {'address': Housing.address, 'zipcode': Housing.zipCode, 'latitude': Housing.latitude,
    #             'longitude': Housing.longitude, 'value': Housing.value, 'area': Housing.area,
    #             'beds': Housing.beds, 'baths': Housing.baths, 'desc': Housing.desc,
    #             'city': City.name, 'state': City.state}

    # Uses Google Geocoding API to find city that a latitude/longitude
    # pair belongs to
    def find_nearest_city(latlng):
        params = {"key": Config.GOOGLE.KEY, "latlng": latlng}
        req = requests.get(url=Config.GOOGLE.BASE, params=params)
        if req.status_code != 200:
            raise requests.ConnectionError(
                f"Could not request lat/long address! {req.status_code}"
            )

        response = req.json()
        if not response["results"]:
            return None

        city, state = None, None
        for component in response["results"][0]["address_components"]:
            typ_set = set(component["types"])
            if typ_set & label_city:
                city = component["long_name"]
            elif typ_set & label_state:
                state = component["long_name"]

        if city is None or state is None:
            return None
        return (city, state)

    # Uses Zillow API to find the details for an individual house
    def get_house_detail(address, city, state, zipCode):
        search_url = f"{Config.ZILLOW.BASE}/GetDeepSearchResults.htm"
        detail_url = f"{Config.ZILLOW.BASE}/GetUpdatedPropertyDetails.htm"

        params = {
            "zws-id": Config.ZILLOW.KEY,
            "address": address,
            "citystatezip": city + ", " + state + " " + zipCode,
            "rentzestimate": True,
        }
        req = requests.get(url=search_url, params=params)
        if req.status_code != 200:
            raise requests.ConnectionError(
                f"Could not request housing detail! {req.status_code}"
            )

        # Zillow returns an XML - retrieve the info that corresponds to housing model
        tree = ElementTree.fromstring(req.content)
        if (
            tree.find("response") is None
            or tree.find("response").find("results").find("result") is None
        ):
            raise requests.ConnectionError(req.content)
        prop = tree.find("response").find("results").find("result")
        item = {"address": address, "zipCode": int(zipCode)}
        zpID = prop.find("zpid").text
        item["latitude"] = float(prop.find("address").find("latitude").text)
        item["longitude"] = float(prop.find("address").find("longitude").text)
        if prop.find("rentzestimate") is not None:
            item["value"] = float(prop.find("rentzestimate").find("amount").text)
        if prop.find("finishedSqFt") is not None:
            item["area"] = float(prop.find("finishedSqFt").text)
        if prop.find("bedrooms") is not None:
            item["beds"] = int(float(prop.find("bedrooms").text))
        if prop.find("bathrooms") is not None:
            item["baths"] = int(float(prop.find("bathrooms").text))

        params = {"zws-id": Config.ZILLOW.KEY, "zpid": zpID}
        req = requests.get(url=detail_url, params=params)
        if req.status_code != 200:
            # May not be able to pull from API - protected data
            # Return what we can?
            return item
            # raise requests.ConnectionError(f'Could not request deep housing detail! {req.status_code}')

        # Retrieve image/description from separate API call
        tree = ElementTree.fromstring(req.content)
        prop = tree.find("response")
        if prop is None:
            raise requests.ConnectionError(req.content)
        if prop.find("homeDescription") is not None:
            item["desc"] = prop.find("homeDescription").text
        if prop.find("images") is not None:
            item["img"] = prop.find("images").find("image").find("url").text

        return item

    # Uses Realtor API to find all available housing for rent in a
    # given city
    def get_city_housing(city, state, num_houses):
        # Data outdated or not present in database
        url = f"{Config.REALTOR.BASE}/properties/list-for-rent"
        headers = {
            "User-Agent": "PostmanRuntime/7.19.0",
            "x-rapidapi-host": "realtor.p.rapidapi.com",
            "x-rapidapi-key": Config.REALTOR.KEY,
            "Content-Type": "application/json",
        }
        params = {
            "sort": "relevance",
            "city": city,
            "state_code": state,
            "limit": str(num_houses),
            "offset": "0",
        }

        req = requests.get(url=url, headers=headers, params=params)
        if req.status_code != 200:
            print("hit", req.request.url, "with headers", headers)
            print("got status", req.status_code, "- returning []")
            return []
            # raise requests.ConnectionError(f'Could not request city housing! {req.status_code}')

        d = req.json()
        for prop in d["listings"]:
            item = {}
            try:
                full_address, city, zipcode = prop["address"].split(", ")
                address = full_address.split(" in")
                item["address"] = address[0]
                item["zipCode"] = int(zipcode)
                item["latitude"] = prop["lat"]
                item["longitude"] = prop["lon"]
            except ValueError:
                print("bad listing, skipping")
                continue
            if "price_raw" in prop:
                item["rent"] = prop["price_raw"]
            if "sqft_raw" in prop:
                item["area"] = prop["sqft_raw"]
            if "beds" in prop:
                try:
                    item["beds"] = int(float(prop["beds"]))
                except ValueError:
                    item["beds"] = 0
            if "baths" in prop:
                try:
                    item["baths"] = int(float(prop["baths"]))
                except ValueError:
                    item["baths"] = 0
            if "photo" in prop:
                item["img"] = prop["photo"].replace(".jpg", "d-w1000_h1000.jpg")

            yield item

    def scrape_city(city_item, num_houses):
        assert city_item is not None

        housing = city_item["housing"]
        if not housing:
            # Generator for items in Realtor
            house_gen = get_city_housing(
                city_item["name"], us.states.lookup(city_item["state"]).abbr, num_houses
            )
            for item in house_gen:
                try:
                    # We trust Zillow more than Realtor - replace info if avaiable on Zillow
                    # Should we bother?? Zillow is more likely to have value for rent and desciption
                    # but are they worth it??????
                    house_detail = get_house_detail(
                        item["address"],
                        city_item["name"],
                        us.states.lookup(city_item["state"]).abbr,
                        str(item["zipCode"]),
                    )
                except requests.ConnectionError as e:
                    # Couldn't connect to Zillow - invalid address or restricted info
                    # Deal with our stupid garbage info from Realtor
                    house_detail = {}

                item.update(house_detail)
                item["city_id"] = city_item["id"]

                print(item)

                item["desc"] = item["desc"].replace('"', "'") if "desc" in item else ""

                # api.housing.createb(body=item)
                requests.post(
                    url=f"{BACKEND_BASE}housing",
                    data=json.dumps(item),
                    headers={"Content-Type": "application/json"},
                )

                # city_item['housing'].append

            housing = city_item["housing"]

        return housing

    for city in api.city.list().body["objects"]:
        print("Scrape for", city["name"], city["state"])
        housing = scrape_city(city, num_houses)
        # print(city["name"], city["state"], ":", housing)


cli.add_command(scrape_cities)
cli.add_command(scrape_houses)

if __name__ == "__main__":
    cli()
