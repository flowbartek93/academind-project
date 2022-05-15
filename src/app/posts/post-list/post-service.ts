import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Post } from '../models/post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private postsUpdated: Subject<Post[]> = new Subject();

  constructor(private httpClient: HttpClient) {}

  getPosts() {
    this.httpClient
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map((postData) => {
          return postData.posts.map((post) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
            };
          });
        })
      )
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;

        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpadateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post = { id: null, title: title, content: content };

    this.httpClient
      .post<{ msg: string; postId: string }>(
        'http://localhost:3000/api/posts',
        post
      )
      .pipe(
        tap((res) => console.log('request', res.msg)),
        map((res) => {
          return {
            ...post,
            id: res.postId,
          };
        })
      )
      .subscribe((postData) => {
        this.posts.push(postData);

        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(postId: string) {
    console.log(postId);
    this.httpClient
      .delete(`http://localhost:3000/api/posts/` + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter((post) => post.id !== postId);

        this.posts = updatedPosts;
        this.postsUpdated.next([...updatedPosts]);
      });
  }
}
