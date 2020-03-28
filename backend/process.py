from flask import abort
import requests
import utils


def commute_preprocess_many(search_params: dict = None, **kw):
    """ Runs before each GET request for commutes using search parameters/list requests.
    Normalizes address in home and work parameters into latitude/longitude coordinates for processing.
    Because search_params has to be modified in-place, nothing is returned.

    Parameters
    --------------
    search_params : dict
        The Flask-RESTless query parameters stored in a dictionary.
    """
    if search_params is not None and "filters" in search_params:
        for p in search_params["filters"]:
            if p["name"] == "home":
                try:
                    pair = utils.decode_address_string(p["val"])
                except requests.exceptions.RequestException as e:
                    abort(404, "Address Decode - Google couldn't hack it")
                p["val"] = f"{pair['lat']},{pair['lng']}"
            elif p["name"] == "work":
                try:
                    pair = utils.decode_address_string(p["val"])
                except requests.exceptions.RequestException as e:
                    abort(404, "Address Decode - Google couldn't hack it")
                p["val"] = f"{pair['lat']},{pair['lng']}"


def commute_postprocess_single(result: dict = None, **kw):
    """ Runs after each GET request for commutes using identifier number.
    Converts a database instance's information into usable information.
    Because result has to be modified in-place, nothing is returned.

    Parameters
    ---------------
    result : dict
        The dictionary representation of the JSON the ID corresponds to in the database.
    """
    if result is None:
        return

    temp = {}
    temp.update(result)
    result.clear()
    result.update(utils.commute_return(temp))


def commute_postprocess_many(result: dict = None, search_params: dict = None, **kw):
    """ Runs after each GET request for commutes using search parameters/list requests.
    Generates commute if none are found for a home/work pair.
    Because result has to be modified in-place, nothing is returned.

    Parameters
    ---------------
    result : dict
        The dictionary representation of the JSON the ID corresponds to in the database.
    """
    if result is None:
        return

    if len(result["objects"]) > 0:
        # Query contains results - convert commute database object to user data
        res = []
        for t in result["objects"]:
            try:
                commute = utils.commute_return(t)
            except requests.exceptions.RequestException as e:
                abort(404, "Database conversion - Google couldn't hack it")

            res.append(commute)
        result["objects"] = res

    else:
        # Query didn't return results - find home/work/mode parameters if passed
        result["objects"] = []
        result["num_results"] = 0

        p_names = {"home", "work", "mode"}
        params = utils.retrieve_params(search_params, p_names)

        if "home" in params and "work" in params:
            # Generate commutes for all 3 modes if home/work parameters passed
            modes = ("transit", "driving", "walking")
            for m in modes:
                # Skip generation if possibly filtering existing commutes (parameters other than home/work)
                if "mode" in params and len(search_params["filters"]) > 3:
                    continue
                elif "mode" not in params and len(search_params["filters"]) > 2:
                    continue

                try:
                    commute = utils.commute_log_data(params["home"], params["work"], m)
                except requests.exceptions.RequestException as e:
                    abort(404, "Request commute - Google couldn't hack it")
                if "mode" not in params or ("mode" in params and m == params["mode"]):
                    result["objects"] += commute
            result["num_results"] = len(result["objects"])
