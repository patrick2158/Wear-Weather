import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Post } from '../../model/post/post';
import { AngularFireStorage } from 'angularfire2/storage';
import { storage } from 'firebase/app';

@Injectable()
export class PostListProvider {

  private postListRef;

  constructor(
    private afDB: AngularFireDatabase,
    private afStorage: AngularFireStorage
  ) {
    this.postListRef = this.afDB.list<Post>('post-list');
  }

  getPostList() {
    return this.postListRef;
  }

  addPost(post: Post) {
    return this.postListRef.push(post);
  }

  updatePost(post: Post) {
    return this.postListRef.update(post.key, post);
  }

  removePost(post: Post) {
    return this.postListRef.remove(post.key);
  }

  uploadImage(imageString): Promise<any> {
    let image: string = this.generateUUID + '.jpg',
      storegeRef: any,
      parseUpload: any;

    return new Promise((resolve, reject) => {
      storegeRef = this.afStorage.ref('images/' + image);
      parseUpload = storegeRef.putString(imageString, 'data_url');

      parseUpload.on('state_changed', snapshot => {

      },
        err => {
          reject(err);
        },
        success => {
          resolve(parseUpload.snapshot);
        });
    });
  }

  private generateUUID(): string {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
}
