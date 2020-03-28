import React from 'react';
import {Button, Col, Container, Jumbotron, Row} from "react-bootstrap";
import {connect} from 'react-redux';

import NavigationHeader from "../shared/NavigationHeader";
import {formTransition} from "./shared/Transition"
import ModelForm from "./shared/form/Form";

import {clearModels, deepSaveState, updateSelect, updateSearchBarVal} from '../../actions'
import {City, Commute, Home, Model} from "./shared/ModelInterface";
import secondPanelRight from './second-panel-right.jpg';
import MyPages from "./shared/pagination/Paging";
import {createFormQuery} from './shared/form/ParseForm';

class ModelPage extends React.Component<{ [name: string]: any }, {}> {

    // NOTE: THERE SHOULD BE NO FORCE UPDATES IN MODEL
    myPagesElement;

    clearModels = () => { this.props.dispatch(clearModels()); }
    deepSaveState = () => { this.props.dispatch(deepSaveState()); }
    updateSelect = (modelName, element) => { this.props.dispatch(updateSelect(modelName, element)); }

    queryDict: { [name: string]: any } = {
        "Cities": {} as City,
        "Commutes": {} as Commute,
        "Homes": {} as Home,
    };

    constructor(props) {
        super(props);
        this.selectHandler = this.selectHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.resetHandler = this.resetHandler.bind(this);
        this.searchHandler = this.searchHandler.bind(this);        
    }

    updateSearchBarVal = (val1) => {
        this.props.dispatch(updateSearchBarVal(val1));
    };

    updatePages = (queryStringsDict, highlight) => {
        this.myPagesElement.updateState(queryStringsDict, highlight);
    };

    // handle synchronization here; some models share attributes
    selectHandler(element: Model) {
        this.updateSelect(this.props.modelName, element);
    }

    // needs to be doubled clicked; what about automatically adjusting?
    submitHandler(cityName: string = null) {
        this.clearModels();
        let val;
        if (cityName != null) {
            val = createFormQuery(cityName);
        } else {
            val = createFormQuery();
        }
        (document.getElementById("searchInput") as HTMLInputElement).value = "";
        this.updateSearchBarVal("");
        this.deepSaveState();
        this.updatePages(val, cityName);
    }

    clearForm() {
        let elements = document.getElementsByClassName("formResetButton");
        for (let i = 0; i < elements.length; i++) {
            (elements[i] as HTMLButtonElement).click();
        }
    }

    resetHandler() {
        this.clearForm();
        this.submitHandler();
    }

    searchHandler(cityName: string) {
        this.clearForm();
        this.submitHandler(cityName);
    }

    render() {
        console.log("rendering model");
        
        let val;
        if(this.props.search !== undefined){
            val = this.props.search;
        } else {
            val = this.props.SearchBarVal;
        }

        return (
            <div>
                <NavigationHeader onClickHandler={this.searchHandler}/>
                <div className="d-flex justify-content-center">
                    <button className="btn btn-primary" type="button" id="loadingWait3"
                            disabled>
                        <span className="spinner-border spinner-border-sm" role="status"
                              aria-hidden="true"></span> Loading...
                    </button>
                </div>
                <div style={{width: '100%'}}>
                    <div className='fullScreen'>
                        <Container fluid>
                            <Row>
                                <Col id="blockWithForm" style={{backgroundImage: `url(${secondPanelRight})`}}
                                     className='fullScreen disappearForm stickyForm col-md-0'>
                                    <Container className='h-100'>
                                        <Row className='align-items-center h-100'>
                                            <Col className='mx-auto'>
                                                <Jumbotron className='text-center jumbo-center'
                                                           style={{backgroundColor: 'rgba(255,255,255,0.6)'}}>
                                                    <ModelForm
                                                        queryHandler={this.submitHandler}
                                                        resetHandler={this.resetHandler}
                                                        myDict={this.queryDict}
                                                    />
                                                </Jumbotron>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Col>
                                <Col id='blockWithElse' className='col-md-11 ml-4'>
                                    <Row className='mb-2 mt-3'>
                                        <h1><strong>{this.props.modelName}</strong></h1>
                                    </Row>
                                    <Row className='mb-4'>
                                        <Button id="toggleFormButton" onClick={() => {
                                            formTransition()
                                        }}>Open Query</Button>
                                    </Row>
                                    <Row>
                                        <MyPages handler={this.selectHandler} modelName={this.props.modelName}
                                                 ref={ref => this.myPagesElement = ref} queryStringsDict={createFormQuery(val, true)}/>
                                    </Row>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        Cities: state.Cities,
        Commutes: state.Commutes,
        Homes: state.Homes,

        SearchBarVal: state["SearchBarVal"],
    };
}

export default connect(mapStateToProps)(ModelPage);
