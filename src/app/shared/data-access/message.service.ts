import { Injectable, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, defer, exhaustMap, merge, of } from 'rxjs';
import { collection, query, orderBy, limit, addDoc } from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { catchError, filter, ignoreElements, map, retry } from 'rxjs/operators';

import { FIRESTORE } from 'src/app/app.config';
import { Message } from '../interfaces/message';
import { AuthService } from './auth.service';
import { signalSlice } from 'ngxtension/signal-slice';

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

  private initialState: MessageState = {
    messages: [],
    error: null,
  };

  // sources
  private authUser$ = toObservable(this.authService.state.user);
  private messages$ = this.getMessages().pipe(
    // restart stream when user reauthenticates
    retry({
      delay: () => this.authUser$.pipe(filter((user) => !!user)),
    })
  );
  private logout$ = this.authUser$.pipe(filter((user) => !user));

  private sources$ = merge(
    this.messages$.pipe(map((messages) => ({ messages }))),
    this.logout$.pipe(map(() => ({ messages: [] })))
  );

  // state
  state = signalSlice({
    initialState: this.initialState,
    sources: [this.sources$],
    asyncReducers: {
      add: (_state, $: Observable<Message['content']>) =>
        $.pipe(
          exhaustMap((message) => this.addMessage(message)),
          ignoreElements(),
          catchError((error) => of({ error }))
        ),
    },
  });

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
      author: this.authService.state.user()?.email,
      content: message,
      created: Date.now().toString(),
    };

    const messagesCollection = collection(this.firestore, 'messages');
    return defer(() => addDoc(messagesCollection, newMessage));
  }
}
