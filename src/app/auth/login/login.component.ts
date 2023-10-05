import { Component, effect, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoginFormComponent } from './ui/login-form.component';
import { LoginService } from './data-access/login.service';

@Component({
  standalone: true,
  selector: 'app-login',
  template: `
    <app-login-form
      [loginStatus]="loginService.status()"
      (login)="loginService.login$.next($event)"
    />
    <a routerLink="/auth/register">Create account</a>
  `,
  providers: [LoginService],
  imports: [RouterModule, LoginFormComponent],
})
export class LoginComponent {
  public loginService = inject(LoginService);
  private router = inject(Router);

  constructor() {
    effect(() => {
      if (this.loginService.status() === 'success') {
        this.router.navigate(['home']);
      }
    });
  }
}
