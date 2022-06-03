import { Component, ElementRef, ViewChild, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../models/post.model';
import { PostService } from '../post-list/post-service';
import { mimeType } from './mime-type.validator';

@Component({
  templateUrl: './post-create.component.html',
  selector: 'app-post-create',
  styleUrls: ['./post-create.components.scss'],
})
export class PostCreateComponent {
  constructor(private postService: PostService, public route: ActivatedRoute) {}

  isLoading = false;
  enteredTitle = '';
  enteredContent = '';
  private mode = 'create';
  private postId: string;
  public post: Post;

  imagePreview: string;

  form: FormGroup;

  //HOOKS

  onSavePost() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;

    if (this.mode === 'create') {
      this.postService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content
      );
    }

    this.form.reset();
  }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';

        this.postId = paramMap.get('postId');

        console.log(this.postId);
        this.postService.getPost(this.postId).subscribe((postData) => {
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
          };
        });

        this.form.setValue({
          title: this.post.title,
          content: this.post.content,
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];

    this.form.patchValue({ image: file });

    this.form.get('image').updateValueAndValidity();

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };

    console.log(reader);

    reader.readAsDataURL(file);
  }

  ngAfterViewInit() {}

  ngOnChanges() {}

  ngOnDestroy() {}
}
