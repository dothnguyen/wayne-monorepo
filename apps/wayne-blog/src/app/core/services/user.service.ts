import { Injectable } from '@angular/core';
import { UserProfile } from '../models/user-profile';
import { HttpClient } from '@angular/common/http';
import { BASE_API_URL } from '../../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { ServiceResult, ResultCode } from '../models/serviceresult';
import { map, tap, shareReplay } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class UserService {
  USER_ENPOINT = `${BASE_API_URL}/users`;

  constructor(private http: HttpClient) {}

  currentProfile$ = new BehaviorSubject<UserProfile>(null);

  getUser(id: string): Observable<UserProfile> {
    return this.http.get<ServiceResult>(`${this.USER_ENPOINT}/${id}`).pipe(
      map((result) => {
        if (result.code === ResultCode.OK)
          return result.result;
        return null;
      }),
      tap(user => {
        this.currentProfile$.next(user);
      }),
      shareReplay()
    );
  }

  updateUser(id: string, profile: UserProfile) {
    if (!id) {
      // new profile
      return this.http.post<boolean>(`${this.USER_ENPOINT}`, profile);
    } else {
      // update existing profile
      return this.http.put<boolean>(`${this.USER_ENPOINT}/${id}`, profile);
    }
  }
  
}
