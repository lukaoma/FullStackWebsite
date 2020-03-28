import React from 'react';
import ListElements from "../shared/ListElements";
import {numberOfCardsNeeded, numberOfCardsPerPage} from "../shared/Constants";
// import config from "../../../config";
import {fixMappingCommute} from "../shared/Fixes";
import {Commute} from '../shared/ModelInterface';
import axios from "axios";
import {connect} from 'react-redux';
import {addModel} from '../../../actions';
import uuidv4 from 'uuid/v4';

interface ListCommuteProps {
    commute: Commute
    key: Number
    selectHandler: any
}

class CommuteComponent extends React.Component<{ [name: string]: any }, {}> {

    isLocked = false;
    addModel = (modelName, pageNum, obj) => {
        this.props.dispatch(addModel(modelName, pageNum, obj));
    };

    ListCommute({commute, selectHandler}: ListCommuteProps) {
        return (<ListElements element={commute} modelName={"Commutes"} selectHandler={selectHandler}/>);
    }

    addCommute(pageNum: number, query: string) {
        // query should never be null, because it defaults to a certain value

        let thisAgain = this;
        //alert(query);

        let parameters = {
            q: JSON.stringify(query),
            page: pageNum,
            results_per_page: numberOfCardsPerPage,
        };

        console.log("PARAMETERS:");
        console.log(parameters);

        // using config.PATH i get "google can't hack it error"
        // let path = config.PATH + "api/commute";

        let path = "https://api.costlycommute.me/api/commute";

        axios.get(path, {params: parameters}).then(r => {
            if (r === null || r.data === null || r.data["objects"] === null) return;

            let commutes = r.data["objects"] as [];

            // handles backend error; getting repeats (also syntax for HashSet wasn't working)
            let transit = null;
            let walking = null;
            let driving = null;

            let fixedCommutes: Commute[] = [];
            for (let commute of commutes) {
                const singleCommute: Commute = fixMappingCommute(commute);
                console.log(singleCommute);
                switch (singleCommute.mode) {
                    case 'transit':
                        transit = singleCommute;
                        break;
                    case 'driving':
                        driving = singleCommute;
                        break;
                    case 'walking':
                        walking = singleCommute;
                        break;
                    default:
                        alert(singleCommute.mode);
                }
            }

            if (transit != null) fixedCommutes.push(transit);
            if (walking != null) fixedCommutes.push(walking);
            if (driving != null) fixedCommutes.push(driving);


            let diff = numberOfCardsNeeded - fixedCommutes.length;
            for (let i = 0; i < diff; i++) {
                fixedCommutes.push({ghost: true});
            }

            document.getElementById("loadingWait3").style.display = "none";
            thisAgain.addModel("Commutes", pageNum, fixedCommutes);
            thisAgain.isLocked = false;
            thisAgain.forceUpdate();
        })
            .catch(function (error) {
                console.log(error);
                //alert("bad request; try again")
                thisAgain.isLocked = false;
                thisAgain.forceUpdate();
            });
    }

    render() {
        if (this.isLocked) return (<div key={uuidv4()}/>);

        if (!(this.props.pageNum in this.props.Commutes)) {
            if (this.props.query === null || this.props.query === "") return (<div key={uuidv4()}/>);
            this.isLocked = true;
            this.addCommute(this.props.pageNum, this.props.query);
            return (<div key={uuidv4()}/>)
        }

        return (
            this.props.Commutes[this.props.pageNum].map((c, idx) =>
                [<this.ListCommute selectHandler={this.props.handler} commute={c} key={uuidv4()}/>, <br key={uuidv4()}/>]
            )
        );
    }


}

function mapStateToProps(state) {
    return {
        Commutes: state.Commutes
    };
}

export default connect(mapStateToProps)(CommuteComponent);
