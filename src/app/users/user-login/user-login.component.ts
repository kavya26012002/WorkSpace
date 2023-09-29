import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { HeaderComponent } from 'src/app/common/header/header.component';
import { TokenHelperServiceService } from 'src/app/common/services/token-helper-service.service';
import { UserServiceService } from 'src/app/common/services/user-service.service';
import { UserLogin } from 'src/app/models/userLogin';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent {
@ViewChild(AppComponent) haederefresh!:AppComponent
@ViewChild(HeaderComponent) headerComponent!: HeaderComponent;

  isTokenPresent: boolean = false;


  
  userLoginForm: FormGroup = new FormGroup({});
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private userservice: UserServiceService,
    public tokenHelperService: TokenHelperServiceService
    ){}

  images: string[] =[
    '/assets/login-img1.jpg',
    '/assets/login-img2.jpg',
    '/assets/login-img3.jpg'
    
  ];
  currentImageIndex: number = 0;
  get currentImage(): string {

    return this.images[this.currentImageIndex];
  }
  ngOnInit(): void {

    this.userLoginForm = this.formBuilder.group({
      'username' : new FormControl(
        '',[Validators.required]),
        'password': new FormControl(
          '',[Validators.required]
        )
    })
    
  }
  loginUser() {
    if (this.userLoginForm.invalid) {
      return;
      
      
    }
    const user: UserLogin = {
      userName: this.userLoginForm.value.username,
      password: this.userLoginForm.value.password,
    };
    const tokenKey = this.userservice.getTokenKey();

    this.userservice.login(user).subscribe(
      (response) => {
         console.log(response);
        
        if (!response.isError) {
          const snackBarConfig: MatSnackBarConfig = {
            duration: 3000,
            verticalPosition: 'top', // Set the snackbar position to top
          };
          this._snackBar.open('User Logged In Successfully', 'Close', snackBarConfig);
          this.tokenHelperService.isLogin = true;
          localStorage.setItem(this.userservice.getTokenKey(), response.responce.token);
          localStorage.setItem('refreshToken', response.responce.refreshToken);
          localStorage.setItem('tokenExpiryTime',response.responce.tokenExpiryTime);
          localStorage.setItem('refreshTokenExpiryTime',response.responce.refreshTokenExpiryTime);
          localStorage.setItem('employeeId',response.responce.employeeId);
         
          localStorage.setItem(tokenKey, response.responce.token);
          // this.userservice.getEmployeeNameById(response.responce.employeeId).subscribe((name)=>
          // {
          //   localStorage.setItem('employeeName', name); // Store the employee name in localStorage
          // });
         
          this.router.navigate(['/work-item/view-workItem']);

          // console.log('Access Token:', localStorage.getItem(tokenKey));


        }
        else{
          const snackBarConfig: MatSnackBarConfig = {
            duration: 3000,
            verticalPosition: 'top', // Set the snackbar position to top
          };
          this._snackBar.open('Invalid username or password', 'Close', snackBarConfig);
        }
        
      },
      (error) => {
        // Handle error if necessary
        const snackBarConfig: MatSnackBarConfig = {
          duration: 3000,
          verticalPosition: 'top', // Set the snackbar position to top
        };
        this._snackBar.open('An error occurred. Please try again later.', 'Close', snackBarConfig);
      }
    );
  }
  
  // loginUser(){
  //   if(this.userLoginForm.value.username === 'Kavya.Deliwala' &&
  //      this.userLoginForm.value.password === 'Kavya@12')
  //   {
  //     const snackBarConfig: MatSnackBarConfig = {
  //       duration: 3000,
  //       verticalPosition: 'top', // Set the snackbar position to top
  //     };
   
    
  //   this._snackBar.open('User Logged In Successfully', 'Close', snackBarConfig);
    
  //   this.router.navigate(['/work-item/view-item']);
  // }
  // else{
  //   const snackBarConfig: MatSnackBarConfig = {
  //     duration: 3000,
  //     verticalPosition: 'top', // Set the snackbar position to top
  //   };
  //   this._snackBar.open('Invalid username or password', 'Close', snackBarConfig);
  // }
  // }
  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  }

  prevImage() {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
  }
 
  isTokenGenerated(): boolean {
    // Check if the token exists in localStorage
    return localStorage.getItem('access_token') !== null;
   

  }
}
