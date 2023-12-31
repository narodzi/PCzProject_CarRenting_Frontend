import { Component } from '@angular/core';
import { MaterialModule } from '../../shared/modules/material.module';
import { RentalTableComponent } from '../../shared/components/rental-table/rental-table.component';
import { SearchFormComponent } from '../search-form/search-form.component';
import { HomeDashboardNav } from './home-dasboard.models';
import { SearchResultsComponent } from '../search-results/search-results.component';
import { Rental, RentalSearchRequest, RentalSearchResponse } from 'src/app/shared/models/rental.model';
import { FilteredApi } from 'src/app/shared/api/filtered.api';
import { RentalApi } from 'src/app/shared/api/rental.api';
import { CommonModule } from '@angular/common';
import { Observable, map, tap } from 'rxjs';
import { compareRentalByStartDate, getRentalStatus} from 'src/app/shared/utils/date-time.adapter';
import { Car } from 'src/app/shared/models/car.model';
import { CarApi } from 'src/app/shared/api/car.api';
import { NoDataComponent } from 'src/app/shared/components/no-data/no-data.component';

@Component({
  selector: 'app-home',
  templateUrl: './home-dashboard.component.html',
  styleUrls: ['./home-dashboard.component.scss'],
  imports: [CommonModule, MaterialModule, RentalTableComponent, SearchFormComponent, SearchResultsComponent, NoDataComponent],
  standalone: true
})
export class HomeDashboardComponent {
  getRentalStatus = getRentalStatus
  HomeDashboardNav = HomeDashboardNav
  selectedIndex = 0

  rentalFilters?: RentalSearchRequest
  rentalSearchResults?: RentalSearchResponse[]
  
  rentals$: Observable<Rental[]>
  currentRentalCar$: Observable<Car> | undefined

  constructor(private readonly filteredApi: FilteredApi, private readonly rentalApi: RentalApi, private readonly carApi: CarApi) {
    this.rentals$ = this.rentalApi.getRentalsForUser().pipe(map(rentals => rentals.sort(compareRentalByStartDate)), tap(rental => {
      const carId = rental.at(0)?.car_id
      if(carId) {
        this.currentRentalCar$ = this.carApi.getCar(carId)
      }
    }))

  }

  handleFormFilled(filledFilters: RentalSearchRequest) {
    console.log(filledFilters)
    this.filteredApi.getRentalSearchResults(filledFilters).subscribe({
      next: (resp) => {
        this.rentalFilters = filledFilters
        this.rentalSearchResults = resp
        this.changeTab(HomeDashboardNav.SECOND_TAB)
      }
    })
  }

  changeTab(direction: HomeDashboardNav) {
    this.selectedIndex = direction
    this.rentals$ = this.rentalApi.getRentalsForUser().pipe(map(rentals => rentals.sort(compareRentalByStartDate)), tap(rental => {
      const carId = rental.at(0)?.car_id
      if(carId) {
        this.currentRentalCar$ = this.carApi.getCar(carId)
      }
    }))
  }

  getIcon(startDate: string, endDate: string, isCancelled: boolean) {
    const result = getRentalStatus(startDate, endDate, isCancelled)

    if(result === 'Anulowane') {
      return 'assets/cancelled-icon.svg'
    }
    if(result === 'Nadchodzące') {
      return 'assets/pending-icon.svg'
    }
    if(result === 'W trakcie') {
      return 'assets/in-progress-icon.svg'
    }
    if(result === 'Zakończone') {
      return 'assets/done-icon.svg'
    }
    return ''
  }
}
