import React, {useEffect, useState} from "react";
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import ReactFC from "react-fusioncharts";
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import TimeSeries from "fusioncharts/fusioncharts.timeseries";
import config from "../../../config";

// Resolves charts dependancy
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);
Charts(FusionCharts);

ReactFC.fcRoot(FusionCharts, TimeSeries);
const dataStore = new FusionCharts.DataStore();

// const data1 = [
//     [
//         "2020-02-29",
//         "Eagles",
//         calPrice("129.0 - 750.0")
//     ]];

function calPrice(range: string) {
    try {
        range = range.replace("-", "");
        const holder: string[] = range.split(" ");
        return (parseFloat(holder[0]) + parseFloat(holder[0])) / 2;
    } catch (e) {
        return 30;
    }
}

const schema = [{
    "name": "Date",
    "type": "date",
    "format": "%Y-%m-%d"
},
    {
        "name": "Artist",
        "type": "string"
    },
    {
        "name": "Ticket Price",
        "type": "number"
    }
];

const dataSource = {
    chart: {},
    caption: {
        text: "Average Ticket Price by Artist"
    },
    subcaption: {
        text: "From October 2019 - December 2019"
    },
    series: "Artist",
    yaxis: [
        {
            plot: [
                {
                    value: "Ticket Price",
                    type: "column"
                }
            ],
            title: "Ticket Prices",
            format: {
                prefix: "$"
            }
        }
    ],
    data: undefined
};

export default function AvgPrices(props) {
    const [charFig, setCharFig] = useState({
        type: "timeseries",
        renderAt: "container",
        width: "70%",
        height: "20%",
        dataSource: dataSource
    });

    useEffect(() => {
        const url = config.PATH + "resonance/events.json";
        fetch(url)
            .then((resp) => resp.json())// Transform the data into json
            .then(function (data) {
                    console.log(data);
                    const dataArtistHolder = [];
                    for (let artist of data) {
                        const info = [
                            artist["date"],
                            artist["artist"],
                            calPrice(artist["price"])
                        ];
                        if (!(artist["date"] + "").includes("2020")) {
                            dataArtistHolder.push(info);
                        }
                    }
                    setCharFig(old => {
                        const newOld = JSON.parse(JSON.stringify(old));
                        newOld.dataSource.data = dataStore.createDataTable(dataArtistHolder, schema);
                        return newOld;
                    });
                }
            );
    }, []);
    return (
        <ReactFC {...charFig} />
    );
}

