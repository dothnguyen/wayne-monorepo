import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { from, BehaviorSubject } from 'rxjs';
import { first, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser$ = new BehaviorSubject(
    JSON.parse(localStorage.getItem('user'))
  );

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
        this.currentUser$.next(user);
      })
    );
  }

  isLoggedIn() {
    return !!this.currentUser$.value;
  }

  logout() {
    this.fireAuth.signOut();
    localStorage.removeItem('user');
    this.currentUser$.next(null);
  }
}
