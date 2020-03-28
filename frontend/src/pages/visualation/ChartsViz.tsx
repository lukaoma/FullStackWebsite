import React, {useEffect, useState} from 'react';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import ReactFC from 'react-fusioncharts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import config from "../../config";
import {CityApiCall} from "../model/shared/ApiInterface";

const url = config.PATH + "api/city?results_per_page=1000";

ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);
Charts(FusionCharts);

const graphWidth: string = "100%";
const graphHeight: number = 400;
// const graphType: string = "column2d";
const graphType: string = "scrollcombidy2d";

export default function ChartsViz() {
    const dataSourceMY = {
        chart: {
            caption: "Analysing the Poverty rate by Number of Employed",
            subcaption: "By City Population",
            yaxisname: "Population Count",
            syaxisname: "Unemployment",
            labeldisplay: "rotate",
            snumbersuffix: "%",
            scrollheight: "10",
            numvisibleplot: "10",
            drawcrossline: "1",
            theme: "fusion"
        },
        categories: [
            {
                category: []
            }
        ],
        dataset: [
            {
                seriesname: "Total Population",
                plottooltext: "Population: $dataValue",
                data: []
            },

            {
                seriesname: "Poverty Rate %",
                parentyaxis: "S",
                renderas: "line",
                plottooltext: "$dataValue Poverty Rate",
                showvalues: "0",
                data: []
            },
            {
                seriesname: "Employed",
                renderas: "area",
                showanchors: "0",
                plottooltext: "Employed: $dataValue",
                data: []
            },
        ]
    };

    const [charFig, setCharFig] = useState({
        type: graphType,
        width: graphWidth,
        height: graphHeight,
        dataFormat: "JSON",
        dataSource: dataSourceMY
    });
    useEffect(() => {
        createDataSource()
    }, []);

    const createDataSource = () => {
        fetch(url)
            .then((resp) => resp.json()) // Transform the data into json
            .then(function (data) {
                    const allCites: CityApiCall[] = data["objects"];
                    allCites.sort((a, b) => (a.name.localeCompare(b.name)));
                    const categoryHold = [];
                    const populationHold = [];
                    const povertyHold = [];
                    const employHold = [];
                    for (let currentCity of allCites) {
                        const currentCatLabel = {
                            label: currentCity.name + ", " + currentCity.state
                        };
                        const values = {
                            value: currentCity.population
                        };
                        if (currentCity.poverty_rate * 100 < 10) {
                            currentCity.poverty_rate = currentCity.poverty_rate * 10;
                        }
                        const poverty = {
                            value: currentCity.poverty_rate * 100
                        };
                        const employ = {
                            value: currentCity.num_employees
                        };
                        if (values.value < 3000000 && 800000 < values.value) {
                            categoryHold.push(currentCatLabel);
                            populationHold.push(values);
                            povertyHold.push(poverty);
                            employHold.push(employ);
                        }
                    }
                    setCharFig(old => {
                        const newOld = JSON.parse(JSON.stringify(old));
                        newOld.dataSource.categories = [{category: categoryHold}];
                        newOld.dataSource.dataset[0].data = populationHold;
                        newOld.dataSource.dataset[1].data = povertyHold;
                        newOld.dataSource.dataset[2].data = employHold;
                        return newOld;
                    })
                }
            )
    };
    return (
        <div>
            <ReactFC {...charFig} />
        </div>
    );
}
