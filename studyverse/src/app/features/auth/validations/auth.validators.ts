import {
  ValidationErrors,
  ValidatorFn,
  AsyncValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { AuthService } from '../services/auth-service';

export class AuthValidators {
  static noEspaces(control: AbstractControl): ValidationErrors | null {
    const v = (control.value ?? '') as string;
    return /\s/.test(v) ? { noSpaces: true } : null;
  }

  static passwordsMatch(password: string, password2: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const pass = group.get(password)?.value;
      const confirm = group.get(password2)?.value;
      return pass == confirm ? null : { passwordsMismatch: true };
    };
  }

  static usernameTaken(auth: AuthService): AsyncValidatorFn {
    return (control: AbstractControl) =>
      auth
        .usernameExist((control.value ?? '').toString())
        .then((exist) => (exist ? { usernameTaken: true } : null));
  }
}
