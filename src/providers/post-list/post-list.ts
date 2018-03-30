import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Post } from '../../model/post/post';

@Injectable()
export class PostListProvider {

  private postListRef;

  constructor(private afDB: AngularFireDatabase) {
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
}
