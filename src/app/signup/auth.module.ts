import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { LoginComponent } from '../login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { SignupComponent } from './signup.component';

@NgModule({
  declarations: [LoginComponent, SignupComponent],

  imports: [
    AuthRoutingModule,
    CommonModule,
    AngularMaterialModule,
    FormsModule,
  ],
})
export class AuthModule {}
