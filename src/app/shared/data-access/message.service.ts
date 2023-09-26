import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, Subject, defer, exhaustMap, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Message } from '../interfaces/message';
import { Firestore } from '@angular/fire/firestore';
import { FirebaseFunctions } from '../utils/firebase-functions';

interface MessageState {
  messages: Message[];
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private firestore = inject(Firestore);
  private ff = inject(FirebaseFunctions);

  // sources
  add$ = new Subject<Message['content']>();

  // state
  private state = signal<MessageState>({
    messages: [],
  });

  // selectors
  messages = computed(() => this.state().messages);

  constructor() {
    // reducers
    this.add$
      .pipe(
        takeUntilDestroyed(),
        exhaustMap((message) => this.addMessage(message))
      )
      .subscribe();
  }

  private getMessages() {
    const messagesCollection = this.ff.query(
      this.ff.collection(this.firestore, 'messages'),
      this.ff.orderBy('created', 'desc'),
      this.ff.limit(50)
    );

    return this.ff
      .collectionData(messagesCollection, { idField: 'id' })
      .pipe(map((messages) => [...messages].reverse())) as Observable<
      Message[]
    >;
  }

  private addMessage(message: string) {
    const newMessage = {
      author: '',
      content: message,
      created: Date.now().toString(),
    };

    const messagesCollection = this.ff.collection(this.firestore, 'messages');
    return defer(() => from(this.ff.addDoc(messagesCollection, newMessage)));
  }
}
