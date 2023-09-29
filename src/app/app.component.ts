import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { map, shareReplay } from 'rxjs';
import { HeaderComponent } from './common/header/header.component';
import { TokenHelperServiceService } from './common/services/token-helper-service.service';
import { UserServiceService } from './common/services/user-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  constructor(private router:Router,
    public tokenHelperService: TokenHelperServiceService,
    private userService: UserServiceService,
)
  {}
  ngOnInit(): void {
    // this.token=localStorage.getItem("tokenKey");
    

  }
  token:any="";


  title = 'wsproject';
  sideBarOpen = true;
  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
  isLogin(): boolean {
    const tokenKey = this.userService.getTokenKey();
    const token = localStorage.getItem(tokenKey);
    return token !== null && this.tokenHelperService.isValidTokenExist(token);
  }
  
}
