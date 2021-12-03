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

  getKidsList(showHidden: boolean): Observable<Kid[]> {
    const url = `${this.apiUrl}api/Kids?showHidden=${showHidden.toString()}`;
    return this.http.get<Kid[]>(url);
  }

  getPresentGiversList(): any {
    if (this.isAuthenticated()) {
      let authHeader = localStorage.getItem('authHeader') || '';
      let headers = { headers: new HttpHeaders({'Authorization': authHeader})};
      console.log(headers);
      console.log(this.authHeader);

      const url = `${this.apiUrl}api/PresentGivers`;
      return this.http.get<PresentGiver[]>(url);
    } else {
      this.router.navigate(['/admin/login']);
    }
  }

  adminLogin(authHeader: string):Promise<boolean> {
    return new Promise<boolean>((resolve,reject) => {
      const url = `${this.apiUrl}api/Main/Authenticate`;
      return this.http.get<boolean>(url, { headers: new HttpHeaders({'Authorization': authHeader})}).subscribe((response: boolean) => {
        if (response) {
          this.authHeader = authHeader;
          localStorage.setItem('authHeader', authHeader);
          localStorage.setItem('lastRequestDateTime', (new Date()).toISOString());
          resolve(true);
        } else {
          resolve(false);
        }
      }, (error) => {
        resolve(false);
      });
    });
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

  hideKid(kidId: number): any {
    if (this.isAuthenticated()) {
      let authHeader = localStorage.getItem('authHeader') || '';
      let headers = { headers: new HttpHeaders({'Authorization': authHeader})};
      console.log(headers);
      console.log(this.authHeader);

      const url = `${this.apiUrl}api/Kids/Hide/${kidId}`;
      return this.http.put(url, null, headers);
    } else {
      this.router.navigate(['/admin/login']);
    }
  }

  unhideKid(kidId: number): any {
    if (this.isAuthenticated()) {
      let authHeader = localStorage.getItem('authHeader') || '';
      let headers = { headers: new HttpHeaders({'Authorization': authHeader})};
      console.log(headers);
      console.log(this.authHeader);

      const url = `${this.apiUrl}api/Kids/Unhide/${kidId}`;
      return this.http.put(url, null, headers);
    } else {
      this.router.navigate(['/admin/login']);
    }
  }

  addKid(kid: Kid): any {
    if (this.isAuthenticated()) {
      let authHeader = localStorage.getItem('authHeader') || '';
      let headers = { headers: new HttpHeaders({'Authorization': authHeader})};
      console.log(headers);
      console.log(this.authHeader);

      const url = `${this.apiUrl}api/Kids`;
      return this.http.post(url, kid, headers);
    } else {
      this.router.navigate(['/admin/login']);
    }
  }

  setPayment(presentGiverId: number): any {
    if (this.isAuthenticated()) {
      let authHeader = localStorage.getItem('authHeader') || '';
      let headers = { headers: new HttpHeaders({'Authorization': authHeader})};
      console.log(headers);
      console.log(this.authHeader);

      const url = `${this.apiUrl}api/PresentGivers/setPayment/${presentGiverId}`;
      return this.http.put(url,null, headers);
    } else {
      this.router.navigate(['/admin/login']);
    }
  }

  unsetPayment(presentGiverId: number): any {
    if (this.isAuthenticated()) {
      let authHeader = localStorage.getItem('authHeader') || '';
      let headers = { headers: new HttpHeaders({'Authorization': authHeader})};
      console.log(headers);
      console.log(this.authHeader);

      const url = `${this.apiUrl}api/PresentGivers/unsetPayment/${presentGiverId}`;
      return this.http.put(url, null, headers);
    } else {
      this.router.navigate(['/admin/login']);
    }
  }
}
