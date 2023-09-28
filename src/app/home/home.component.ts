import { Component, inject } from '@angular/core';
import { MessageInputComponent } from './ui/message-input.component';
import { MessageService } from '../shared/data-access/message.service';
import { MessageListComponent } from './ui/message-list.component';

@Component({
  standalone: true,
  selector: 'app-home',
  template: `
    <app-message-list [messages]="messageService.messages()" />
    <app-message-input (send)="messageService.add$.next($event)" />
  `,
  imports: [MessageInputComponent, MessageListComponent],
})
export default class HomeComponent {
  messageService = inject(MessageService);
}
