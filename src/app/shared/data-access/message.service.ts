import {inject, Injectable} from '@angular/core';
import {defer, exhaustMap, Observable, of} from 'rxjs';
import {addDoc, collection, limit, orderBy, query} from 'firebase/firestore';
import {collectionData} from 'rxfire/firestore';
import {catchError, filter, ignoreElements, map, retry} from 'rxjs/operators';

import {FIRESTORE} from 'src/app/app.config';
import {Message} from '../interfaces/message';
import {AuthService, AuthUser} from './auth.service';
import {rxState} from "@rx-angular/state";
import {rxActions} from "@rx-angular/state/actions";
import {rxEffects} from "@rx-angular/state/effects";

interface MessageState {
  authUser: AuthUser;
  messages: Message[];
  error: string | null;
}

@Injectable({providedIn: 'root',})
export class MessageService {
  private firestore = inject(FIRESTORE);
  private authService = inject(AuthService);

  actions = rxActions<{ add: Message['content'] }>();

  state = rxState<MessageState>(({set, connect, select}) => {
    set({ messages: [], error: null });
    connect('authUser', this.authService.user);

    const authenticated$ = select('authUser').pipe(map((user) => !!user));

    connect('messages', this.getMessages().pipe(
      retry({delay: () => authenticated$ }) // restart stream when user re-authenticates
    ));

    connect('messages', authenticated$.pipe(filter(x => !x)), () => []);

    connect(
      'error',
      this.actions.add$.pipe(
        exhaustMap((message) => this.addMessage(message)),
        ignoreElements(),
        catchError(err => of(err))
      )
    );
  });

  effects = rxEffects(({ register }) => {
    register(this.state.select('messages'), (messages) => {
      console.log('messages', messages);
    })
  })

  // selectors
  messages = this.state.signal('messages');
  error = this.state.signal('error');

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
