import { Injectable, computed, inject, signal } from '@angular/core';
import { from, defer, Subject, tap } from 'rxjs';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { authState } from 'rxfire/auth';
import { Credentials } from '../interfaces/credentials';
import { AUTH } from 'src/app/app.config';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface AuthState {
  user: User | null;
  checkedInitAuth: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(AUTH);

  // sources
  private user$ = authState(this.auth);

  // state
  private state = signal<AuthState>({
    user: null,
    checkedInitAuth: false,
  });

  // selectors
  user = computed(() => this.state().user);
  checkedInitAuth = computed(() => this.state().checkedInitAuth);

  constructor() {
    this.user$.pipe(takeUntilDestroyed()).subscribe((user) =>
      this.state.update((state) => ({
        ...state,
        user,
        checkedInitAuth: true,
      }))
    );
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
