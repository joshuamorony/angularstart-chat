import { Injectable, inject } from '@angular/core';
import { signalSlice } from 'ngxtension/signal-slice';
import {
  EMPTY,
  Observable,
  Subject,
  catchError,
  map,
  merge,
  startWith,
  switchMap,
} from 'rxjs';
import { AuthService } from 'src/app/shared/data-access/auth.service';
import { Credentials } from 'src/app/shared/interfaces/credentials';

export type RegisterStatus = 'pending' | 'creating' | 'success' | 'error';

interface RegisterState {
  status: RegisterStatus;
  error: string | null;
}

@Injectable()
export class RegisterService {
  private authService = inject(AuthService);

  private initialState: RegisterState = {
    status: 'pending',
    error: null,
  };

  // sources
  private error$ = new Subject<any>();
  private sources$ = merge(
    this.error$.pipe(map(() => ({ status: 'error' as const })))
  );

  // state
  state = signalSlice({
    initialState: this.initialState,
    sources: [this.sources$],
    actionSources: {
      createUser: (_state, $: Observable<Credentials>) =>
        $.pipe(
          switchMap((credentials) =>
            this.authService.createAccount(credentials).pipe(
              map(() => ({ status: 'success' as const })),
              catchError((err) => {
                this.error$.next(err);
                return EMPTY;
              }),
              startWith({ status: 'creating' as const })
            )
          )
        ),
    },
  });
}
