import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenHelperServiceService {
  isLogin: boolean = false;
  helper = new JwtHelperService();
  isValidTokenExist(tokenKey: any): boolean {
    try {
      this.helper.decodeToken(tokenKey)
      // console.log(tokenKey);
      return true;
    } catch (error) {
      return false;
    }
  }


  constructor() { }
}
