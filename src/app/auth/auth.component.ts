import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  FormSubmittedEvent,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from './auth.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatGridListModule,
    MatButtonModule,
    MatDialogModule,
    RouterModule,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent implements OnInit {
  loginFormGroup = new FormGroup({
    email: new FormControl('tony.gamble@gmail.com', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('Test1234', [Validators.required]),
  });
  private readonly router = inject(Router);

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticatedUser()) this.router.navigate(['admin']);
  }

  get emailControl() {
    return this.loginFormGroup.controls.email;
  }
  get passwordControl() {
    return this.loginFormGroup.controls.password;
  }

  handleLoginSubmit() {
    if (!this.loginFormGroup.valid) return;
    const loggedIn = this.authService.login(
      this.emailControl.value || '',
      this.passwordControl.value || ''
    );

    console.log({ loggedIn });

    if (!loggedIn) {
      alert('Username and password invalid');
      return;
    }

    this.router.navigate(['admin']);
  }
}
