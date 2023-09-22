import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-message-input',
  template: ` <p>Hello world</p> `,
})
export class MessageInputComponent {
  @Output() send = new EventEmitter<string>();

  messageControl = new FormControl();
}
