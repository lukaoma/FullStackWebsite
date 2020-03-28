import React from 'react';
import {Button, FormControl, InputGroup, Navbar} from "react-bootstrap";
import {NavLink} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {deepLoadState, deepSaveState, updateSearchBarVal} from '../../actions';
import {connect} from 'react-redux';
import {
    faBus,
    faChartLine,
    faChartPie,
    faHome,
    faMapMarkerAlt,
    faSearch,
    faUser
} from '@fortawesome/free-solid-svg-icons'

class NavigationHeader extends React.Component<{ [name: string]: any }, {}> {

    state = {
        query: "",
    };

    renderCount = 0;

    updateSearchBarVal = (val1) => {
        this.props.dispatch(updateSearchBarVal(val1));
    };
    deepSaveState = () => {
        this.props.dispatch(deepSaveState());
    };
    deepLoadState = () => {
        this.props.dispatch(deepLoadState());
    };

    componentDidMount() {
        this.deepLoadState();
    }

    helperFunction(val) {
        this.updateSearchBarVal(val);
        this.deepSaveState();

        if (this.props.onClickHandler != null) {
            this.props.onClickHandler(val);
        } else {
            window.open(
                '/Model?type=Cities&search=' + val,
                '_self'
            );
        }
    }

    _handleKeyDown = (e: { key: string; }) => {
        if (e.key === 'Enter') {
            this.helperFunction(this.state.query);
        }
    };

    updateState(val: string) {
        this.setState({
            query: val
        });
    }


    render() {
        this.renderCount++;

        let val = (this.renderCount === 1 || this.renderCount === 2)
        ? this.props.SearchBarVal
        : this.state.query;
        
        return (
            <Navbar className='navBar navbar-fixed-top' expand='lg' variant='light' sticky='top' id='Navi'>
                <div>
                    <NavLink className='name' to="/">
                        Costly Commute
                    </NavLink>
                    <span className='tab'></span> <span className='bar'> | </span><span className='tab'></span>
                </div>
                <div style={{backgroundColor: 'lightyellow'}}><Navbar.Toggle className='white'
                                                                             aria-controls='nav'></Navbar.Toggle></div>

                <Navbar.Collapse className='navLinks'>
                    <NavLink className='navElement left' to="/Model?type=Cities">
                        <FontAwesomeIcon icon={faMapMarkerAlt}/>
                        <span> City</span>
                    </NavLink>
                    <NavLink className='navElement' to="/Model?type=Commutes">
                        <FontAwesomeIcon icon={faBus}/>
                        <span> Commute</span>
                    </NavLink>
                    <NavLink className='navElement' to="/Model?type=Homes">
                        <FontAwesomeIcon icon={faHome}/>
                        <span> Home </span>
                    </NavLink>
                    <NavLink className='navElement' to="/About">
                        <FontAwesomeIcon icon={faUser}/>
                        <span> About </span>
                    </NavLink>
                    <NavLink className='navElement' to="/Visuals">
                        <FontAwesomeIcon icon={faChartLine}/>
                        <span> Visuals</span>
                    </NavLink>
                    <NavLink className='navElement right' to="/OtherVisuals">
                        <FontAwesomeIcon icon={faChartPie}/>
                        <span> Other Visuals</span>
                    </NavLink>
                </Navbar.Collapse>

                <InputGroup className="mb-2 navBarSearch">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1"> <FontAwesomeIcon icon={faSearch}/></InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl autoComplete="off" placeholder="quick search by city name" type='text' id='searchInput'
                                 onKeyDown={this._handleKeyDown} value={val}
                                 onChange={(event: any) => this.updateState(event.target.value)}/>
                    <InputGroup.Append>
                        <Button onClick={() => this.helperFunction(val)}> search </Button>
                    </InputGroup.Append>
                </InputGroup>
            </Navbar>
        );
    }
}

function mapStateToProps(state) {
    return {
        SearchBarVal: state["SearchBarVal"],
    };
}

export default connect(mapStateToProps)(NavigationHeader);
