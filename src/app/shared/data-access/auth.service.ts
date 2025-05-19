import { Injectable, inject } from '@angular/core';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { authState } from 'rxfire/auth';
import { Credentials } from '../interfaces/credentials';
import { AUTH } from '../../app.config';
import { toSignal } from '@angular/core/rxjs-interop';

export type AuthUser = User | null | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(AUTH);

  // sources
  private authState$ = authState(this.auth);

  // state
  user = toSignal(this.authState$);

  async login(credentials: Credentials | undefined) {
    if (!credentials) return null;

    return signInWithEmailAndPassword(
      this.auth,
      credentials.email,
      credentials.password,
    );
  }

  logout() {
    signOut(this.auth);
  }

  async createAccount(credentials: Credentials | undefined) {
    if (!credentials) return null;

    return createUserWithEmailAndPassword(
      this.auth,
      credentials.email,
      credentials.password,
    );
  }
}
