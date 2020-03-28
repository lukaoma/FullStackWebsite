import React, {useEffect, useState} from 'react';
import {Marker} from "react-simple-maps";
import config from "../../config";
import {CityApiCall} from "../model/shared/ApiInterface";


interface Locale {
    lat: number,
    long: number
}

function MarkerList(props) {
    const [location, setlocation] = useState(Array<Locale>());
    useEffect(() => {
        for (let index = 1; index < 10; index++) {

        }
        const url = config.PATH + "api/city?page=1&results_per_page=100001";
        getHomes(url);
    }, []);


    const getHomes = (where: string) => {
        fetch(where)
            .then((resp) => resp.json()) // Transform the data into json
            .then(function (data) {
                // Create and append the li's to the ul
                setlocation(old => {
                    const allCites: CityApiCall[] = data["objects"];
                    allCites.sort((a, b) => a.population - b.population);
                    const hold = [];
                    for (let city of allCites) {
                        let houseIndex = 0;
                        for (let fill of city.housing) {
                            houseIndex++;
                            const newLocale: Locale = {
                                lat: fill.longitude,
                                long: fill.latitude
                            };
                            hold.push(newLocale);
                            if (houseIndex === 10) {
                                break;
                            }
                        }
                    }
                    document.getElementById("loadVisuals").style.display = "none";
                    return [...old, ...hold];
                })
            });
    };

    return (
        <>
            {location.map((item, index) =>
                <Marker key={index} coordinates={[item.lat, item.long]}>
                    <g
                        fill="none"
                        stroke="#FF5533"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        transform="translate(-12, -24)"
                    >
                        <circle cx="12" cy="10" r="1"/>
                        <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/>
                    </g>
                </Marker>,
            )}
        </>
    );
}

export default MarkerList;