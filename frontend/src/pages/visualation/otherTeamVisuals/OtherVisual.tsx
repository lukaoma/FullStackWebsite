import React from 'react';
import NavigationHeader from "../../shared/NavigationHeader";
import ArtistPrices from "./ArtistPrices";
import AvgPrices from "./AVGPrices";
import TexasMap from "./TexasMap";


export default function OtherVisual(props) {
    return (
        <div>
            <NavigationHeader onClickHandler={null}/>
            <button className="btn btn-primary" style={{width: "100%", paddingBottom: "2%"}} type="button"
                    id="loadVisuals2" disabled>
                        <span className="spinner-border spinner-border-sm" style={{marginTop: "2%"}} role="status"
                              aria-hidden="true"/> <span style={{fontSize: 20}}> Loading...</span>
            </button>
            <div>
                <ArtistPrices/>
                <AvgPrices/>
            </div>
            <TexasMap/>
        </div>
    );
}