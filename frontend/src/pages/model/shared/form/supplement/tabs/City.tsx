import React from 'react';
import {Card} from "react-bootstrap";
import {MenuRangeAttributes} from '../inputs/Common';
import {linkedInput} from '../inputs/Linked';
import {LinkedInputInfo, RangeInputInfo} from '../../FormInterface';

export function CityTab({...props}) {
    console.log("rendering city form");
    let citiesAttributes: Array<RangeInputInfo> = [
        {
            id1: "citiesAgeMin",
            id2: "citiesAgeMax",
            tagName: "citiesAttributes",
            name: "Median Age",
            value: props.dict["Cities"].median_age,
            otherTagToClear: "citiesName",
        },
        {
            id1: "citiesPopulationMin",
            id2: "citiesPopulationMax",
            tagName: "citiesAttributes",
            name: "Population",
            value: props.dict["Cities"].population,
            otherTagToClear: "citiesName",
        },
        {
            id1: "citiesWagesMin",
            id2: "citiesWagesMax",
            tagName: "citiesAttributes",
            name: "Median Wage",
            value: props.dict["Cities"].median_wage,
            otherTagToClear: "citiesName",
        },
    ];

    let citiesName: LinkedInputInfo = {
        id1: "citiesName",
        tagName: "citiesName",
        name: "City",
        value: props.dict["Cities"].name,
        otherTagToClear: "citiesAttributes"
    };

    let stateName: LinkedInputInfo = {
        id1: "citiesState",
        tagName: "stateName",
        name: "State",
        value: props.dict["Cities"].state,
        otherTagToClear: null
    }

    console.log(props.dict["Cities"].name);
    return (
        <div>
            <Card>
                <Card.Body>
                    <div className='dropDownMenu'>
                        {linkedInput(citiesName)}
                        {linkedInput(stateName)}
                        <MenuRangeAttributes name={"Cities Attributes"} attributes={citiesAttributes}/>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );

}
