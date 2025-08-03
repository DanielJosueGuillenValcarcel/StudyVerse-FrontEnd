import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, collection, doc, setDoc, query, where, getDocs } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { RegisterUser } from '../../models/register-user.model';

@Component({
  selector: 'app-register-component',
  imports: [FormsModule],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css'
})
export class RegisterComponent {
  user: RegisterUser = {
    name: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    password2: '',
    birthday: new Date()
  }

  message = '';

  passwordStrength = 0;
  passwordStrengthColor = 'red';
  passwordFeedback = '';

  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  async register() {
    // Corroborar que las contraseñas sean identicas
    if (this.user.password != this.user.password2) {
      this.message = "Las contraseñas no coinciden";
      return;
    }

    try {
      // Construye la consulta hacia la firestore
      const userRef = collection(this.firestore, "profile");
      const q = query(userRef, where('username', "==", this.user.username));
      const querySnapshot = await getDocs(q);

      // Comprueba que no exista un nombre de usuario antes de crear
      if (!querySnapshot.empty) {
        this.message = 'El Nombre de Usuario ya existe';
        return;
      }

      const cred = await createUserWithEmailAndPassword(
        this.auth, 
        this.user.email, 
        this.user.password
      );

      await setDoc(doc(this.firestore, 'profile', cred.user.uid), {
        name: this.user.name,
        lastName: this.user.lastName,
        username: this.user.username,
        email: this.user.email,
        birthday: this.user.birthday,
        createdAt: new Date()
      });

      this.message = 'Registro exitoso, ahora puedes iniciar sesión';
      setTimeout(() => this.router.navigateByUrl('/'), 2000);

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
