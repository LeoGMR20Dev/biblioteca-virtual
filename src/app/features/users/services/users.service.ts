import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private httpRequest = inject(HttpClient);

  private url: string = 'http://localhost:3000/users';

  getUsers = (): Observable<IUser[]> => this.httpRequest.get<IUser[]>(this.url);

  getUserById = (id: string): Observable<IUser> =>
    this.httpRequest.get<IUser>(`${this.url}/${id}`);

  addUser = (data: IUser): Observable<IUser> =>
    this.httpRequest.post<IUser>(this.url, data);

  updateUser = (id: string, data: IUser): Observable<IUser> =>
    this.httpRequest.put<IUser>(`${this.url}/${id}`, data);

  deleteUser = (id: string): Observable<IUser> =>
    this.httpRequest.delete<IUser>(`${this.url}/${id}`);
}
