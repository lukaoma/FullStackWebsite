import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Link} from "react-router-dom";
import renderer from 'react-test-renderer';
import Spline from "./pages/visualation/Spline";
import MapVisual from "./pages/visualation/VisualPage";
import MarkerList from "./pages/visualation/MarkerList";
import MapChart from "./pages/visualation/MapChart";
import {CityTab} from "./pages/model/shared/form/supplement/tabs/City";
import CityComponent from "./pages/model/models/City";
import {HomeTab} from "./pages/model/shared/form/supplement/tabs/Home";
import LaunchPage from "./pages/launch/Launch";
import AboutPage from "./pages/about/About";
import InstancePage from "./pages/instance/Instance";
import CommuteComponent from "./pages/model/models/Commute";


// Unit test for Frontend
it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App/>, div);
    ReactDOM.unmountComponentAtNode(div);
});
let link = "https://www.costlycommute.me";
test('Link changes the class when hovered', () => {
    const component = renderer.create(
        <Link to={link}>Costly Commute</Link>,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    // manually trigger the callback
    tree.props.onMouseEnter();
    // re-rendering
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    // manually trigger the callback
    tree.props.onMouseLeave();
    // re-rendering
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});


it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Spline/>, div);
    ReactDOM.unmountComponentAtNode(div);
});
it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<MapVisual/>, div);
    ReactDOM.unmountComponentAtNode(div);
});
it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<MarkerList/>, div);
    ReactDOM.unmountComponentAtNode(div);
});
it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<MapChart/>, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<CityTab/>, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<CommuteComponent/>, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<CityComponent/>, div);
    ReactDOM.unmountComponentAtNode(div);
});
it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<HomeTab/>, div);
    ReactDOM.unmountComponentAtNode(div);
});
it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<LaunchPage/>, div);
    ReactDOM.unmountComponentAtNode(div);
});
it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<AboutPage/>, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<InstancePage/>, div);
    ReactDOM.unmountComponentAtNode(div);
});

