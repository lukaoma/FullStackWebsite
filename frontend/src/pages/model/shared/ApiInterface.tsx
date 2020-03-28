export interface CityApiCall {
    commute?: []
    desc?: string,
    geo?: string,
    housing?: HomeApiCall[],
    id?: number,
    images?: CityApiImages[]
    latitude?: number,
    longitude?: number,
    median_age?: number,
    median_property_value?: number,
    median_wage?: number,
    name?: string,
    num_employees?: number,
    population?: number,
    poverty_rate?: number,
    state?: string
    map?: string
}

export interface CommuteApiCall {
    city_id?: CityApiCall,
    distance?: number,
    fare?: string,
    img?: string,
    mode?: string
    name?: string,
    timespan?: string,
    walk_dist?: number,
    walk_time?: number,
}

export interface HomeApiCall {
    address?: string,
    area?: number,
    baths?: number,
    beds?: number,
    city?: CityApiCall,
    desc?: string,
    id?: number,
    img?: string,
    latitude?: number,
    longitude?: number,
    routes?: [],
    rent?: number,
    zipCode?: number,
}

// made for the array of images inside of city api
export interface CityApiImages {
    city_id: number,
    id: number,
    url: string
}

interface queryType {
    name: string,
    op: string,
    val: string
}

export interface mapApiRequest {
    filters: queryType[]
}
