import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { User } from 'firebase/auth';
import { Message } from 'src/app/shared/interfaces/message';

@Component({
  standalone: true,
  selector: 'app-message-list',
  template: `
    <ul class="gradient-bg">
      @for (message of messages; track (message.created + message.author)){
      <li
        [ngStyle]="{
          'flex-direction':
            message.author === activeUser?.email ? 'row-reverse' : 'row'
        }"
      >
        <div class="avatar animate-in-primary">
          <img
            src="https://api.dicebear.com/7.x/bottts/svg?seed={{
              message.author.split('@')[0]
            }}"
          />
        </div>
        <div class="message animate-in-secondary">
          <small>{{ message.author }}</small>
          <p>
            {{ message.content }}
          </p>
        </div>
      </li>
      }
    </ul>
  `,
  styles: [
    `
      ul {
        list-style-type: none;
        padding: 1rem;
        padding-bottom: 5rem;
        margin: 0;
      }

      li {
        display: flex;
        margin-bottom: 2rem;
      }

      .avatar {
        width: 75px;
        margin: 0 1rem;
        height: auto;
        filter: drop-shadow(2px 3px 5px var(--accent-darker-color));
      }

      .message {
        width: 100%;
        background: #fff;
        padding: 2rem;
        border-radius: 5px;
        filter: drop-shadow(2px 4px 3px var(--primary-darker-color));
      }
    `,
  ],
  imports: [CommonModule],
})
export class MessageListComponent {
  @Input({ required: true }) messages!: Message[];
  @Input({ required: true }) activeUser!: User | null;
}
