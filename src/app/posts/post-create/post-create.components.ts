import { Component, ElementRef, ViewChild, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../models/post.model';
import { PostService } from '../post-list/post-service';

@Component({
  templateUrl: './post-create.component.html',
  selector: 'app-post-create',
  styleUrls: ['./post-create.components.scss'],
})
export class PostCreateComponent {
  constructor(private postService: PostService, public route: ActivatedRoute) {}

  enteredTitle = '';
  enteredContent = '';
  private mode = 'create';
  private postId: string;
  private post: Post;

  //HOOKS

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.postService.addPost(form.value.title, form.value.content);
    form.resetForm();
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';

        this.postId = paramMap.get('postId');

        this.post = this.postService.getPost(this.postId);
      } else {
        this.mode = 'create';
      }
    });
  }

  ngAfterViewInit() {}

  ngOnChanges() {}

  ngOnDestroy() {}
}
