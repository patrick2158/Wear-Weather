import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { share } from 'rxjs/operators';
import * as moment from 'moment';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { UploadPage } from '../upload/upload';
import { Post } from '../../model/post/post';
import { PostListProvider } from '../../providers/post-list/post-list'; 


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  appid: string = 'a7d01c2c7c66c5cc425817b046434b5e';
  url: string = '/weather';
  units: string = 'metric';
  myDate: string;
  weather: Observable<any>;
  postList: Observable<Post[]>

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public http: HttpClient,
    private geolocation: Geolocation,
    private afAuth: AngularFireAuth,
    private afDB: AngularFireDatabase,
    private postListProvider: PostListProvider) {
    //myDate
    let now = moment();
    this.myDate = moment(now.format(), moment.ISO_8601).format();
    //weather
    geolocation.getCurrentPosition().then(pos => {
      this.weather = this.http.get(this.url, {
        params: new HttpParams()
          .set('lat', pos.coords.latitude.toString())
          .set('lon', pos.coords.longitude.toString())
          .set('appid', this.appid)
          .set('units', this.units)
      }).pipe(share());
      this.weather.subscribe(data => {
        console.log(data);
      });
    });

    this.postList = this.postListProvider.getPostList().valueChanges();
  }

  signOut() {
    this.afAuth.auth.signOut();
  }

  addPost() {
    let modal = this.modalCtrl.create(UploadPage);
    modal.present();
  }

  editPost(post: Post) {
    let params = { post: post, isEdited: true },
    modal = this.modalCtrl.create(UploadPage, params);
    modal.present();
  }

  removePost(post: Post) {
    this.postListProvider.removePost(post);
  }
}
