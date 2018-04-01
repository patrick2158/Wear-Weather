import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Injectable()
export class ImageProvider {
  public cameraImage: String

  constructor(private camara: Camera) {
  }

  selectImage(): Promise<any> {
    return new Promise(resolve => {
      let options: CameraOptions = {
        quality: 100,
        targetWidth: 320,
        targetHeight: 240,
        destinationType: this.camara.DestinationType.DATA_URL,
        encodingType: this.camara.EncodingType.JPEG,
        mediaType: this.camara.MediaType.PICTURE,
        correctOrientation: true
      };

      this.camara.getPicture(options).then( data => {
        this.cameraImage = "data:image/jpeg;base64," + data;
        resolve(this.cameraImage);
      });
    });
  }
}
