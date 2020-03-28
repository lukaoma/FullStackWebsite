const startCommute: string = "2021+Guadalupe+Austin+TX";
const endCommute: string = "Gates+Dell+Complex";

function getValue(id: string) {
    return (document.getElementById(id) as (HTMLInputElement | any)).value;
}

function checkAndAdd(dict, val, name: string, op: string, convertToNum = false) {
    if (val === "" || val === null || val === undefined) return;
    if (convertToNum) val = parseFloat(val);
    dict.filters.push({name: name, op: op, val: val})
}

function createCitiesQuery(cityName: string, isInit: boolean) {

    let cityInfo = {filters: []};

    if (cityName != null) {
        checkAndAdd(cityInfo, "%"+cityName+"%", "name", "ilike");
        return cityInfo;
    }

    if (isInit) return cityInfo;

    checkAndAdd(cityInfo, "%"+getValue("citiesName")+"%", "name", "ilike");
    checkAndAdd(cityInfo, "%"+getValue("citiesState")+"%", "state", "ilike");
    
    checkAndAdd(cityInfo, getValue("citiesAgeMin"), "median_age", ">=", true);
    checkAndAdd(cityInfo, getValue("citiesAgeMax"), "median_age", "<=", true);
    checkAndAdd(cityInfo, getValue("citiesPopulationMin"), "population", ">=", true);
    checkAndAdd(cityInfo, getValue("citiesPopulationMax"), "population", "<=", true);
    checkAndAdd(cityInfo, getValue("citiesWagesMin"), "median_wage", ">=", true);
    checkAndAdd(cityInfo, getValue("citiesWagesMax"), "median_wage", "<=", true);

    console.log(cityInfo);
    return cityInfo;
}

function createCommutesQuery(cityName: string, isInit: boolean){
    
    let commuteInfo = { filters:[] };
    let one;
    let two;

    if(cityName != null){
        one = cityName.split(' ').join('+');
        two = endCommute.split(' ').join('+');
        checkAndAdd(commuteInfo, one, "work", "eq");
        checkAndAdd(commuteInfo, two, "home", "eq");
        return commuteInfo;
    }

    if (isInit) return commuteInfo;

    one = getValue("commutesWork").split(' ').join('+');
    two = getValue("commutesHome").split(' ').join('+');

    if (one == null || two == null || !one.length || !two.length) {
        one = startCommute;
        two = endCommute;
    }

    checkAndAdd(commuteInfo, one, "work", "eq");
    checkAndAdd(commuteInfo, two, "home", "eq");

    // checkAndAdd(commuteInfo, getValue("commutesMode"), "mode", "eq");
    // checkAndAdd(commuteInfo, getValue("commutesTimeMin"), "timespan", ">=", true);
    // checkAndAdd(commuteInfo, getValue("commutesTimeMax"), "timespan", "<=", true);
    // checkAndAdd(commuteInfo, getValue("commutesDistanceMin"), "distance", ">=", true);
    // checkAndAdd(commuteInfo, getValue("commutesDistanceMax"), "distance", "<=", true);

    console.log(commuteInfo);
    return commuteInfo;
}

function createHomesQuery(cityName: string, isInit: boolean) {
    let homeInfo = {filters: []};
    let homeCity = {filters: []};

    if (cityName != null) {
        //homeInfo["cityName"] = cityName;
        checkAndAdd(homeCity, "%"+cityName+"%", "name", "ilike");
        homeInfo["homeCity"] = homeCity;
        return homeInfo;
    }

    if (isInit) return homeInfo;

    cityName = getValue("homesCity");
    let stateName = getValue("homesState");

    checkAndAdd(homeInfo, getValue("homesPriceMin"), "rent", ">=", true);
    checkAndAdd(homeInfo, getValue("homesPriceMax"), "rent", "<=", true);
    checkAndAdd(homeInfo, getValue("homesAreaMin"), "area", ">=", true);
    checkAndAdd(homeInfo, getValue("homesAreaMax"), "area", "<=", true);
    checkAndAdd(homeInfo, getValue("homesBedsMin"), "beds", ">=", true);
    checkAndAdd(homeInfo, getValue("homesBedsMax"), "beds", "<=", true);
    checkAndAdd(homeInfo, getValue("homesBathsMin"), "baths", ">=", true);
    checkAndAdd(homeInfo, getValue("homesBathsMax"), "baths", "<=", true);

    if (cityName !== "") {
        //homeInfo["cityName"] = cityName
        checkAndAdd(homeCity, "%"+cityName+"%", "name", "ilike");
    }

    if(stateName !== ""){
        checkAndAdd(homeCity, "%"+stateName+"%", "state", "ilike");
    }

    homeInfo["homeCity"] = homeCity;
    console.log(homeInfo);
    return homeInfo;
}

export function createFormQuery(cityName: string = null, isInit: boolean = false) {
    let citiesQuery = createCitiesQuery(cityName, isInit);
    let commutesQuery = createCommutesQuery(cityName, isInit);
    let homesQuery = createHomesQuery(cityName, isInit);

    return {
        citiesQuery: citiesQuery,
        commutesQuery: commutesQuery,
        homesQuery: homesQuery,
    };
}