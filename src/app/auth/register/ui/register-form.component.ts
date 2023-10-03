import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Credentials } from 'src/app/shared/interfaces/credentials';
import { passwordMatchesValidator } from '../utils/password-matches';
import { RegisterStatus } from '../data-access/register.service';

@Component({
  standalone: true,
  selector: 'app-register-form',
  template: `
    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" #form="ngForm">
      <input formControlName="email" type="email" placeholder="email" />
      @if( (registerForm.controls.email.dirty || form.submitted) &&
      !registerForm.controls.email.valid ) {
      <p>Please provide a valid email</p>
      }
      <input
        formControlName="password"
        data-test="create-password-field"
        type="password"
        placeholder="password"
      />
      @if( (registerForm.controls.password.dirty || form.submitted) &&
      !registerForm.controls.password.valid ){
      <p>Password must be at least 8 characters long</p>
      }
      <input
        formControlName="confirmPassword"
        type="password"
        placeholder="confirm password"
      />
      @if( (registerForm.controls.confirmPassword.dirty || form.submitted) &&
      registerForm.hasError('passwordMatch') ){
      <p>Must match password field</p>
      } @switch (status){ @case ('error'){

      <p>Could not create account with those details.</p>
      } @case('creating'){
      <p>Creating...</p>
      } }
      <button type="submit" [disabled]="status === 'creating'">Submit</button>
    </form>
  `,
  imports: [ReactiveFormsModule],
})
export class RegisterFormComponent {
  @Input({ required: true }) status!: RegisterStatus;
  @Output() register = new EventEmitter<Credentials>();

  private fb = inject(FormBuilder);

  registerForm = this.fb.nonNullable.group(
    {
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.minLength(8), Validators.required]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      updateOn: 'blur',
      validators: [passwordMatchesValidator],
    }
  );

  onSubmit() {
    if (this.registerForm.valid) {
      const { confirmPassword, ...credentials } =
        this.registerForm.getRawValue();
      this.register.emit(credentials);
    }
  }
}
