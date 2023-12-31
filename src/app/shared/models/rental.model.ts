export type RentalDto = Partial<{
    readonly id: string | null
    readonly carId: string | null
    readonly userId: string | null
    readonly startDate: string | null
    readonly endDate: string | null
    readonly priceOverall: number | null
    readonly status: string | null
}>

export type Rental = Partial<{
    readonly _id: string | null
    readonly car_id: string | null
    readonly user_id: string | null
    readonly start_date: string | null
    readonly end_date: string | null
    readonly price_overall: number | null
    readonly is_canceled: boolean | null
}>

export type RentalSearchRequest = Partial<{
    start_date: string
    end_date: string
    brand: string | null
    type: string | null
    earliest_production_year: number | null
    gearbox: string | null
    fuel_type: string | null
    minimal_horse_number: number | null
    number_of_seats: number | null
    number_of_doors: number | null
    minimal_trunk_size: number | null
    minimalPrice: number
    maximalPrice: number
}>

export type RentalSearchResponse = Partial<{
    _id: string,
    image_url: string,
    brand: string,
    model: string,
    number_of_seats: number,
    horse_power: number,
    gearbox: string,
    trunk: number,
    fuel_type: string,
    number_of_doors: number,
    color: string,
    production_year: number,
    fuel_consumption: number,
    price_overall: number
}>

export type RentalRequest = Partial<{
    car_id: string
    start_date: string
    end_date: string
}>