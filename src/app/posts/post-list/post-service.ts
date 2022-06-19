import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Post } from '../models/post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private postsUpdated: Subject<Post[]> = new Subject();

  constructor(private httpClient: HttpClient, private router: Router) {}

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

  getPost(id: string) {
    return this.httpClient.get<{ _id: string; title: string; content: string }>(
      'http://localhost:3000/api/posts/' + id
    );
  }

  getPostUpadateListener() {
    return this.postsUpdated.asObservable(); //wyprowadza tablice postUpdated na zewnątrz app
  }

  addPost(title: string, content: string, image: File) {
    // const post = { id: null, title: title, content: content };

    const postData = new FormData();

    postData.append('title', title);
    postData.append('content', content);

    postData.append('image', image, title);

    this.httpClient
      .post<{ msg: string; postId: string }>(
        'http://localhost:3000/api/posts',
        postData
      )
      .pipe(
        tap((res) => console.log('request', res.msg)),
        map((res) => {
          const post: Post = { id: res.postId, title: title, content: content };
          return {
            ...post,
            id: res.postId,
          };
        })
      )
      .subscribe((postData) => {
        this.posts.push(postData);

        this.postsUpdated.next([...this.posts]);

        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id: id, title: title, content: content };

    this.httpClient
      .put('http://localhost:3000/api/posts/' + id, post)
      .subscribe((response) => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex((p) => p.id === post.id);
        updatedPosts[oldPostIndex] = post;

        this.posts = updatedPosts;

        this.postsUpdated.next([...this.posts]);

        this.router.navigate(['/']);
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
