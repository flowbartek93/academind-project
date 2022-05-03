import { Component, ElementRef, ViewChild, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from '../models/post.model';
import { PostService } from '../post-list/post-service';

@Component({
  templateUrl: './post-create.component.html',
  selector: 'app-post-create',
  styleUrls: ['./post-create.components.scss'],
})
export class PostCreateComponent {
  constructor(private postService: PostService) {}

  //HOOKS

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.postService.addPost(form.value.title, form.value.content);
    form.resetForm();
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  ngOnChanges() {}

  ngOnDestroy() {}
}
