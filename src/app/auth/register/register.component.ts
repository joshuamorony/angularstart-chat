import { Component } from '@angular/core';
import { RegisterFormComponent } from './ui/register-form.component';

@Component({
  standalone: true,
  selector: 'app-register',
  template: ` <app-register-form /> `,
  imports: [RegisterFormComponent],
})
export class RegisterComponent { }
