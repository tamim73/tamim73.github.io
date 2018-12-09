import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
@Injectable(
    // {
    //  providedIn: 'root'
    // }
)
export class DepartmentsService {
    private depsUrl = 'https://trainingg.herokuapp.com/deps/all';
    constructor (private http: HttpClient) {
    }
    getAllDepartments(): Observable<Object[]> {
        return this.http.get<Object[]>(this.depsUrl)
        .pipe(tap(data => console.log(JSON.stringify(data))), catchError(this.handleError)
        );
    }

    private handleError(err: HttpErrorResponse) {
        let errorMessage = '';
        if (err.error instanceof ErrorEvent) {
            errorMessage = `An error occurrd : ${err.error.message}`;
        } else {
            errorMessage = `Server returned code : ${err.status}, error message is: ${err.message}`;
        }
        console.error(errorMessage);
        return throwError(errorMessage);
    }
}
