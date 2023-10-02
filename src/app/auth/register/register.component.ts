import { Component } from '@angular/core';
import { RegisterFormComponent } from './ui/register-form.component';

@Component({
  standalone: true,
  selector: 'app-register',
  template: ` <app-register-form status="pending" /> `,
  imports: [RegisterFormComponent],
})
export class RegisterComponent {}
