import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../models/post.model';
import { PostService } from './post-service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit {
  constructor(private postService: PostService) {}

  private sub: Subscription;

  isLoading = false;
  posts: Post[] = [];

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts();

    this.sub = this.postService
      .getPostUpadateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;

        this.isLoading = false;
      });
  }

  onDelete(id: any) {
    this.postService.deletePost(id);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
