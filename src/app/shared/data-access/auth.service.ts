import { Injectable, inject } from '@angular/core';
import { from, defer } from 'rxjs';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { authState } from 'rxfire/auth';
import { Credentials } from '../interfaces/credentials';
import { AUTH } from 'src/app/app.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth = inject(AUTH);

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
