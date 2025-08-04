import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterUserModel } from '../../models/register-user.model';
import { getEmptyRegisterUser } from '../../models/register-user.model';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-register-component',
  imports: [FormsModule],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css'
})
export class RegisterComponent {
  user: RegisterUserModel = getEmptyRegisterUser();

  message = '';

  passwordStrength = 0;
  passwordStrengthColor = 'red';
  passwordFeedback = '';

  private router = inject(Router);
  private authService = inject(AuthService);

  async register() {
    if (this.user.password != this.user.password2) {
      this.message = "Las contraseñas no coinciden";
      return;
    }

    const usernameExist : boolean = await this.authService.usernameExist(this.user.username);

    if (usernameExist) {
      this.message = "El Nombre de Usuario ya existe";
      return;
    }

    try {
      const cred = await this.authService.registerUser(this.user);

      await this.authService.saveUserProfile(cred.user.uid, {
        name: this.user.name,
        lastName: this.user.lastName,
        username: this.user.username,
        email: this.user.email,
        birthday: this.user.birthday,
        createdAt: new Date()
      })

      this.message = 'Registro exitoso ✅';
      this.router.navigateByUrl('/');

    } catch (error: any) {
      this.message = "Error en el registro: " + error.message;
    }
    
  }

  checkPasswordStrength() {
    const pwd = this.user.password || '';
    const hasMinLength = pwd.length >= 8;
    const hasUppercase = /[A-Z]/.test(pwd);

    const score = (hasMinLength ? 50 : 0) + (hasUppercase ? 50 : 0);
    this.passwordStrength = score;
    
    if (score < 50) {
      this.passwordStrengthColor = 'red';
    } else if (score < 100) {
      this.passwordStrengthColor = 'orange';
    } else {
      this.passwordStrengthColor = 'green';
    }

    const faltantes: string[] = [];
    if (!hasMinLength)  faltantes.push('al menos 8 caracteres');
    if (!hasUppercase)  faltantes.push('una letra mayúscula');
    
    if (faltantes.length) {
      this.passwordFeedback = 
        'La contraseña debe tener ' + faltantes.join(' y ') + '.';
    } else {
      this.passwordFeedback = 'Contraseña fuerte ✅';
    }
  }
}
