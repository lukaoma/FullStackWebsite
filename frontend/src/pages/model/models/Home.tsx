import React from 'react';
import ListElements from "../shared/ListElements";
import {numberOfCardsNeeded, numberOfCardsPerPage} from "../shared/Constants";
import config from "../../../config";
import axios from "axios";
import {fixMappingCity, fixMappingHome} from "../shared/Fixes";
import {City, Home} from '../shared/ModelInterface';
import {connect} from 'react-redux';
import {addModel} from '../../../actions'
import uuidv4 from 'uuid/v4'


const defaultHouse = "https://photos.zillowstatic.com/p_e/ISm6nwkf575ju61000000000.jpg";

interface ListHomeProps {
    key: number
    home: Home
    highlight: string
    selectHandler: any
}

class HomeComponent extends React.Component<{ [name: string]: any }, {}> {

    isLocked = false;
    addModel = (modelName, pageNum, obj) => {
        this.props.dispatch(addModel(modelName, pageNum, obj));
    };


    ListHome({home, selectHandler, highlight}: ListHomeProps) {
        return (<ListElements key={uuidv4()} element={home} modelName={"Homes"} highlight={highlight} selectHandler={selectHandler}/>);
    }

    // TODO: there's an API bug; the second filter isn't applying
    addHome(pageNum: number, query = null, cityId = null) {

        let thisAgain = this;

        let path = (cityId === null)
            ? config.PATH + "api/housing"
            : config.PATH + "api/city/" + cityId + "/housing";

        let parameters = (query === null || query === "")
            ? {page: pageNum, results_per_page: numberOfCardsPerPage}
            : {q: JSON.stringify(query), page: pageNum, results_per_page: numberOfCardsPerPage};

        //console.log(parameters);
        axios.get(path, {params: parameters})
            .then(r => {
                let housesList = r.data["objects"] as [];
                if (r === null) {
                    return
                }
                let fixedHomes = [];
                let index = 0;
                for (let house of housesList) {
                    const singleHome: Home = fixMappingHome(house);
                    if (singleHome.img === null || singleHome.img.length < 1) {
                        singleHome.img = defaultHouse;  // Change the default house image
                    }
                    singleHome.pageNum = pageNum;
                    singleHome.index = index;
                    fixedHomes.push(singleHome);
                    index++;
                }

                let diff = numberOfCardsNeeded - housesList.length;
                for (let i = 0; i < diff; i++) {
                    fixedHomes.push({ghost: true});
                }

                document.getElementById("loadingWait").style.display = "none";
                thisAgain.addModel("Homes", pageNum, fixedHomes);
                thisAgain.isLocked = false;
                thisAgain.forceUpdate();
            })
            .catch(function (error) {
                console.log(error);
                thisAgain.isLocked = false;
                thisAgain.forceUpdate();
            });
    }

    addHomeWithCity(homeCity, pageNum: number, query2 = null) {
        //if (cityName === "" || cityName === undefined || cityName === null) return null;
        let path = config.PATH + "api/city";
        let query1 = homeCity;
        let parameters = {q: query1};

        let cityId: number = null;
        let thisAgain = this;

        axios.get(path, {params: parameters})
            .then(function (r) {
                if (r == null) return;
                let cities = r.data["objects"] as [];

                // should only happen once
                for (let city of cities) {
                    const singleCity: City = fixMappingCity(city);
                    cityId = singleCity.id;
                    break;
                }
                thisAgain.addHome(pageNum, query2, cityId);
            })
            .catch(function (error) {
                console.log(error);
                thisAgain.isLocked = false;
                thisAgain.forceUpdate();
            });

        return cityId;
    }

    render() {
        if (this.isLocked) return (<div key={uuidv4()}/>);

        if (!(this.props.pageNum in this.props.Homes)) {
            this.isLocked = true;

            if (this.props.query != null && this.props.query.hasOwnProperty("homeCity")) {
                // not sure if there's a dict.pop
                let val = this.props.query["homeCity"];
                delete this.props.query["homeCity"];
                this.addHomeWithCity(val, this.props.pageNum, this.props.query);
            } else {
                this.addHome(this.props.pageNum, this.props.query);
            }
            return (<div key={uuidv4()}/>)
        }

        return (this.props.Homes[this.props.pageNum].map((c, idx) =>
            [<this.ListHome selectHandler={this.props.handler} highlight={this.props.highlight} home={c} key={uuidv4()}/>, <br key={uuidv4()}/>]));
    }
}

function mapStateToProps(state) {
    return {
        Homes: state.Homes
    };
}

export default connect(mapStateToProps)(HomeComponent);
