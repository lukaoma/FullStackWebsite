import React from 'react';
import {Card, CardGroup} from "react-bootstrap";
import NavigationHeader from '../shared/NavigationHeader';
import { connect } from 'react-redux';
import { deepLoadState } from '../../actions';
import { CityInstance } from './CityInstance';
import { HousingInstance } from './HousingInstance';
import { CommuteInstance } from './CommuteInstance';
import { AttributeList } from './Attribute';

class InstancePage extends React.Component<{ [name: string]: any }, {}> {

    queryString = require('query-string');
    parsedString = this.queryString.parse(this.props.location.search);
    modelName = this.parsedString["modelName"];
    pageNum = this.parsedString["pageNum"];
    index = this.parsedString["index"];

    constructor(props) {
        super(props);
        this.props.dispatch(deepLoadState());

        this.getNoCompareText = this.getNoCompareText.bind(this);
        this.getModelData = this.getModelData.bind(this);

    }
    getNoCompareText = () => {
        return(<div>
                <Card.Body><b>press Select on a Model page card to compare</b></Card.Body>
            </div>);
    };

    getModelData = () => {
        let page;
        let e;
        switch (this.modelName) {
            
            case "Cities":
                page = this.props.Cities[this.pageNum];
                e = page ? page[this.index] : null;

                return [e,
                    (element) => <CityInstance element={element}/>,
                    this.props.LastCity];
            case "Commutes":
                page = this.props.Commutes[this.pageNum];
                e = page ? page[this.index] : null;

                return [e, 
                    (element) => <CommuteInstance element={element}/>,
                    this.props.LasteCommute];
            case "Homes":
                page = this.props.Homes[this.pageNum];
                e = page ? page[this.index] : null;

                return [e, 
                    (element) => <HousingInstance element={element}/>,
                    this.props.LastHome];

            default:
                throw new Error("entered bad case: " + this.modelName);
        }
    };

    

    // this gets rendered twice for some reason
    // first time the page is undefined
    // second time, the page is populated
    render() {
        const [element, component, prev] = this.getModelData();

        return (
            <div>
                <NavigationHeader onClickHandler={null}/>
                <CardGroup>
                    {element ? component(element) : "No ELEMENT"}
                    <div className='verticalLine'/>
                    <Card>
                        {prev ? component(prev) : this.getNoCompareText()}
                    </Card>
                </CardGroup>
            </div>
        );
    }


}

function mapStateToProps(state) {
    return {
        Cities: state.Cities,
        Commutes: state.Commutes,
        Homes: state.Homes,

        LastCity: state.LastCity,
        LastCommute: state.LastCommute,
        LastHome: state.LastHome,
    };
}

export default connect(mapStateToProps)(InstancePage);