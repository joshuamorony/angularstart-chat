import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Credentials } from 'src/app/shared/interfaces/credentials';

export type RegisterStatus = 'pending' | 'creating' | 'success' | 'error';

@Injectable()
export class RegisterService {
  // sources
  $createUser = new Subject<Credentials>();
}
