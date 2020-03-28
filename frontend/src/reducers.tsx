import * as ActionTypes from './actionTypes';

// Lloyd: I don't know how to nest dictionaries in the redux way
const initialState = {
    // Model dictionaries
    Homes: {},
    Cities: {},
    Commutes: {},

    // Select dictionaries
    LastCity: {},
    LastCommute: {},
    LastHome: {},

    // for maintaining the search across pages
    SearchBarVal: "",
};

const loadState = () => {
    try {
        const serializedState = localStorage.getItem('state');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
    } catch {
        // ignore write errors
    }
};

// actions require a type attribute
interface actionDict {
    type: string,
    val1?: any,
    val2?: any,
}

export function reducer(state = initialState, action: actionDict) {

    console.log('reducer', state, action);

    switch (action.type) {
        case ActionTypes.SAVESTATE:
            saveState(state);
            return {...state};
        case ActionTypes.LOADSTATE:
            return {...loadState()};
        case ActionTypes.ADDMODELCITY:
            return {
                ...state,
                Cities: {
                    ...state.Cities, [action.val1]: action.val2
                }
            };
        case ActionTypes.ADDMODELCOMMUTE:
            return {
                ...state,
                Commutes: {
                    ...state.Commutes, [action.val1]: action.val2
                }
            };
        case ActionTypes.ADDMODELHOME:
            return {
                ...state,
                Homes: {
                    ...state.Homes, [action.val1]: action.val2
                }
            };
        case ActionTypes.CLEARMODELS:
            return {
                ...state,
                Cities: {},
                Commutes: {},
                Homes: {},
            };
        case ActionTypes.UPDATESELECTCITY:
            return {
                ...state,
                LastCity: action.val1,
            };
        case ActionTypes.UPDATESELECTCOMMUTE:
            return {
                ...state,
                LastCommute: action.val1,
            };
        case ActionTypes.UPDATESELECTHOME:
            return {
                ...state,
                LastHome: action.val1,
            };
        case ActionTypes.UPDATESEARCHBARVAL:
            return {
                ...state,
                SearchBarVal: action.val1,
            };
        default:
            return {
                ...state
            };
    }
}
