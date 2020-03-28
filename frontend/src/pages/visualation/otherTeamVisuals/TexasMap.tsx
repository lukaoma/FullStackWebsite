import React from "react";
import {ComposableMap, Geographies, Geography} from "react-simple-maps";
import TexasMarkerList from "./TexasMarkerList";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const TexasMap = () => {
    function getState(geo: any) {
        if (geo.properties.name === "Texas") {
            const start = <Geography
                key={geo.rsmKey}
                geography={geo}
                stroke="#FFF"
                fill="#d3e1f9"
            />;
            return start
        }
    }

    return (
        <div className="visualMapBox2">
            <ComposableMap projection="geoAlbers" className="TexasMap">
                <Geographies geography={geoUrl}>
                    {({geographies}) =>
                        geographies.map(geo => (
                            getState(geo)
                        ))
                    }
                </Geographies>
                <TexasMarkerList/>
            </ComposableMap>
        </div>
    );
};

export default TexasMap;
