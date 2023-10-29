import { Injectable, computed, inject, signal } from '@angular/core';
import { connect } from 'ngxtension/connect';
import { EMPTY, Subject, catchError, map, merge, switchMap } from 'rxjs';
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

  // sources
  error$ = new Subject<any>();
  createUser$ = new Subject<Credentials>();

  userCreated$ = this.createUser$.pipe(
    switchMap((credentials) =>
      this.authService.createAccount(credentials).pipe(
        catchError((err) => {
          this.error$.next(err);
          return EMPTY;
        })
      )
    )
  );

  // state
  private state = signal<RegisterState>({
    status: 'pending',
    error: null,
  });

  // selectors
  status = computed(() => this.state().status);

  constructor() {
    // reducers
    const nextState$ = merge(
      this.userCreated$.pipe(map(() => ({ status: 'success' as const }))),
      this.createUser$.pipe(map(() => ({ status: 'creating' as const }))),
      this.error$.pipe(map(() => ({ status: 'error' as const })))
    );

    connect(this.state).with(nextState$);
  }
}
