import {CityApiCall, CommuteApiCall, HomeApiCall} from "./ApiInterface";

export interface Model {
    ghost?: boolean
    image?: string
    // used as keys for obtaining card from redux
    pageNum?: number
    index?: number

    [key: string]: any
}

export interface City extends CityApiCall, Model {
    population_modified?: string
    median_wage_modified?: string
    poverty_rate_modified?: string
    num_employees_modified?: string
    median_age_modified?: number
}

export interface Commute extends CommuteApiCall, Model {
    distance_modified?: string
    timespan_modified?: string
    walk_dist_modified?: string
    walk_time_modified?: string
    work?: string
    home?: string
}

export interface Home extends HomeApiCall, Model {
    address_modified?: string
    rent_modified?: string
    area_modified?: string
    city_modified?: any
}
