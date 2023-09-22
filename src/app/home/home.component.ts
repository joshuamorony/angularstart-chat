import { Component, inject } from '@angular/core';
import { MessageInputComponent } from './ui/message-input.component';
import { MessageService } from '../shared/data-access/message.service';

@Component({
  standalone: true,
  selector: 'app-home',
  template: ` <app-message-input (send)="messageService.add$.next($event)" /> `,
  imports: [MessageInputComponent],
})
export default class HomeComponent {
  messageService = inject(MessageService);
}
