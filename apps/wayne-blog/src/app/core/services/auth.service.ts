import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { from } from 'rxjs';
import { first, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private fireAuth: AngularFireAuth) {}

  login(value: { username: string; password: string }) {
    return from(
      this.fireAuth.signInWithEmailAndPassword(value.username, value.password)
    ).pipe(
      first(),
      tap((u) => {
        const user = {
          uid: u.user.uid,
          email: u.user.email,
        };

        localStorage.setItem('user', JSON.stringify(user));
      })
    );
  }

  logout() {
    this.fireAuth.signOut();
    localStorage.removeItem('user');
  }
}
