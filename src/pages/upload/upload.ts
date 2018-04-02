import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { ImageProvider } from '../../providers/image/image';
import { PostListProvider } from '../../providers/post-list/post-list';
import { PreloaderProvider } from '../../providers/preloader/preloader';
import { Post } from '../../model/post/post';

@Component({
  selector: 'page-upload',
  templateUrl: 'upload.html',
})
export class UploadPage {
  private image;

  post: Post = {
    weather: {
      max: 0,
      min: 0
    },
    country: '',
    city: '',
    imageURL: '',
    feel: '',
    like: 0
  };

  isEditable: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private imageProvider: ImageProvider,
    private postListProvider: PostListProvider,
    private viewCtrl: ViewController,
    private preloader: PreloaderProvider) {
    
    this.preloader.displayPreloader();

    if (navParams.get('isAdded')) {
      navParams.get('weather').subscribe(weather => {
        this.post.weather.max = weather.data[0].max_temp;
        this.post.weather.min = weather.data[0].min_temp;
        this.post.country = weather.country_code;
        this.post.city = weather.city_name;
      });
    };

    if (navParams.get('isEdited')) {
      this.post = navParams.get('post');
      this.isEditable = true;
    };

    this.preloader.hidePreloader();
  }

  savePost(post: Post) {
    this.preloader.displayPreloader();

    if (this.isEditable) {
      this.postListProvider.updatePost(post).then(ref => {
        this.viewCtrl.dismiss();
      });
    } else {
      this.postListProvider.uploadImage(this.image).then(snapshot => {
        this.post.imageURL = snapshot.downloadURL;
        this.postListProvider.addPost(post).then(ref => {
          this.preloader.hidePreloader();
        });
      });
    }
    this.viewCtrl.dismiss();
  }

  selectImage() {
    this.imageProvider.selectImage().then(data => {
      this.image = data;
    });
  }
}
