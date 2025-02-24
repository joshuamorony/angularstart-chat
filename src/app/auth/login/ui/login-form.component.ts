import {
  Component,
  inject,
  input,
  output,
  ResourceStatus,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Credentials } from 'src/app/shared/interfaces/credentials';

@Component({
    selector: 'app-login-form',
    template: `
    <form
      [formGroup]="loginForm"
      (ngSubmit)="login.emit(loginForm.getRawValue())"
    >
      <mat-form-field appearance="fill">
        <mat-label>email</mat-label>
        <input
          matNativeControl
          formControlName="email"
          type="email"
          placeholder="email"
        />
        <mat-icon matPrefix>mail</mat-icon>
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>password</mat-label>
        <input
          matNativeControl
          formControlName="password"
          type="password"
          placeholder="password"
        />
        <mat-icon matPrefix>lock</mat-icon>
      </mat-form-field>

      @if (loginStatus() === resourceStatus.Error) {
        <mat-error>Could not log you in with those details.</mat-error>
      }
      @if (loginStatus() === resourceStatus.Loading) {
        <mat-spinner diameter="50"></mat-spinner>
      }

      <button
        mat-raised-button
        color="accent"
        type="submit"
        [disabled]="loginStatus() === resourceStatus.Loading"
      >
        Login
      </button>
    </form>
  `,
    imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatProgressSpinnerModule,
    ],
    styles: [
        `
      form {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      button {
        width: 100%;
      }

      mat-error {
        margin: 5px 0;
      }

      mat-spinner {
        margin: 1rem 0;
      }
    `,
    ]
})
export class LoginFormComponent {
  loginStatus = input.required<ResourceStatus>();
  login = output<Credentials>();
  resourceStatus = ResourceStatus;

  private fb = inject(FormBuilder);

  loginForm = this.fb.nonNullable.group({
    email: [''],
    password: [''],
  });
}
