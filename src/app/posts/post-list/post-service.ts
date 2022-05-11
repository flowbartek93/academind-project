import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private postsUpdated: Subject<Post[]> = new Subject();

  constructor(private httpClient: HttpClient) {}

  getPosts() {
    this.httpClient
      .get<{ message: string; posts: Post[] }>(
        'http://localhost:3000/api/posts'
      )
      .subscribe((postData) => {
        this.posts = postData.posts;

        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpadateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post = { id: null, title: title, content: content };

    this.httpClient
      .post<{ msg: string }>('http://localhost:3000/api/posts', post)
      .subscribe((res) => {
        this.posts.push(post);
        console.log(res.msg);
        this.postsUpdated.next([...this.posts]);
      });
  }
}
