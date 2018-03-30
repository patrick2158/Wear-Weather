import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { ImageProvider } from '../../providers/image/image';
import { PostListProvider } from '../../providers/post-list/post-list';
import { Post } from '../../model/post/post';

@Component({
  selector: 'page-upload',
  templateUrl: 'upload.html',
})
export class UploadPage {
  private images = [];
  imageUrls = [];
  postForm: FormGroup;

  post: Post = {
    weather: {
      max: 0,
      min: 0
    },
    city: '',
    feel: ''
  };

  isEditable: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    private afAuth: AngularFireAuth,
    private imageSrv: ImageProvider,
    private postListProvider: PostListProvider,
    private formBuilder: FormBuilder,
    private viewCtrl: ViewController) {
      /*this.postForm = this.formBuilder.group({
        'weather' : {
          'max': [0, Validators.required],
          'min': [0, Validators.required]
        },
        'city': ['', Validators.required],
        'feel': ['', Validators.required]
      });*/

      if(navParams.get('isEdited')) {
        this.post = navParams.get('post');
        this.isEditable = true;
      }

    /*let data = localStorage.getItem('images');
    if (data) {
      this.images = JSON.parse(data);
    }*/
  }

  takePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options)
      .then(data => {
        let base64Image = 'data:image/jpeg;base64,' + data;
        return this.imageSrv.uploadImage(base64Image, this.afAuth.auth.currentUser.uid);
      })
      .then(data => {
        console.log(data);
        this.images.push(data.a.name);
        localStorage.setItem('images', JSON.stringify(this.images));
        this.downloadImageUrls();
      });
  }

  downloadImageUrls() {
    let promiseList = [];
    for (let i = 0; i < this.images.length; i++) {
      let promise = this.imageSrv.getImage(this.afAuth.auth.currentUser.uid, this.images[i]);
      promiseList.push(promise);
    }

    Promise.all(promiseList)
      .then(urls => {
        this.imageUrls = urls;
        console.log(urls);
      });
  }

  savePost(post: Post) {
    if(this.isEditable) {
      this.postListProvider.updatePost(post).then(ref => {
        this.viewCtrl.dismiss();
      });
    } else {
      this.postListProvider.addPost(post).then(ref => {
        this.viewCtrl.dismiss();
      });
    }
  }
}
