import React from 'react';
import {Col, Pagination, Row} from "react-bootstrap";
import {strict as assert} from 'assert';
import {MyCards} from './Carding';
import {clearModels} from '../../../../actions';
import {connect} from 'react-redux';

const totalPagesInBar: number = 4;

class MyPages extends React.Component<{[name: string]: any}, {}> {
    myCardsElement: React.RefObject<MyCards> = React.createRef();
    pageNum: number = 1
    modelName = "";
    clearModels = () => { this.props.dispatch(clearModels()); }

    state = {
        citiesQuery: this.props.queryStringsDict["citiesQuery"],
        commutesQuery: this.props.queryStringsDict["commutesQuery"],
        homesQuery: this.props.queryStringsDict["homesQuery"],
        highlight: "",
    };

    componentDidUpdate(){
        console.log("HITTING AUTO UPDATE")
        console.log(this.modelName);
        console.log(this.props.modelName);
        if(this.props.modelName !== this.modelName){
            this.modelName = this.props.modelName;
            this.clearModels();
            console.log(this.props.queryStringsDict["homesQuery"]);
            this.updateState(this.props.queryStringsDict, "");
        }
    }

    updateInnerHtml(operation: number) {
        assert(operation === 1 || operation || -1);
        for (let i = 1; i <= totalPagesInBar; i++) {
            let id: string = i.toString();
            const k: number = totalPagesInBar * operation;
            const obj = document.getElementById(id);
            let element: number = Number(obj.innerHTML);
            obj.innerHTML = (element + k).toString();
        }
    }

    updateState(queryStringsDict, highlight) {
        this.setState({
            citiesQuery: queryStringsDict["citiesQuery"],
            commutesQuery: queryStringsDict["commutesQuery"],
            homesQuery: queryStringsDict["homesQuery"],
            highlight: highlight,
        })

    }

    getCurrentQuery() {
        switch (this.props.modelName) {
            case 'Cities':
                return this.state.citiesQuery;
            case 'Commutes':
                return this.state.commutesQuery;
            case 'Homes':
                return this.state.homesQuery;
            default:
                throw new Error("entered bad case: " + this.props.modelName)
        }
    }

    updateCardSet(cardSetNum: number) {
        let next = document.getElementById(cardSetNum.toString());
        next.classList.add("currentPage");
        //alert(this.getCurrentQuery());
        this.myCardsElement.current.updateCards(this.pageNum, this.getCurrentQuery());
    }

    updatePage(nextPage: number) {
        document.getElementsByClassName('currentPage')[0].classList.remove("currentPage");

        // if you are on the first page, don't go back
        if (nextPage === 0 && this.pageNum - totalPagesInBar < 1) {
            this.pageNum = 1;
            this.updateCardSet(this.pageNum);
            return;
        }

        assert(this.pageNum >= 1);

        switch (nextPage) {
            case 0:
                this.pageNum -= totalPagesInBar;
                this.updateInnerHtml(-1);
                break;
            case totalPagesInBar + 1:
                this.pageNum += totalPagesInBar;
                this.updateInnerHtml(1);
                break;
            default:
                this.pageNum = Number(document.getElementById(nextPage.toString()).innerHTML);
        }

        // handles poping fort current page
        // also handles reloading the cards
        let value: number = this.pageNum % totalPagesInBar;
        if (value === 0) {
            value += totalPagesInBar;
        }

        // handles reloading the cards
        this.updateCardSet(value);
    }

    render() {
        console.log("rendering pagination with name: " + this.props.modelName + " " + this.getCurrentQuery());
        return (
            <div>
                <Row>
                    <Col>
                        <Pagination>
                            <Pagination.Prev onClick={() => this.updatePage(0)}/>
                            <Pagination.Item id='1' onClick={() => this.updatePage(1)}
                                             className='currentPage'>1</Pagination.Item>
                            <Pagination.Item id='2' onClick={() => this.updatePage(2)}>2</Pagination.Item>
                            <Pagination.Item id='3' onClick={() => this.updatePage(3)}>3</Pagination.Item>
                            <Pagination.Item id='4' onClick={() => this.updatePage(4)}>4</Pagination.Item>
                            <Pagination.Next onClick={() => this.updatePage(5)}/>
                        </Pagination>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <MyCards queryString={this.getCurrentQuery()} highlight={this.state.highlight} handler={this.props.handler}
                                 modelName={this.props.modelName} ref={this.myCardsElement}/>
                    </Col>
                </Row>

            </div>
        );
    }
}

export default connect(null, null, null, {forwardRef: true})(MyPages);