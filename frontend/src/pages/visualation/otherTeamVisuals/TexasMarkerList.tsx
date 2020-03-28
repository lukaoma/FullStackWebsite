import React, {useEffect, useState} from 'react';
import {Marker} from "react-simple-maps";
import config from "../../../config";

interface Locale {
    lat: number,
    long: number
}

function TexasMarkerList(props) {
    const [location, setLocation] = useState(Array<Locale>());
    useEffect(() => {
        const url = config.PATH + "resonance/events.json";
        getEvents(url);
    }, []);

    const getEvents = (where: string) => {
        setTimeout(function () {
            fetch(where)
                .then((resp) => resp.json()) // Transform the data into json
                .then(function (data) {
                    // Create and append the li's to the ul
                    setLocation(old => {
                        const hold = [];
                        for (let event of data) {
                            const newLocale: Locale = {
                                lat: event["longitude"],
                                long: event["latitude"]
                            };
                            hold.push(newLocale);
                        }
                        return [...hold];
                    })
                });
        }, 3000);
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

export default TexasMarkerList;