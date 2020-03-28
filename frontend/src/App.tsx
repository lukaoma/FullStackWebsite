import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route} from "react-router-dom";


import Launch from "./pages/launch/Launch";
import Model from "./pages/model/Entry";
import About from "./pages/about/About"
import Instance from "./pages/instance/Instance";
import mapVisual from "./pages/visualation/VisualPage";
import OtherVisual from "./pages/visualation/otherTeamVisuals/OtherVisual";

const App: React.FC = () => {
    return (
        <Router>
            <Route path='/' exact component={Launch}/>
            <Route path='/Model' component={Model}/>
            <Route path='/Instance' component={Instance}/>
            <Route path='/About' component={About}/>
            <Route path='/Visuals' component={mapVisual}/>
            <Route path='/OtherVisuals' component={OtherVisual}/>
        </Router>
    );
};

export default App;
