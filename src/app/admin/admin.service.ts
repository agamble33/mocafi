import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user';

const URL_PATH = 'https://gorest.co.in/public/v2/users';
const AuthToken =
  'fb0091dba207f9a27d070e7aa47ee511ca458027afcb0f31660fa57e9b8d00f9';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  public getUsers(page = 1, perPage = 10) {
    return this.http.get<User[]>(
      `${URL_PATH}?page=${page}&per_page=${perPage}`,
      {
        headers: {
          Authorization: `Bearer ${AuthToken}`,
        },
      }
    );
  }

  public getUserById(id: string) {
    return this.http.get(`${URL_PATH}/${id}`);
  }

  public createUser(user: Omit<User, 'id'>) {
    return this.http.post(
      `${URL_PATH}`,
      {
        ...user,
      },
      {
        headers: {
          Authorization: `Bearer ${AuthToken}`,
        },
      }
    );
  }

  public updateUser(user: User) {
    return this.http.put(
      `${URL_PATH}/${user.id}`,
      {
        ...user,
      },
      {
        headers: {
          Authorization: `Bearer ${AuthToken}`,
        },
      }
    );
  }

  public deleteUser(id: number) {
    return this.http.delete(`${URL_PATH}/${id}`, {
      headers: {
        Authorization: `Bearer ${AuthToken}`,
      },
    });
  }
}
