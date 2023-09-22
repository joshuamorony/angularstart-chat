import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-message-input',
  template: `
    <input type="text" [formControl]="messageControl" />
    <button (click)="send.emit(messageControl.value); messageControl.reset()">
      Send
    </button>
  `,
  imports: [ReactiveFormsModule],
})
export class MessageInputComponent {
  @Output() send = new EventEmitter<string>();

  messageControl = new FormControl();
}
