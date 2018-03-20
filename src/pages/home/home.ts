import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { share } from 'rxjs/operators';
import * as moment from 'moment';

import { UploadPage } from '../upload/upload';


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

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public http: HttpClient,
    private geolocation: Geolocation,
    private camera: Camera) {
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

  presentModal() {
    let modal = this.modalCtrl.create(UploadPage);
    modal.present();
  }

  takePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  }
}
