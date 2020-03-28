import React from 'react';
import NavigationHeader from "../shared/NavigationHeader";
import ChartsViz from "./ChartsViz";
import MapChart from "./MapChart";
import Spline from "./Spline";


export default function MapVisual(props) {
    return (
        <div>
            <NavigationHeader onClickHandler={null}/>
            <button className="btn btn-primary" style={{width: "100%", paddingBottom: "2%"}} type="button"
                    id="loadVisuals" disabled>
                        <span className="spinner-border spinner-border-sm" style={{marginTop: "2%"}} role="status"
                              aria-hidden="true"/> <span style={{fontSize: 20}}> Loading...</span>
            </button>
            <ChartsViz/>
            <MapChart/>
            <Spline/>
        </div>
    );
}

