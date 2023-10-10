import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-message-input',
  template: `
    <input
      type="text"
      [formControl]="messageControl"
      placeholder="type a message..."
    />
    <button
      mat-button
      (click)="send.emit(messageControl.value); messageControl.reset()"
    >
      <mat-icon>send</mat-icon>
    </button>
  `,
  imports: [ReactiveFormsModule, MatButtonModule, MatIconModule],
  styles: [
    `
      :host {
        width: 100%;
        position: relative;
      }

      input {
        width: 100%;
        background: var(--white);
        border: none;
        font-size: 1.2em;
        padding: 2rem 1rem;
      }

      button {
        height: 100% !important;
        position: absolute;
        right: 0;
        bottom: 0;

        mat-icon {
          margin-right: 0;
        }
      }
    `,
  ],
})
export class MessageInputComponent {
  @Output() send = new EventEmitter<string>();

  messageControl = new FormControl();
}
