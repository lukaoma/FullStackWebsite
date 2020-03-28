import React from 'react';
import {Card} from "react-bootstrap";
import {MenuRangeAttributes} from '../inputs/Common';
import {linkedInput} from '../inputs/Linked';
import {LinkedInputInfo, RangeInputInfo} from '../../FormInterface';

// export class HomeTab extends React.Component<{[name: string]: any}, {}> {

//     homesCityRef: React.RefObject<FormControlPlus> = React.createRef();
//     homesAddrRef: React.RefObject<FormControlPlus> = React.createRef();

//     homesRentRef1: React.RefObject<FormControlPlus> = React.createRef();
//     homesRentRef2: React.RefObject<FormControlPlus> = React.createRef();
//     homesAreaRef1: React.RefObject<FormControlPlus> = React.createRef();
//     homesAreaRef2: React.RefObject<FormControlPlus> = React.createRef();
//     homesBedsRef1: React.RefObject<FormControlPlus> = React.createRef();
//     homesBedsRef2: React.RefObject<FormControlPlus> = React.createRef();
//     homesBathsRef1: React.RefObject<FormControlPlus> = React.createRef();
//     homesBathsRef2: React.RefObject<FormControlPlus> = React.createRef();


//     homesAttributes: Array<RangeInputInfo> = [
//         {
//             id1: "homesPriceMin",
//             id2: "homesPriceMax",
//             ref1: this.homesRentRef1,
//             ref2: this.homesRentRef2,
//             tagName: "homesAttributes",
//             name: "Rent",
//             value: this.props.dict["Homes"].rent,
//             otherTagToClear: "homeAddr",
//         },
//         {
//             id1: "homesAreaMin",
//             id2: "homesAreaMax",
//             ref1: this.homesAreaRef1,
//             ref2: this.homesAreaRef2,
//             tagName: "homesAttributes",
//             name: "Area",
//             value: this.props.dict["Homes"].area,
//             otherTagToClear: "homesAddr",
//         },
//         {
//             id1: "homesBedsMin",
//             id2: "homesBedsMax",
//             ref1: this.homesBedsRef1,
//             ref2: this.homesBedsRef2,
//             tagName: "homesAttributes",
//             name: "Beds",
//             value: this.props.dict["Homes"].beds,
//             otherTagToClear: "homeAddr",
//         },
//         {
//             id1: "homesBathsMin",
//             id2: "homesBathsMax",
//             ref1: this.homesBathsRef1,
//             ref2: this.homesBathsRef2,
//             tagName: "homesAttributes",
//             name: "Baths",
//             value: this.props.dict["Homes"].baths,
//             otherTagToClear: "homeAddr",
//         },
//     ];

//     citiesName: LinkedInputInfo = {
//         id1: "homesCity",
//         ref1: this.homesCityRef,
//         tagName: "citiesName",
//         name: "City",
//         value: "",
//         otherTagToClear: "citiesAttributes"
//     }

//     homeAddr: LinkedInputInfo = {
//         id1: "homesAddr",
//         ref1: this.homesAddrRef,
//         tagName: "homeAddr",
//         name: "Home Addr.",
//         value: this.props.dict["Homes"].address_modified,
//         otherTagToClear: "homesAttributes",
//         disabled: true,
//     }

//     render() {
//         let city = this.props.dict["Homes"].city;
//         if (city !== undefined) {   // it's undefined during the initialization
//             this.citiesName.value = city.name;
//             this.homesCityRef.current.updateState(city.name)
//         }

//         let val = this.props.dict["Homes"].address_modified;
//         if (val !== undefined) {
//             this.homesAddrRef.current.updateState(val);
//         }

//         val = this.props.dict["Homes"].rent;
//         if (val !== undefined) {
//             this.homesRentRef1.current.updateState(val);
//             this.homesRentRef2.current.updateState(val);
//         }

//         val = this.props.dict["Homes"].area;
//         if (val !== undefined) {
//             this.homesAreaRef1.current.updateState(val);
//             this.homesAreaRef2.current.updateState(val);
//         }

//         val = this.props.dict["Homes"].beds;
//         if (val !== undefined) {
//             this.homesBedsRef1.current.updateState(val);
//             this.homesBedsRef2.current.updateState(val);
//         }

//         val = this.props.dict["Homes"].baths;
//         if (val !== undefined) {
//             this.homesBathsRef1.current.updateState(val);
//             this.homesBathsRef2.current.updateState(val);
//         }

//         return (
//             <div>
//                 <Card>
//                     <Card.Body>
//                         <div className='dropDownMenu'>
//                             {linkedInput(this.citiesName)}
//                             {linkedInput(this.homeAddr)}
//                             <MenuRangeAttributes name={"Homes Attributes"} attributes={this.homesAttributes}/>
//                         </div>
//                     </Card.Body>
//                 </Card>
//             </div>
//         );
//     }
// }

export function HomeTab({...props}) {

    let homesAttributes: Array<RangeInputInfo> = [
        {
            id1: "homesPriceMin",
            id2: "homesPriceMax",
            tagName: "homesAttributes",
            name: "Rent",
            value: props.dict["Homes"].rent,
            otherTagToClear: "homeAddr",
        },
        {
            id1: "homesAreaMin",
            id2: "homesAreaMax",
            tagName: "homesAttributes",
            name: "Area",
            value: props.dict["Homes"].area,
            otherTagToClear: "homesAddr",
        },
        {
            id1: "homesBedsMin",
            id2: "homesBedsMax",
            tagName: "homesAttributes",
            name: "Beds",
            value: props.dict["Homes"].beds,
            otherTagToClear: "homeAddr",
        },
        {
            id1: "homesBathsMin",
            id2: "homesBathsMax",
            tagName: "homesAttributes",
            name: "Baths",
            value: props.dict["Homes"].baths,
            otherTagToClear: "homeAddr",
        },
    ];

    let citiesName: LinkedInputInfo = {
        id1: "homesCity",
        tagName: "citiesName",
        name: "City",
        value: props.dict["Cities"].name,
        otherTagToClear: "citiesAttributes"
    };

    let stateName: LinkedInputInfo = {
        id1: "homesState",
        tagName: "stateName",
        name: "State",
        value: props.dict["Cities"].state,
        otherTagToClear: null
    }

    let homeAddr: LinkedInputInfo = {
        id1: "homesAddr",
        tagName: "homeAddr",
        name: "Home Addr.",
        value: props.dict["Homes"].address_modified,
        otherTagToClear: "homesAttributes",
        disabled: true,
    };

    return (
        <div>
            <Card>
                <Card.Body>
                    <div className='dropDownMenu'>
                        {linkedInput(citiesName)}
                        {linkedInput(stateName)}
                        {linkedInput(homeAddr)}
                        <MenuRangeAttributes name={"Homes Attributes"} attributes={homesAttributes}/>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}
