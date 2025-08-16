import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, UserCredential, fetchSignInMethodsForEmail } from '@angular/fire/auth';
import { Firestore, doc, where, query, getDocs, setDoc, collection } from '@angular/fire/firestore';
import { RegisterUserModel } from '../models/register-user.model';
import { LoginUserModel } from '../models/login-user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  
  registerUser(user: RegisterUserModel) : Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, user.email, user.password);
  }

  loginUser(user: LoginUserModel) : Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, user.email, user.password); // Devuelve una promesa
  }

  async usernameExist(username: string) : Promise<boolean>{
    const ref = collection(this.firestore, 'profile');
    const q = query(ref, where('username', "==", username));
    const result = await getDocs(q);
    return !result.empty;
  }

  async emailExist(email: string) : Promise<boolean> {
    const newEmail = (email ?? '').trim().toLowerCase();
    if (!newEmail) return false;
    const methods = await fetchSignInMethodsForEmail(this.auth, newEmail);
    return methods.length > 0;
  }
  
  saveUserProfile(uid: string, data: any): Promise<void> {
    return setDoc(doc(this.firestore, 'profile', uid), data);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }
}
