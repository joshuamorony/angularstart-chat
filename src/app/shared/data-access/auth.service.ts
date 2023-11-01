import { Injectable, Signal, computed, inject } from '@angular/core';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { authState } from 'rxfire/auth';
import { defer, from, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { AUTH } from 'src/app/app.config';
import { Credentials } from '../interfaces/credentials';
import { signalFrom } from '../signal';

export type AuthUser = User | null | undefined;

interface AuthState {
  user: AuthUser;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(AUTH);

  // sources
  private user$ = authState(this.auth);

  // state
  private state: Signal<AuthState>

  // selectors
  user: Signal<AuthUser>

  constructor() {
    const nextState$ = merge(this.user$.pipe(map((user) => ({ user }))));
    const initialState: AuthState = { user: undefined };

    this.state = signalFrom(initialState, nextState$);
    this.user = computed(() => this.state().user);
  }

  login(credentials: Credentials) {
    return from(
      defer(() =>
        signInWithEmailAndPassword(
          this.auth,
          credentials.email,
          credentials.password
        )
      )
    );
  }

  logout() {
    signOut(this.auth);
  }

  createAccount(credentials: Credentials) {
    return from(
      defer(() =>
        createUserWithEmailAndPassword(
          this.auth,
          credentials.email,
          credentials.password
        )
      )
    );
  }
}
