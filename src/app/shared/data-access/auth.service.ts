import { Injectable, computed, inject, signal } from '@angular/core';
import { from, defer } from 'rxjs';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { authState } from 'rxfire/auth';
import { Credentials } from '../interfaces/credentials';
import { AUTH } from 'src/app/app.config';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface AuthState {
  user: User | null;
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
  });

  // selectors
  user = computed(() => this.state().user);

  constructor() {
    this.user$
      .pipe(takeUntilDestroyed())
      .subscribe((user) => this.state.update((state) => ({ ...state, user })));
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
