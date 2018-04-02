import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { share } from 'rxjs/operators';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { UploadPage } from '../upload/upload';
import { Post } from '../../model/post/post';
import { PostListProvider } from '../../providers/post-list/post-list'; 
import { WEATHER_API_KEY } from './home.config';
import { PreloaderProvider } from '../../providers/preloader/preloader';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  url: string = '/weather';
  units: string = 'M';
  days: string = "7";
  weather: Observable<any>;
  postList: Observable<Post[]>

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public http: HttpClient,
    private geolocation: Geolocation,
    private afAuth: AngularFireAuth,
    private afDB: AngularFireDatabase,
    private postListProvider: PostListProvider,
    private preloader: PreloaderProvider) {

    preloader.displayPreloader();
    //weather
    geolocation.getCurrentPosition().then(pos => {
      this.weather = this.http.get(this.url, {
        params: new HttpParams()
          .set('lat', pos.coords.latitude.toString())
          .set('lon', pos.coords.longitude.toString())
          .set('days', this.days)
          .set('units', this.units)
          .set('key', WEATHER_API_KEY)
      }).pipe(share());
    });

    this.postList = this.postListProvider.getPostList().valueChanges();
    preloader.hidePreloader();
  }

  signOut() {
    this.afAuth.auth.signOut();
  }

  addPost() {
    let params = { weather: this.weather, isAdded: true },
    modal = this.modalCtrl.create(UploadPage, params);
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
