import { Injectable, Signal, computed, inject } from '@angular/core';
import { EMPTY, Subject, merge, switchMap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/data-access/auth.service';
import { Credentials } from 'src/app/shared/interfaces/credentials';
import { signalFrom } from 'src/app/shared/signal';

export type LoginStatus = 'pending' | 'authenticating' | 'success' | 'error';

interface LoginState {
  status: LoginStatus;
}

@Injectable()
export class LoginService {
  private authService = inject(AuthService);

  // sources
  error$ = new Subject<any>();
  login$ = new Subject<Credentials>();

  userAuthenticated$ = this.login$.pipe(
    switchMap((credentials) =>
      this.authService.login(credentials).pipe(
        catchError((err) => {
          this.error$.next(err);
          return EMPTY;
        })
      )
    )
  );

  // state
  private state: Signal<LoginState>

  // selectors
  status: Signal<LoginStatus>

  constructor() {
    // reducers
    const nextState$ = merge(
      this.userAuthenticated$.pipe(map(() => ({ status: 'success' as const }))),
      this.login$.pipe(map(() => ({ status: 'authenticating' as const }))),
      this.error$.pipe(map(() => ({ status: 'error' as const })))
    );

    const initialState: LoginState = { status: 'pending' };

    this.state = signalFrom(initialState, nextState$);
    this.status = computed(() => this.state().status);
  }
}
