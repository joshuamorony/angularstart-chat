import { Component, Input } from '@angular/core';
import { Message } from 'src/app/shared/interfaces/message';

@Component({
  standalone: true,
  selector: 'app-message-list',
  template: `
    <ul>
      @for (message of messages; track message.created){
      <li>
        {{ message.author }}
        {{ message.content }}
        {{ message.created }}
      </li>
      }
    </ul>
  `,
})
export class MessageListComponent {
  @Input({ required: true }) messages!: Message[];
}
