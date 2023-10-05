import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Credentials } from 'src/app/shared/interfaces/credentials';
import { LoginStatus } from '../data-access/login.service';

@Component({
  standalone: true,
  selector: 'app-login-form',
  template: `
    <form
      [formGroup]="loginForm"
      (ngSubmit)="login.emit(loginForm.getRawValue())"
    >
      <input formControlName="email" type="email" placeholder="email" />
      <input
        formControlName="password"
        type="password"
        placeholder="password"
      />
      @if (loginStatus === 'error'){
      <p>Could not log you in with those details.</p>
      } @if(loginStatus === 'authenticating'){
      <p>Authenticating...</p>
      }

      <button type="submit" [disabled]="loginStatus === 'authenticating'">
        Login
      </button>
    </form>
  `,
  imports: [ReactiveFormsModule],
})
export class LoginFormComponent {
  @Input({ required: true }) loginStatus!: LoginStatus;
  @Output() login = new EventEmitter<Credentials>();

  private fb = inject(FormBuilder);

  loginForm = this.fb.nonNullable.group({
    email: [''],
    password: [''],
  });
}
