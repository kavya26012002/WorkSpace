import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { DialogBoxComponent } from 'src/app/common/dialog-box/dialog-box/dialog-box.component';
import { DiaplayHeaderService } from 'src/app/common/services/displayheader.service';
import { SharedSuccessServiceService } from 'src/app/common/services/shared-success-service.service';
import { UserServiceService } from 'src/app/common/services/user-service.service';
import { SidebarComponent } from 'src/app/common/sidebar/sidebar.component';
import { GetUpdateworkItemRequest, GetUpdateWorkItemResponse, GetWorkItemDetailsViewModelRequest, GetWorkItemDetailsViewModelResponse } from 'src/app/models/userLogin';

@Component({
  selector: 'app-view-work-item',
  templateUrl: './view-work-item.component.html',
  styleUrls: ['./view-work-item.component.css']
})
export class ViewWorkItemComponent implements OnInit{
  public gridData: any[] = [
    
  ];

  selectedItemName: string | null = null;
  selectedProject: string | null = null; 

  projects: GetWorkItemDetailsViewModelResponse[] = [];
  constructor(private displayHeader:DiaplayHeaderService,
    private userService: UserServiceService,
    private matDialog: MatDialog,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private successMessageService:SharedSuccessServiceService
    )
  {}
  public columns: any[] = [
    { field: 'firstno', title: '', width: 1 },
    { field: 'title', title: 'Title', width:"300"},
    { field: 'step', title: 'Step', width: 7},
    { field: 'priority', title: 'Priority', width: 7},
    { field: 'estimation', title: 'Estimation', width: 7 },
    { field: 'remaining', title: 'Remaining', width: 7 },
    { field: 'workDone', title: 'workDone', width: 7 },
    { field: 'startDate', title: 'StartDate', width: 7},
    { field: 'endDate', title: 'EndDate', width: 7},
    { field: 'no', title: '', width: 1 }
];
uniqueProjectNames: string[] = [];
showContent: boolean[] = [];
displayedData: any[] = []; 


showWorkLogSuccess:boolean = false;
workLogSuccessMessage: string='';

  ngOnInit(): void {
    this.successMessageService.getSuccessMessage().subscribe((message) => {
      if (message === 'WorkLog Added Successfully') {
        this.showWorkLogSuccess = true;
        this.workLogSuccessMessage = message;
        setTimeout(() => {
          this.showWorkLogSuccess = false;
        }, 3000);
      }
    });
  

    this.displayHeader.selectedItem$.subscribe((itemName) => {
      this.selectedItemName = itemName;
    }); 
    const employeeId = localStorage.getItem('employeeId');
       console.log(employeeId);
      if(employeeId)
      {
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


          this.uniqueProjectNames = this.projects.map(project => project.projectName)
          .filter((value, index, self) => self.indexOf(value) === index);
         
          this.filterData(); 
          this.filterGridData(); 
  
      });
      }
      this.filterData(); 
          this.filterGridData(); 
     
  }
  filterGridData(): void {
    if (this.selectedProject === null) {
      this.gridData = this.projects;
    } else {
      this.gridData = this.projects.filter(project => project.projectName === this.selectedProject);
    }
  }
  
  onClearClick(): void {
    this.selectedProject = null;
    this.filterData();
    this.filterGridData(); 

  }
  
  getProjectItems(projectName: string): any[] {
    return this.projects.filter(project => project.projectName === projectName);
  }

@ViewChild('projectMenuTrigger', { static: false }) projectMenuTrigger!: MatMenuTrigger;

selectProjectValue(ProjectName: string | null): void {
  this.selectedProject = ProjectName === "All" ? null : ProjectName; 
  this.projectMenuTrigger.closeMenu();
  this.filterData();
  this.filterGridData(); 

}
filterData(): void {
  if (this.selectedProject) {
    this.displayedData = this.projects.filter(project => project.projectName === this.selectedProject);
  } else {
    this.displayedData = this.projects;
  }
}

onProjectMenuClosed() {
  if (!this.selectedProject) {
    this.selectedProject = null; 
  }
}

getData(field:any,value:any)
{
  if(field=='title')
  {
    
    return value;

  }
  if(field=='startDate' || field=='endDate')
  {
    return value.split('T')[0];
  }
 
}

toggleContent(index: number) {
  this.showContent[index] = !this.showContent[index];
}

AddWorkLog(title:string)
  {
    this.successMessageService.setServiceRouter('/work-item/view-workItem');


    const projectId = this.getProjectWorkIdFromTitle(title);
    const request: GetUpdateworkItemRequest = {
      ProjectWorkId: projectId
    };
    this.userService.getUpdatedWorkItem(request).subscribe({
    next:  (response: GetUpdateWorkItemResponse) =>
    {
     console.log("response:",response);
      const formattedWorkDoneOn = this.datePipe.transform(response.workDoneOn ?? '', 'MM-dd-yyyy');
      // console.log(formattedWorkDoneOn);
      this.matDialog.open(DialogBoxComponent,
        {
          width:'800px',
          data: { workItemName: title,
            workDoneBy:response.workDoneBy,
            formattedWorkDoneOn: new Date(response.workDoneOn), 
            originalEst:response.originalEst,
            remainingHours: response.remainingHours,
            workDone:response.workDone,
            description:response.description
             }
        }).afterClosed().subscribe((response)=>
        {
          if(response)
          {
            this.ngOnInit();
          }
          console.log(response);
        })
       
      console.warn('API REsponse:', response)
    },
    error: (error:any)=>
    {
      console.warn('API error', error)
    }});

   
  }
  getProjectWorkIdFromTitle(title: string): number {
    const parts = title.split(':');
    if (parts.length > 1) {
      return +parts[0].trim(); 
    }
    return 0; 
  }
  onProjectTitleHover(title:string)
  {
    console.log(title);

  }
  onProjectTitleLeave()
  {

  }
}