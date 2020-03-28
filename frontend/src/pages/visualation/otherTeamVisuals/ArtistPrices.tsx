import React, {useEffect, useState} from "react";
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import ReactFC from "react-fusioncharts";
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import config from "../../../config";

// Resolves charts dependancy
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);
Charts(FusionCharts);


export default function ArtistPrices(props) {

    const dataSource = {
        chart: {
            caption: "Artist by Popularity",
            yaxisname: "Popularity Rank",
            aligncaptionwithcanvas: "0",
            plottooltext: "<b>$Label</b> ranked <b>$dataValue</b>",
            theme: "fusion"
        },
        data: [
            {
                label: "Travel & Leisure",
                value: "41"
            },
        ]
    };

    const [charFig, setCharFig] = useState({
        type: "bar2d",
        width: "75%",
        height: "50%",
        dataFormat: "JSON",
        dataSource: dataSource
    });

    useEffect(() => {
        const url = config.PATH + 'resonance/artist.json';
        fetch(url).then((response) => response.json())// Transform the data into json
            .then(function (data) {
                const newData = [];
                for (let event of data) {
                    const artist = {
                        label: event["name"],
                        value: event["popularity"] + ""
                    };
                    newData.push(artist);
                }
                setCharFig(old => {
                    const newOld = JSON.parse(JSON.stringify(old));
                    newOld.dataSource.data = newData;
                    return newOld;
                });
            }).catch(function (err) {
            console.log(err)
        });
        document.getElementById("loadVisuals2").style.display = "none";
    }, []);
    return (
        <ReactFC {...charFig}/>
    );
}

