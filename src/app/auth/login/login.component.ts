import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  template: ` <a routerLink="/auth/register">Create account</a> `,
  imports: [RouterModule],
})
export class LoginComponent { }
