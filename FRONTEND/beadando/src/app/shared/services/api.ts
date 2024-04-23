import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  baseUrl = 'http://localhost:8000'

  getData<T>(
    endpoint: string,
    body: any = {},
    options: { withCredentials?: boolean } = {}
  ): Observable<T> {

    const url = `${this.baseUrl}${endpoint}`;
    return this.http.post<T>(url, body, { withCredentials: options.withCredentials || false}).pipe(
      tap((data: T) => {
        console.log('Data received: ', data);
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}
