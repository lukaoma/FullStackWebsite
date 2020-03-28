export function cities(key: string) {
    switch (key) {
        case 'commute':
        case 'desc':
        case 'geo':
        case 'housing':
        case 'id':
        case 'images':
        case 'latitude':
        case 'longitude':
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
    switch (key) {
        case 'city_id':
        case 'distance':
        case 'img':
        case 'name':
        case 'timespan':
        case 'walk_dist':
        case 'walk_time':
        case 'image':
            return false;
    }
    return true;
}

export function homes(key: string) {
    switch (key) {
        case 'address':
        case 'area':
        case 'city':
        case 'desc':
        case 'id':
        case 'img':
        case 'latitude':
        case 'longitude':
        case 'routes':
        case 'image':
        case 'city_modified':
        case 'rent':
        case 'pageNum':
        case 'index':
            return false;
    }
    return true;
}