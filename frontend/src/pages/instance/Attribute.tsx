import React from 'react';
import { removeUnder, keyConstraints2 } from '../shared/DisplayAdjustments';
export function Attribute({ ...props }) {
    // special case
    if (props.attr === 'desc') {
        if (props.val !== '') {
            return (<div>
                <b>{props.val}</b> <br /><br />
            </div>);
        }
        else {
            return (<div />);
        }
    }
    if (keyConstraints2(props.attr, props.modelName)) {
        return (<div>
            <b>{removeUnder(props.attr)} : {props.val}</b> <br />
        </div>);
    }
    return (<div />);
}
export function AttributeList({ ...props }) {
    return (<div>
        <h3>{props.title}</h3>
        <div>
            {Object.keys(props.element).map((attr, idx) => <Attribute key={idx} modelName={props.modelName} attr={attr} val={props.element[attr]} />)}
        </div>
    </div>);
}
