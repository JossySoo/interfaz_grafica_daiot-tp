import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SensorData } from '../data.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl = 'https://us-central1-daiot-tp.cloudfunctions.net/api';

  constructor(private http: HttpClient) { }

  getAllRecords(): Observable<SensorData[]> {
    return this.http.get<SensorData[]>(`${this.baseUrl}/getAllRecords`);
  }

  getLastRecords(): Observable<SensorData[]> {
    return this.http.get<SensorData[]>(`${this.baseUrl}/getLastRecords`);
  }
}