import { Injectable, inject } from '@angular/core';
import { EMPTY, Observable, Subject, merge, switchMap } from 'rxjs';
import { catchError, map, startWith, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/data-access/auth.service';
import { Credentials } from 'src/app/shared/interfaces/credentials';
import { signalSlice } from 'ngxtension/signal-slice';

export type LoginStatus = 'pending' | 'authenticating' | 'success' | 'error';

interface LoginState {
  status: LoginStatus;
}

@Injectable()
export class LoginService {
  private authService = inject(AuthService);

  private initialState: LoginState = {
    status: 'pending',
  };

  // sources
  private error$ = new Subject<void>();

  private sources$ = merge(
    this.error$.pipe(map(() => ({ status: 'error' as const })))
  );

  // state
  state = signalSlice({
    initialState: this.initialState,
    sources: [this.sources$],
    asyncReducers: {
      login: (_state, $: Observable<Credentials>) =>
        $.pipe(
          switchMap((credentials) =>
            this.authService.login(credentials).pipe(
              map(() => ({ status: 'success' as const })),
              catchError(() => {
                this.error$.next();
                return EMPTY;
              }),
              startWith({ status: 'authenticating' as const })
            )
          )
        ),
    },
  });
}
