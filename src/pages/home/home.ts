import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { share } from 'rxjs/operators';
import * as moment from 'moment';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  appKey: string = '5537c6f5-c7f6-4055-ad60-7043b9125387';
  url: string = '/weather';
  version: string = '1';
  weather: Observable<any>;
  myDate: string;

  constructor(public navCtrl: NavController, public http: HttpClient, private geolocation: Geolocation) {
    //myDate
    let now = moment();
    this.myDate = moment(now.format(), moment.ISO_8601).format();
    //weather
    geolocation.getCurrentPosition().then(pos => {
      this.weather = this.http.get(this.url, { 
        headers: new HttpHeaders().set('appKey', this.appKey),
        params: new HttpParams().set('version', this.version)
        .set('lat', pos.coords.latitude.toString())
        .set('lon', pos.coords.longitude.toString())
      }).pipe(share());
      /*this.weather.subscribe(data => {
        data.weather.hourly[0].sky.code;
      });*/
    });
  }
}
