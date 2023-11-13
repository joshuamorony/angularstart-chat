import { Injectable, computed, inject, signal } from '@angular/core';
import { from, defer, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { authState } from 'rxfire/auth';
import { Credentials } from '../interfaces/credentials';
import { AUTH } from 'src/app/app.config';
import { connect } from 'ngxtension/connect';
import { signalSlice } from 'ngxtension/signal-slice';

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
  private initialState: AuthState = {
    user: undefined,
  };

  private sources$ = merge(this.user$.pipe(map((user) => ({ user }))));

  state = signalSlice({
    initialState: this.initialState,
    sources: [this.sources$],
  });

  login(credentials: Credentials) {
    return defer(() =>
      signInWithEmailAndPassword(
        this.auth,
        credentials.email,
        credentials.password
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
