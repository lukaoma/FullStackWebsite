import React from 'react';
import {Button, Tab, Tabs} from "react-bootstrap";
import {CityTab} from './supplement/tabs/City';
import {CommuteTab} from './supplement/tabs/Commute';
import {HomeTab} from './supplement/tabs/Home';
import {connect} from 'react-redux';

class ModelForm extends React.Component<{ [name: string]: any }, {}> {

    render() {
        console.log("rendering form");
        return (
            <div>
                <Tabs defaultActiveKey={"Cities"} id="uncontrolled-tab-example">
                    <Tab eventKey="Cities" title="City">
                        <CityTab dict={this.props.myDict}/>
                    </Tab>
                    <Tab eventKey="Commutes" title="Commute">
                        <CommuteTab dict={this.props.myDict}/>
                    </Tab>
                    <Tab eventKey="Homes" title="Home">
                        <HomeTab dict={this.props.myDict}/>
                    </Tab>
                </Tabs>
                <div className='mt-4'>
                    <Button className='btn-primary' onClick={() => {
                        this.props.queryHandler()
                    }}>
                        Submit
                    </Button>
                    <Button className='btn-primary ml-4' onClick={() => this.props.resetHandler()}>
                        Reset
                    </Button>
                </div>
            </div>

        );
    }
}

function mapStateToProps(state) {
    return {
        Form: state.Form,
    };
}

export default connect(mapStateToProps, null, null, {forwardRef: true})(ModelForm);

