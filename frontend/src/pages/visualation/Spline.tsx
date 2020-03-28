import React, {useEffect, useState} from 'react';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import ReactFC from 'react-fusioncharts';
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import config from "../../config";
import {CityApiCall} from "../model/shared/ApiInterface";

ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);
const graphWidth: string = "100%";
const graphHeight: number = 500;
const url = config.PATH + "api/city?page=1&results_per_page=1000";

export default function Spline(props) {
    const dataSourceMY = {
        chart: {
            caption: "Living Above Your Means",
            yaxisname: "Annual Income",
            numbersuffix: "",
            subcaption: "(Median Annual Income Vs Median Rent Annually)",
            yaxismaxvalue: "2",
            plottooltext:
                "$seriesName 's  average income is <b>$dataValue</b> $label",
            theme: "fusion"
        },
        categories: [
            {
                category: []
            }
        ],
        dataset: [
            {
                seriesname: "Annually Income",
                data: []
            },
            {
                seriesname: "Annually Average Rent",
                data: []
            }
        ]
    };

    const [charFig, setCharFig] = useState({
        type: "mssplinearea",
        width: graphWidth,
        height: graphHeight,
        dataFormat: "JSON",
        dataSource: dataSourceMY
    });

    useEffect(() => {
        // return annual version of housing
        const findAverageHousePrice = (currentCity: CityApiCall): number => {
            currentCity.housing.sort((a, b) => a.rent - b.rent);
            let mid = (currentCity.housing.length / 2) >> 0;
            return (currentCity.housing[mid].rent) * 12;
        };
        const createDataSource = () => {
            fetch(url)
                .then((resp) => resp.json()) // Transform the data into json
                .then(function (data) {
                    const allCites: CityApiCall[] = data["objects"];
                    allCites.sort((a, b) => (a.name.localeCompare(b.name)));
                    const cateHold = [];
                    const pricesHold = [];
                    const incomeHold = [];
                    for (let currentCity of allCites) {
                        if (currentCity.housing !== null && currentCity.housing.length > 0) {
                            const cityName = {label: currentCity.name + ", " + currentCity.state};
                            const averagePrice = {value: findAverageHousePrice(currentCity)};
                            const averageIncome = {value: currentCity.median_wage};
                            if (averagePrice.value / averageIncome.value > .5) {
                                cateHold.push(cityName);
                                pricesHold.push(averagePrice);
                                incomeHold.push(averageIncome);
                            }
                        }
                    }
                    setCharFig(old => {
                        const newOld = JSON.parse(JSON.stringify(old));
                        newOld.dataSource.categories = [{category: cateHold}];
                        newOld.dataSource.dataset[0].data = incomeHold;
                        newOld.dataSource.dataset[1].data = pricesHold;
                        return newOld;
                    })
                });
        };
        createDataSource();
    }, []);


    return (
        <ReactFC{...charFig}/>
    );
};
