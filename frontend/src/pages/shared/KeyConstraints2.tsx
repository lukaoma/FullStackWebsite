export function cities(key: string) {
    switch (key) {
        case 'commute':
        case 'geo':
        case 'housing':
        case 'id':
        case 'images':
        case 'median_age':
        case 'median_property_value':
        case 'median_wage':
        case 'name':
        case 'num_employees':
        case 'population':
        case 'poverty_rate':
        case 'map':
        case 'image':
        case 'pageNum':
        case 'index':
            return false;
    }
    return true;
}

export function commutes(key: string) {
    return true;
}

export function homes(key: string) {
    switch (key) {
        case 'address':
        case 'address_modified':
        case 'area':
        case 'rent':
        case 'city':
        case 'id':
        case 'img':
        case 'routes':
        case 'image':
        case 'city_modified':
        case 'pageNum':
        case 'index':
            return false;
    }
    return true;
}