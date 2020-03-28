import React from 'react';
import {Card} from "react-bootstrap";
import {linkedInput} from '../inputs/Linked';
import {basicInput} from '../inputs/Basic';
import {BasicInputInfo, LinkedInputInfo} from '../../FormInterface';


export class CommuteTab extends React.Component<{ [name: string]: any }, {}> {

    homeAddr: LinkedInputInfo = {
        id1: "commutesHome",
        tagName: "homeAddr",
        name: "Home Addr.",
        value: this.props.dict["Commutes"].home,
        otherTagToClear: "commutesAttributes"
    };

    commutesWork: BasicInputInfo = {
        id1: "commutesWork",
        name: "Work Addr.",
        value: this.props.dict["Commutes"].work,
    };

    render() {
        return (
            <div>
                <Card>
                    <Card.Body>
                        <div className='dropDownMenu'>
                            {basicInput(this.commutesWork)}
                            {linkedInput(this.homeAddr)}
                        </div>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}
