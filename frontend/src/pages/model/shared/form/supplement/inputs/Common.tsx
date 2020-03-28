import React from 'react';
import {rangeInput} from './Range';

export function updateAllElementsWithTag(tagName: string, newValue: string) {
    if (tagName == null) return;
    const listOfElements = document.getElementsByName(tagName);
    listOfElements.forEach(element => {
        const x = element as (HTMLInputElement | any);
        x.value = newValue;
    });
}

export function linkedInputOnChangeHelper(id, tagName) {
    const x = (document.getElementById(id) as (HTMLInputElement | any)).value;
    updateAllElementsWithTag(tagName, x);
}

export class MenuRangeAttributes extends React.Component<{ [name: string]: any }, {}> {
    id = "id=" + this.props.name.replace(" ", "-");

    render() {
        console.log("rendering menu attributes");
        return (
            <div>
                <div id={this.id}>
                    {this.props.attributes.map(function (element, key) {
                        return <div key={key} >{rangeInput(element)}</div>;
                    })}
                </div>

            </div>
        );
    }
}