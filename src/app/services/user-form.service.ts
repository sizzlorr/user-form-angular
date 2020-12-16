import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { createHttpObservable } from '../util/util';

@Injectable({
  providedIn: 'root'
})
export class UserFormService {
  private subject = new BehaviorSubject<any>([]);

  dummyData$: Observable<any> = this.subject.asObservable();

  constructor() { }

  init() {
    const $http = createHttpObservable('https://restcountries.eu/rest/v2/all');

    $http.pipe(
      tap(() => console.log('Http request executed'))
    ).subscribe(countries => this.subject.next(countries));
  }

  getCountries() {
    return this.dummyData$.pipe(
      map(countries => countries.map((country: any) => {
        return {
          value: country.alpha2Code,
          viewValue: country.name
        };
      }))
    );
  }

  getLanguages() {
    return this.dummyData$.pipe(
      map(countries => countries.map(country => {
        return country.languages.map((language: any) => {
          return {
            value: language.iso639_1,
            viewValue: language.name
          };
        });
      }))
    );
  }
}
