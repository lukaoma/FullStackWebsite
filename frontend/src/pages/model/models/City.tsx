import React from 'react';
import ListElements from "../shared/ListElements";
import {numberOfCardsNeeded, numberOfCardsPerPage} from "../shared/Constants";
import config from "../../../config";
import axios from "axios";
import {fixMappingCity} from "../shared/Fixes";
import {City} from '../shared/ModelInterface'
import {connect} from 'react-redux';
import {addModel} from '../../../actions';
import uuidv4 from 'uuid/v4'

interface ListCityProps {
    city: City;
    key: number;
    highlight: string;
    selectHandler: any;
}

class CityComponent extends React.Component<{ [name: string]: any }, {}> {

    isLocked = false;
    addModel = (modelName, pageNum, obj) => {
        this.props.dispatch(addModel(modelName, pageNum, obj));
    };

    ListCity({city, selectHandler, highlight}: ListCityProps) {
        return (<ListElements key={uuidv4()} element={city} modelName={"Cities"} highlight={highlight} selectHandler={selectHandler}/>);
    }

    addCity(pageNum: number, query = null) {
        let thisAgain = this;
        let path = config.PATH + "api/city";
        let parameters = (query === null || query === "")
            ? {page: pageNum, results_per_page: numberOfCardsPerPage}
            : {q: JSON.stringify(query), page: pageNum, results_per_page: numberOfCardsPerPage};

        console.log(parameters);
        axios.get(path, {params: parameters})
            .then(function (r) {
                if (r == null) return;
                let cities = r.data["objects"] as [];
                let fixedCities: City[] = [];

                let index = 0;
                for (let city of cities) {
                    const singleCity: City = fixMappingCity(city);
                    singleCity.pageNum = pageNum;
                    singleCity.index = index;
                    fixedCities.push(singleCity);
                    index++;
                }

                // fix the creation of card being less than desirable issue
                let diff = numberOfCardsNeeded - cities.length;
                for (let i = 0; i < diff; i++) {
                    fixedCities.push({ghost: true});
                }

                document.getElementById("loadingWait").style.display = "none";

                thisAgain.addModel("Cities", pageNum, fixedCities);
                thisAgain.isLocked = false;
                thisAgain.forceUpdate();
            })
            .catch(function (error) {
                console.log(error);
                thisAgain.isLocked = false;
                thisAgain.forceUpdate();
            });
    }

    render() {
        if (this.isLocked) return (<div key={uuidv4()}/>);

        if (!(this.props.pageNum in this.props.Cities)) {
            this.isLocked = true;
            this.addCity(this.props.pageNum, this.props.query);
            return (<div key={uuidv4()}/>)
        }

        return (
            this.props.Cities[this.props.pageNum].map((c, idx) =>
                [<this.ListCity selectHandler={this.props.handler} highlight={this.props.highlight} city={c} key={uuidv4()}/>, <br key={uuidv4()}/>]
            )
        );
    }
}

function mapStateToProps(state) {
    return {
        Cities: state.Cities
    };
}

export default connect(mapStateToProps)(CityComponent);
