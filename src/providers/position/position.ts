import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';

@Injectable()
export class PositionProvider {
  latitude 
  constructor(public http: HttpClient, private geolocation: Geolocation) {
  }

  getLatitude(): Promise<Number> {
    return this.geolocation.getCurrentPosition().then(pos => pos.coords.longitude);
  }

  getLongitude(): Promise<Number> {
    return this.geolocation.getCurrentPosition().then(pos => pos.coords.longitude);
  }
}
