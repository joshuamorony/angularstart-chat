import { Injectable, inject, resource } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/shared/data-access/auth.service';
import { Credentials } from 'src/app/shared/interfaces/credentials';

@Injectable()
export class RegisterService {
  private authService = inject(AuthService);

  // sources
  createUser$ = new Subject<Credentials>();
  createUser = toSignal(this.createUser$);

  createdUser = resource({
    request: this.createUser,
    loader: ({ request }) => this.authService.createAccount(request),
  });
}
