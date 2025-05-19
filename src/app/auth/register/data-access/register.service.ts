import { Injectable, inject, resource } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { AuthService } from '../../../shared/data-access/auth.service';
import { Credentials } from '../../../shared/interfaces/credentials';

@Injectable()
export class RegisterService {
  private authService = inject(AuthService);

  // sources
  createUser$ = new Subject<Credentials>();
  createUser = toSignal(this.createUser$);

  createdUser = resource({
    params: this.createUser,
    loader: ({ params }) => this.authService.createAccount(params),
  });
}
