import { Injectable, computed, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { Credentials } from 'src/app/shared/interfaces/credentials';

export type RegisterStatus = 'pending' | 'creating' | 'success' | 'error';

interface RegisterState {
  status: RegisterStatus;
}

@Injectable()
export class RegisterService {
  // sources
  $createUser = new Subject<Credentials>();

  // state
  private state = signal<RegisterState>({
    status: 'pending',
  });

  // selectors
  status = computed(() => this.state().status);
}
