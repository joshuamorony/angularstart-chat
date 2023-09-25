import { Injectable, computed, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from '../interfaces/message';

interface MessageState {
  messages: Message[];
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  // sources
  add$ = new Subject();

  // state
  private state = signal<MessageState>({
    messages: [],
  });

  // selectors
  messages = computed(() => this.state().messages);
}
