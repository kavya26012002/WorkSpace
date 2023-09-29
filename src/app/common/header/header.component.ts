import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { GetWorkItemDetailsViewModelRequest, GetWorkItemDetailsViewModelResponse } from 'src/app/models/userLogin';
import { TokenHelperServiceService } from '../services/token-helper-service.service';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  employeeName: string = ''; 
  selectedProject: string | null = null; 
  projects: GetWorkItemDetailsViewModelResponse[] = [];


  constructor(private userService: UserServiceService,
    private router: Router,
    private tokenHelperService: TokenHelperServiceService,
    private userservice: UserServiceService)

  {}
  ngOnInit(): void {
    const employeeId = localStorage.getItem('employeeId');
    console.log(employeeId);
    if (employeeId) {
      this.userService.getEmployeeNameById(+employeeId).subscribe((name) => {
        this.employeeName = name; 
      });

      const request: GetWorkItemDetailsViewModelRequest = {
        EmployeeId: +employeeId,
        ProjectName: null 
      };
      this.userService
      .getProjectByEmployeeId(request)
      .subscribe((Response) =>
      {
        console.log('API response', Response);
        this.projects = Response.workItemList;
      }) 
    }
   

  }
 


 
  
  @ViewChild('projectMenuTrigger', { static: false }) projectMenuTrigger!: MatMenuTrigger;
  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();

  selectProjectValue(value: string) {
    this.selectedProject = value;
    this.projectMenuTrigger.closeMenu();
  }

  onProjectMenuClosed() {
    if (!this.selectedProject) {
      this.selectedProject = null; 
    }
  }
toggleSidebar() {
    
  this.toggleSidebarForMe.emit();
}
onMenuItemClick(action: string) {
  if (action === 'LogOut') {
    this.userService.logout();
    this.tokenHelperService.isLogin = false; 
    this.router.navigate(['/login']);
  }
}

}
