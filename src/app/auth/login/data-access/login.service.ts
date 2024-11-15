import { Injectable, inject, resource } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/shared/data-access/auth.service';
import { Credentials } from 'src/app/shared/interfaces/credentials';

@Injectable()
export class LoginService {
  private authService = inject(AuthService);

  // sources
  login$ = new Subject<Credentials>();
  login = toSignal(this.login$);

  userAuthenticated = resource({
    request: this.login,
    loader: ({ request }) => this.authService.login(request),
  });
}
