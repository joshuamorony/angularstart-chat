import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, Subject, defer, exhaustMap, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Message } from '../interfaces/message';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  limit,
  orderBy,
  query,
} from '@angular/fire/firestore';

interface MessageState {
  messages: Message[];
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private firestore = inject(Firestore);

  // sources
  messages$ = this.getMessages();
  add$ = new Subject<Message['content']>();

  // state
  private state = signal<MessageState>({
    messages: [],
  });

  // selectors
  messages = computed(() => this.state().messages);

  constructor() {
    // reducers
    this.messages$.pipe(takeUntilDestroyed()).subscribe((messages) =>
      this.state.update((state) => ({
        ...state,
        messages,
      }))
    );

    this.add$
      .pipe(
        takeUntilDestroyed(),
        exhaustMap((message) => this.addMessage(message))
      )
      .subscribe();
  }

  private getMessages() {
    const messagesCollection = query(
      collection(this.firestore, 'messages'),
      orderBy('created', 'desc'),
      limit(50)
    );

    return collectionData(messagesCollection, { idField: 'id' }).pipe(
      map((messages) => [...messages].reverse())
    ) as Observable<Message[]>;
  }

  private addMessage(message: string) {
    const newMessage = {
      author: '',
      content: message,
      created: Date.now().toString(),
    };

    const messagesCollection = collection(this.firestore, 'messages');
    return defer(() => from(addDoc(messagesCollection, newMessage)));
  }
}
