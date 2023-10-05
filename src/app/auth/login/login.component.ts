import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginFormComponent } from './ui/login-form.component';

@Component({
  standalone: true,
  selector: 'app-login',
  template: `
    <app-login-form loginStatus="pending" />
    <a routerLink="/auth/register">Create account</a>
  `,
  imports: [RouterModule, LoginFormComponent],
})
export class LoginComponent {}
