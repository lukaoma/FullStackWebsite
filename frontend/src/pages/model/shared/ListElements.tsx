import React from 'react';
import {Button, Card} from 'react-bootstrap';

import {isFormClosed} from './Transition';
import * as Adjustments from '../../shared/DisplayAdjustments';
import {deepSaveState} from '../../../actions';
import {connect} from 'react-redux';

function getHighlightedText(text, highlight) {
    try{
        // Split on higlight term and include term into parts, ignore case
        let parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        return <span> { parts.map((part, i) => 
            <span key={i} style={part.toLowerCase() === highlight.toLowerCase() ? { backgroundColor: '#FFFF00' } : {} }>
                { part }
            </span>)
        } </span>;
    } catch(e) {
        console.log(e);
        return text;
    }
}

function highLightName(modelName, name, highlight){
    switch(modelName){
        case "Cities":
            return (<h3>{getHighlightedText(name, highlight)}</h3>);
        default:
            return (<h3>{name}</h3>);
    }
}

function Attribute({...props}) {
    if(props.modelName === "Homes" && props.attr === "address_modified"){
        let parsed = props.val.split(',');
        return (
            <div>
                <b>{Adjustments.removeUnder(props.attr)}</b>: {parsed[0] + ","} {getHighlightedText(parsed[1], props.highlight)} {"," + parsed[2]} <br/>
            </div>
        );
    }
    if (Adjustments.keyConstraints1(props.attr, props.modelName)) {
        return (
            <div>
                <b>{Adjustments.removeUnder(props.attr)}</b>: {props.val} <br/>
            </div>
        );
    }
    return (<div/>);
}

class ListElements extends React.Component<{ [name: string]: any }, {}> {

    deepSaveState = () => {
        this.props.dispatch(deepSaveState());
    };

    linkToInstance() {
        this.deepSaveState();
        let url = "/instance?pageNum=" + this.props.element.pageNum +
            "&index=" + this.props.element.index +
            "&modelName=" + this.props.modelName;
        window.open(
            url,
            '_self'
        );
    }

    selectHandler(ele) {
        let elements = document.getElementsByClassName("readMore");
        for (let i = 0; i < elements.length; i++) {
            document.getElementsByClassName("readMore")[i].innerHTML = "Compare";
        }

        this.props.selectHandler(ele);
    }

    render() {
        let outerClasses: string = isFormClosed ? "cardHolder col-sm-2" : "cardHolder col-sm-3";
        let innerClasses = (this.props.element.hasOwnProperty('ghost'))
            ? "!cardStyle ghostCard"
            : "!cardStyle";
        let ele = this.props.element;

        return (
            <div className={outerClasses}>
                <Card className={innerClasses}>
                    <div style={{backgroundImage: `url(${ele.image})`}} className='cardImg'></div>
                    <Card.Body>
                        {highLightName(this.props.modelName, ele.name, this.props.highlight)}
                        <div>
                            {Object.keys(ele).map(attr =>
                                <div key={attr}>
                                    <Attribute highlight={this.props.highlight} modelName={this.props.modelName} attr={attr} val={ele[attr]}/>
                                </div>
                            )}
                        </div>
                        <Button onClick={() => this.selectHandler(ele)}> Select </Button>
                        <Button className="readMore" onClick={() => this.linkToInstance()}> Read More </Button>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        count: state.count,
        Cities: state.Cities,
    };
}

export default connect(mapStateToProps)(ListElements);
