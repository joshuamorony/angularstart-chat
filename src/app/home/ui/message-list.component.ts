import { Component, Input } from '@angular/core';
import { Message } from 'src/app/shared/interfaces/message';

@Component({
  standalone: true,
  selector: 'app-message-list',
  template: ` <p>Hello world</p> `,
})
export class MessageListComponent {
  @Input({ required: true }) messages!: Message[];
}
