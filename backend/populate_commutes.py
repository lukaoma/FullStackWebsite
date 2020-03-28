import requests
import random
import json


base_url = "https://api.costlycommute.me"
per_city = 8

cities = requests.get(f"{base_url}/api/city", params={"results_per_page": 10000}).json()[
    "objects"
]
for city in cities:
    housing = random.choices(city["housing"], k=min(per_city, len(city["housing"])))
    for idx, house in enumerate(housing):
        for sec in (housing[i] for i in range(idx + 1, len(housing))):
            filters = [
                {
                    "name": "home",
                    "op": "eq",
                    "val": f"{house['latitude']},{house['longitude']}",
                },
                {
                    "name": "work",
                    "op": "eq",
                    "val": f"{sec['latitude']},{sec['longitude']}",
                },
            ]
            try:
                print(
                    requests.get(
                        f"{base_url}/api/commute",
                        params={"q": json.dumps({"filters": filters})},
                    ).text
                )
            except Exception:
                continue
