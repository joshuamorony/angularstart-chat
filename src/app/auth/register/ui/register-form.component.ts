import { Component, EventEmitter, Output } from '@angular/core';
import { Credentials } from 'src/app/shared/interfaces/credentials';

@Component({
  standalone: true,
  selector: 'app-register-form',
  template: ` <p>Hello world</p> `,
})
export class RegisterFormComponent {
  @Output() create = new EventEmitter<Credentials>();
}
