import {City, Commute, Home} from "./ModelInterface";
import {CityApiCall, CityApiImages, CommuteApiCall, HomeApiCall} from "./ApiInterface";

// TODO: find default image

export function fixCurrency(myNumber) {
    const currentNum: number = parseInt(myNumber, 10);
    let readNum: string = currentNum.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
    readNum = readNum.substring(0, readNum.length - 3);
    return readNum;
}

export function fixNumber(myNumber) {
    const currentNum: number = parseInt(myNumber, 10);
    let readNum: string = currentNum.toLocaleString('en');
    return readNum;
}

export function preventNullValues(object) {
    for (let field in object) {
        if (object[field] === null || object[field] === undefined) {
            if (typeof object[field] == "string") {
                object[field] = "";
            } else {
                object[field] = 0;
            }
        }
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

// for base64 images
export function fixImage(img: string) {
    if (img == null) return img;
    img = img.replace("b'", "");
    img = img.replace("'", "");
    return "data:image/png;base64," + img;
}

//fix city images
function fixCityImages(images: CityApiImages[]) {
    if (images === undefined) return;
    // not all city data have images; need this error check;
    // i.e. city form doesn't update its image when home form is populated
    const whichImg = getRandomInt(images.length);
    return "https://" + images[whichImg].url;
}


export function fixMappingCity(data: CityApiCall) {
    preventNullValues(data);
    const better: City = {
        // copy information unmodified
        commute: data.commute,
        desc: data.desc,
        geo: data.geo,
        housing: data.housing,
        id: data.id,
        images: data.images,
        latitude: data.latitude,
        longitude: data.longitude,
        median_age: data.median_age,
        median_property_value: data.median_property_value,
        median_wage: data.median_wage,
        name: data.name,
        num_employees: data.num_employees,
        population: data.population,
        poverty_rate: data.poverty_rate,
        state: data.state,
        map: data.map,

        // set modified information for displaying
        population_modified: fixNumber(data.population),
        median_wage_modified: fixCurrency(data.median_wage),
        poverty_rate_modified: (data.poverty_rate * 100).toFixed(1) + "%",
        num_employees_modified: fixNumber(data.num_employees),
        median_age_modified: Math.round(data.median_age),
        image: fixCityImages(data.images),

    };
    return better;
}

export function fixMappingCommute(data: CommuteApiCall) {
    preventNullValues(data);
    const better: Commute = {
        city_id: data.city_id,
        distance: data.distance,
        fare: data.fare,
        img: data.img,
        mode: data.mode,
        name: data.name,
        timespan: data.timespan,
        walk_dist: data.walk_dist,
        walk_time: data.walk_time,

        distance_modified: meterToMiles(data.distance).toFixed(2) + " Miles",
        timespan_modified: Math.floor(parseInt(data.timespan, 10) / 60) + " Mins",
        walk_dist_modified: meterToMiles(data.walk_dist).toFixed(2) + " Miles",
        walk_time_modified: Math.floor(data.walk_time / 60) + " Mins",
        image: fixImage(data.img),
    };
    return better;
}

export function fixMappingHome(data: HomeApiCall) {
    preventNullValues(data);
    const better: Home = {
        // set modified information for displaying
        address_modified: fixAddress(data),
        rent_modified: fixCurrency(data.rent),
        area_modified: data.area + " Sq Ft",
        city_modified: fixMappingCity(data.city),
        image: (data.img !== null && data.img !== "") ? data.img : "",

        // copy information unmodified
        address: data.address,
        area: data.area,
        baths: data.baths,
        beds: data.beds,
        city: data.city,
        desc: data.desc,
        id: data.id,
        img: data.img,
        latitude: data.latitude,
        longitude: data.longitude,
        routes: data.routes,
        rent: data.rent,
        zipCode: data.zipCode,
    };

    return better;
}

function meterToMiles(i) {
    return i * 0.000621371192;
}

function fixAddress(data: HomeApiCall) {
    return data.address + ", " + data.city.name + ", " + data.city.state;
}
