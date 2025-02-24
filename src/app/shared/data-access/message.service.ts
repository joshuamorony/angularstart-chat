import { Injectable, computed, effect, inject, signal } from '@angular/core';
import {
  rxResource,
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { EMPTY, Observable, Subject, defer, exhaustMap } from 'rxjs';
import { collection, query, orderBy, limit, addDoc } from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { filter, map, retry, startWith } from 'rxjs/operators';

import { FIRESTORE } from 'src/app/app.config';
import { Message } from '../interfaces/message';
import { AuthService } from './auth.service';

interface MessageState {
  messages: Message[];
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private firestore = inject(FIRESTORE);
  private authService = inject(AuthService);

  // sources
  add = signal<Message['content'] | undefined>(undefined, {
    equal: () => false,
  });

  messages = rxResource({
    request: () => ({ user: this.authService.user() }),
    loader: () => this.getMessages(),
  });

  addResource = rxResource({
    request: () => ({ add: this.add() }),
    loader: ({ request }) =>
      request.add ? this.addMessage(request.add) : EMPTY,
  });

  constructor() {
    effect(() => {
      console.log(this.messages.value());
    });
  }

  private getMessages() {
    const messagesCollection = query(
      collection(this.firestore, 'messages'),
      orderBy('created', 'desc'),
      limit(50),
    );

    return collectionData(messagesCollection, { idField: 'id' }).pipe(
      map((messages) => [...messages].reverse()),
    ) as Observable<Message[]>;
  }

  private addMessage(message: string) {
    const newMessage = {
      author: this.authService.user()?.email,
      content: message,
      created: Date.now().toString(),
    };

    const messagesCollection = collection(this.firestore, 'messages');
    return defer(() => addDoc(messagesCollection, newMessage));
  }
}
