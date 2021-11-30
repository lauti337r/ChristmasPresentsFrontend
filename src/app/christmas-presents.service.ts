import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Kid} from './kid/kid';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {PresentGiver} from './kid-details/present-giver';
import {Router} from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*'
  })
};

@Injectable({
  providedIn: 'root'
})

export class ChristmasPresentsService {
  apiUrl: string;
  authHeader: string = '';
  constructor(private http: HttpClient, private router: Router) {
    this.apiUrl = 'https://localhost:44357/';
  }

  saveHeader(header: string) {
    localStorage.setItem('authHeader', header);
  }

  isAuthenticated(): boolean {
    let header = localStorage.getItem('authHeader');

    if (header) {
      let lastRequest = localStorage.getItem('lastRequestDateTime');
      if(lastRequest) {
        let lastRequestDate = new Date(Date.parse(lastRequest));
        if (lastRequestDate) {
          let nowDate = new Date(Date.now());
          nowDate = new Date(nowDate.setHours(nowDate.getHours() - 2));
          console.log(nowDate);
          if (lastRequestDate > nowDate) {
            return true;
          }
        }
      }
    }
    return false;
  }

  getKidsList(): Observable<Kid[]> {
    const url = `${this.apiUrl}api/Kids`;
    return this.http.get<Kid[]>(url);
  }

  adminLogin(authHeader: string) {
    const url = `${this.apiUrl}api/Main/Authenticate`;
    return this.http.get<boolean>(url, { headers: new HttpHeaders({'Authorization': authHeader})}).subscribe((response: boolean) => {
      if (response) {
        this.authHeader = authHeader;
        localStorage.setItem('authHeader', authHeader);
        localStorage.setItem('lastRequestDateTime', (new Date()).toISOString());
        return true;
      }
      return false;
    }, (error) => {return false;});
  }

  submitGiver(kidId: number, giver: PresentGiver) {
    const url = `${this.apiUrl}api/PresentGivers/${kidId}`;
    return this.http.post(url, giver);
  }

  updateKid(kid: Kid): any {
    if (this.isAuthenticated()) {
      let authHeader = localStorage.getItem('authHeader') || '';
      let headers = { headers: new HttpHeaders({'Authorization': authHeader})};
      console.log(headers);
      console.log(this.authHeader);

      const url = `${this.apiUrl}api/Kids/${kid.kidId}`;
      return this.http.put(url, kid, headers);
    } else {
      this.router.navigate(['/admin/login']);
    }
  }
}
