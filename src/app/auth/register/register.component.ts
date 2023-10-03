import { Component, inject } from '@angular/core';
import { RegisterFormComponent } from './ui/register-form.component';
import { RegisterService } from './data-access/register.service';

@Component({
  standalone: true,
  selector: 'app-register',
  template: `
    <app-register-form
      [status]="registerService.status()"
      (register)="registerService.createUser$.next($event)"
    />
  `,
  providers: [RegisterService],
  imports: [RegisterFormComponent],
})
export class RegisterComponent {
  public registerService = inject(RegisterService);
}
