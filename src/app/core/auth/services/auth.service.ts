import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { IUser } from '../../../features/users/interfaces/user.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<IUser | null>;
  public currentUser: Observable<IUser | null>;
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<IUser | null>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): IUser | null {
    return this.currentUserSubject.value;
  }

  login(userName: string, password: string): Observable<IUser> {
    return this.http.get<IUser[]>(this.apiUrl).pipe(
      map((users) => {
        const user = users.find(
          (u) => u.userName === userName && u.password === password
        );

        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        }
        throw new Error('Username or password is incorrect');
      })
    );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    window.location.href = '/login';
  }

  isAdmin(): boolean {
    const user = this.currentUserValue;
    return user?.role === 'ADMIN';
  }
}
