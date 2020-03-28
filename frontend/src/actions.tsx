import * as ActionTypes from './actionTypes';

export function addModel(modelName, pageNum, obj) {
    switch (modelName) {
        case "Cities":
            return {type: ActionTypes.ADDMODELCITY, val1: pageNum, val2: obj};
        case "Commutes":
            return {type: ActionTypes.ADDMODELCOMMUTE, val1: pageNum, val2: obj};
        case "Homes":
            return {type: ActionTypes.ADDMODELHOME, val1: pageNum, val2: obj};
        default:
            throw new Error("entered bad case: " + modelName);
    }
}

export const clearModels = () => ({type: ActionTypes.CLEARMODELS});

export const updateFormCity = (val1) => ({type: ActionTypes.UPDATEFORMCITY, val1: val1});
export const updateFormCommute = (val1) => ({type: ActionTypes.UPDATEFORMCOMMUTE, val1: val1});
export const updateFormHome = (val1) => ({type: ActionTypes.UPDATEFORMHOME, val1: val1});

export function updateSelect(modelName, element) {
    switch (modelName) {
        case "Cities":
            return {type: ActionTypes.UPDATESELECTCITY, val1: element};
        case "Commutes":
            return {type: ActionTypes.UPDATESELECTCOMMUTE, val1: element};
        case "Homes":
            return {type: ActionTypes.UPDATESELECTHOME, val1: element};
        default:
            throw new Error("entered bad case: " + modelName);
    }
}

export const deepLoadState = () => ({type: ActionTypes.LOADSTATE});
export const deepSaveState = () => ({type: ActionTypes.SAVESTATE});

export const updateSearchBarVal = (val1) => ({type: ActionTypes.UPDATESEARCHBARVAL, val1: val1});
