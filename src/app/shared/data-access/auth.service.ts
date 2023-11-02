import { Injectable, inject } from '@angular/core';
import { from, defer } from 'rxjs';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { authState } from 'rxfire/auth';
import { Credentials } from '../interfaces/credentials';
import { AUTH } from 'src/app/app.config';
import {rxState} from "@rx-angular/state";

export type AuthUser = User | null | undefined;

interface AuthState {
  user: AuthUser;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  private auth = inject(AUTH);

  private state = rxState<AuthState>(({set, connect}) => {
    set({user: null});
    connect('user', authState(this.auth));
  });

  user = this.state.signal('user');

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
