import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { AngularFireAuth } from 'angularfire2/auth';
import { ImageProvider } from '../../providers/image/image';

@Component({
  selector: 'page-upload',
  templateUrl: 'upload.html',
})
export class UploadPage {
  private images = [];
  imageUrls = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    private afAuth: AngularFireAuth,
    private imageSrv: ImageProvider) {
    let data = localStorage.getItem('images');
    if (data) {
      this.images = JSON.parse(data);
    }
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
}
