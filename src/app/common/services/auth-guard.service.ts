import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { RefreshToken } from 'src/app/models/userLogin';
import { UserServiceService } from './user-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private userservice: UserServiceService,private router: Router) { }
      async canActivate(): Promise<boolean>
      {
        if(this.isLoggedIn())
        {
          return true;
        }
        else {
                      var refershExpiryTime = new Date(localStorage.getItem('refreshTokenExpiryTime') ?? '');
                      const currentTime = new Date();
                      const isValid = await this.IsrefershtokenValid();
                      if (refershExpiryTime > currentTime && isValid) {
                          return true;
                      }
                      else {
                        localStorage.removeItem('tokenKey');
                        localStorage.removeItem('refreshToken');
                        localStorage.removeItem('tokenExpiryTime');
                        localStorage.removeItem('refreshTokenExpiryTime');
                        localStorage.removeItem('employeeId');

                          alert("You've been logged out, Please login!");
                          this.router.navigate(['/login']); // Redirect to login if not logged in
                          return false;
                      }
                  }
                  return true;
      }
      request: RefreshToken =
              {
                  refershToken: ''
              };
      isLoggedIn(): boolean {
                var token = localStorage.getItem('tokenKey');
                var tokenExpiryTime = new Date(localStorage.getItem('tokenExpiryTime') ?? '');
                console.log(localStorage.getItem('tokenExpiryTime') ?? '');
                var refershExpiryTime = new Date(localStorage.getItem('refreshTokenExpiryTime') ?? '');
                const currentTime = new Date();
                console.log("Token Expiery Time", tokenExpiryTime, '\n', "Refersh Expiery Time: ", refershExpiryTime, '\n', "Current Time: ", currentTime);
                if (token == null || tokenExpiryTime < currentTime) {
                  localStorage.removeItem('tokenKey');
                  localStorage.removeItem('refreshToken');
                  localStorage.removeItem('tokenExpiryTime');
                  localStorage.removeItem('refreshTokenExpiryTime');
                  localStorage.removeItem('employeeId');

                    return false;
                }
                return true;
            }
            IsrefershtokenValid(): Promise<boolean> {
                      return new Promise<boolean>((resolve, reject) => {
                          var refreshToken = localStorage.getItem('refreshToken');
                          if (refreshToken != null && refreshToken != '') {
                              this.request.refershToken = refreshToken as string;
                              this.userservice.refreshToken(this.request).subscribe(
                                  (response) => {
                                      if (response.isError == false) {
                                          localStorage.setItem("token", response.responce.token);
                                          localStorage.setItem("refreshToken", response.responce.refreshToken);
                                          localStorage.setItem("tokenExpiryTime", response.responce.tokenExpiryTime);
                                          localStorage.setItem("refreshTokenExpiryTime", response.responce.refreshTokenExpiryTime);
                                          localStorage.setItem("employeeId", response.responce.employeeId);
                                          resolve(true);
                                      } else {
                                          console.log(response.errorMessage);
                                          resolve(false);
                                      }
                                  },
                                  (error) => {
                                      console.log("status: " + error.status + "\nError: " + error.error.errorMessage);
                                      resolve(false);
                                  }
                              );
                          } else {
                              resolve(false);
                          }
                      });
                  }
 
}

