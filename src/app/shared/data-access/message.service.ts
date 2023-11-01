import { Injectable, Signal, computed, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { addDoc, collection, limit, orderBy, query } from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { Observable, Subject, defer, exhaustMap, merge, of } from 'rxjs';
import { catchError, filter, ignoreElements, map, retry } from 'rxjs/operators';

import { FIRESTORE } from 'src/app/app.config';
import { Message } from '../interfaces/message';
import { signalFrom } from '../signal';
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
  private authUser$ = toObservable(this.authService.user);

  // sources
  messages$ = this.getMessages().pipe(
    // restart stream when user reauthenticates
    retry({
      delay: () => this.authUser$.pipe(filter((user) => !!user)),
    })
  );
  add$ = new Subject<Message['content']>();
  error$ = new Subject<string>();
  logout$ = this.authUser$.pipe(filter((user) => !user));

  // state
  private state: Signal<MessageState>;

  // selectors
  messages: Signal<Message[]>;
  error: Signal<string | null>;

  constructor() {
    // reducers
    const nextState$ = merge(
      this.messages$.pipe(map((messages) => ({ messages }))),
      this.logout$.pipe(map(() => ({ messages: [] }))),
      this.error$.pipe(map((error) => ({ error }))),
      this.add$.pipe(
        exhaustMap((message) => this.addMessage(message)),
        ignoreElements(),
        catchError((error) => of({ error }))
      )
    );

    const initialState: MessageState = {
      messages: [],
      error: null,
    };

    this.state = signalFrom(initialState, nextState$);
    this.messages = computed(() => this.state().messages);
    this.error = computed(() => this.state().error);
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
      author: this.authService.user()?.email,
      content: message,
      created: Date.now().toString(),
    };

    const messagesCollection = collection(this.firestore, 'messages');
    return defer(() => addDoc(messagesCollection, newMessage));
  }
}
