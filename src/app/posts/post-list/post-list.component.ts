import { Component, Input, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/signup/auth.service';
import { Post } from '../models/post.model';
import { PostService } from './post-service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit {
  constructor(
    private postService: PostService,
    private authService: AuthService
  ) {}

  private postsSub: Subscription;
  private authStatusSub: Subscription;

  userIsAuthenticated = false;

  totalPosts = 10;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  currentPage = 1;
  isLoading = false;
  posts: Post[] = [];

  onChangedPage(e: PageEvent) {
    this.currentPage = e.pageIndex + 1;
    this.postsPerPage = e.pageSize;

    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, this.currentPage);

    this.postsSub = this.postService
      .getPostUpadateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.posts = postData.posts;

        this.totalPosts = postData.postCount;
        this.isLoading = false;
      });

    this.userIsAuthenticated = this.authService.getIsAuth();

    // this.authStatusSub = this.authService
    //   .getAuthStatusListener()
    //   .subscribe((isAuthenticated) => {
    //     console.log(isAuthenticated);
    //     this.userIsAuthenticated = isAuthenticated;
    //   });
  }

  onDelete(id: any) {
    this.isLoading = true;
    this.postService.deletePost(id).subscribe(() => {
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    // this.authStatusSub.unsubscribe();
  }
}
