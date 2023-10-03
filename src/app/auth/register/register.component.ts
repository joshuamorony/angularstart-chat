import { Component, effect, inject } from '@angular/core';
import { RegisterFormComponent } from './ui/register-form.component';
import { RegisterService } from './data-access/register.service';
import { Router, RouterModule } from '@angular/router';

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
  private router = inject(Router);

  constructor() {
    effect(() => {
      if (this.registerService.status() === 'success') {
        this.router.navigate(['home']);
      }
    });
  }
}
