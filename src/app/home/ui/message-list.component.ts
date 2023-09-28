import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Message } from 'src/app/shared/interfaces/message';

@Component({
  standalone: true,
  selector: 'app-message-list',
  template: `
    <ul>
      <li
        *ngFor="let message of messages; trackBy: trackByFn"
        data-testid="message"
      >
        {{ message.author }}
        {{ message.content }}
        {{ message.created }}
      </li>
    </ul>
  `,
  imports: [CommonModule],
})
export class MessageListComponent {
  @Input({ required: true }) messages!: Message[];

  trackByFn(index: number, message: Message) {
    return message.created;
  }
}
