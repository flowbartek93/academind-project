import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Post } from '../models/post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private postsUpdated: Subject<{ posts: Post[]; postCount: number }> =
    new Subject();

  constructor(private httpClient: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;

    this.httpClient
      .get<{ message: string; posts: any; maxPosts: number }>(
        'http://localhost:3000/api/posts' + queryParams
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((transformedPostsData) => {
        this.posts = transformedPostsData.posts;

        console.log(transformedPostsData);
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostsData.maxPosts,
        });
      });
  }

  getPost(id: string) {
    return this.httpClient.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
    }>('http://localhost:3000/api/posts/' + id);
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
      .post<{ msg: string; post: Post }>(
        'http://localhost:3000/api/posts',
        postData
      )
      .pipe(tap((res) => console.log('request', res.msg)))
      .subscribe((postData) => {
        // this.posts.push(postData);

        // this.postsUpdated.next([...this.posts]);

        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;

    if (typeof image === 'object') {
      const postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = { id: id, title: title, content: content, imagePath: image };
    }

    this.httpClient
      .put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe((response) => {
        // const updatedPosts = [...this.posts];
        // const oldPostIndex = updatedPosts.findIndex((p) => p.id === id);

        // const post: Post = {
        //   id: id,
        //   title: title,
        //   content: content,
        //   imagePath: '',
        // };
        // updatedPosts[oldPostIndex] = post;

        // this.posts = updatedPosts;

        // this.postsUpdated.next([...this.posts]);

        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    console.log(postId);
    return this.httpClient.delete(`http://localhost:3000/api/posts/` + postId);

    // .subscribe(() => {
    //   const updatedPosts = this.posts.filter((post) => post.id !== postId);

    //   this.posts = updatedPosts;
    //   this.postsUpdated.next([...updatedPosts]);
    // });
  }
}
