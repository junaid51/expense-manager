import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from '@angular/router';
import { User } from 'firebase';

// interface Users extends User {
//   remember?: boolean;
// }

@Injectable({
  providedIn: 'root'
})


export class AuthenticationService {
  user: User;

  constructor(
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    private router: Router
  ) {
    afAuth.authState.subscribe(user => {
      console.log(user);
      if (user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
        this.router.navigate(['home']);
      } else {
        localStorage.setItem('user', null);
        this.router.navigate(['login']);
      }
    }, () => localStorage.setItem('user', null));
  }

  // Sign up with email/password
  async signUp(email: string, password: string): Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        window.alert("You have been successfully registered!");
        console.log(result.user)
      }).catch((error) => {
        window.alert(error.message)
      });
  }

  // Sign in with email/password
  async signIn(email: string, password: string): Promise<any> {
    if (localStorage.getItem('user')) {
      this.user = JSON.parse(localStorage.getItem('user')) as User;
      this.router.navigate(['home']);
      return;
    }
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  async sendPasswordResetEmail(email: string): Promise<any> {
    return this.afAuth.auth.sendPasswordResetEmail(email)
  }

  async logout() {
    return this.afAuth.auth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['login']);
  }

}