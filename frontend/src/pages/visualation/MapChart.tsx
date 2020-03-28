import React from "react";
import {ComposableMap, Geographies, Geography} from "react-simple-maps";
import MarkerList from "./MarkerList";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const MapChart = () => {
    return (
        <div className="visualMapBox">
            <ComposableMap projection="geoAlbers">
                <Geographies geography={geoUrl}>
                    {({geographies}) =>
                        geographies.map(geo => (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                stroke="#FFF"
                                fill="#ffeecc"
                            />
                        ))
                    }
                </Geographies>
                <MarkerList/>
            </ComposableMap>
        </div>
    );
};

export default MapChart;
