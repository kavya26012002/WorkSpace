import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogBoxComponent } from 'src/app/common/dialog-box/dialog-box/dialog-box.component';
import { DeleteserviceService } from 'src/app/common/services/deleteservice.service';
import { DialogService } from 'src/app/common/services/dialogservice';
import { DiaplayHeaderService } from 'src/app/common/services/displayheader.service';
import { ProductBacklogWorkItemService } from 'src/app/common/services/product-backlog-work-item.service';
import { SharedSuccessServiceService } from 'src/app/common/services/shared-success-service.service';
import { UserServiceService } from 'src/app/common/services/user-service.service';
import { WorkFlow, WorkItemProjectStatus } from 'src/app/models/enum';
import {
  AddWorkItemCommentRequest,
  DeleteWorkItemAttachmentRequest,
  DeleteWorkItemComments,
  DeleteWorkLogHistory,
  GetHistoryTable,
  GetupdateworkItemRequest,
  GetWorkItemAttachmentRequest,
  GetWorkItemCommentRequest,
  ProductBacklogViewModelRequest,
  ProjectStatusState,
  WorkItemCommentResponse,
} from 'src/app/models/ProductBacklogWorkItem';
import {
  GetUpdateworkItemRequest,
  GetUpdateWorkItemResponse,
} from 'src/app/models/userLogin';

@Component({
  selector: 'app-view-pb-workitem',
  templateUrl: './view-pb-workitem.component.html',
  styleUrls: ['./view-pb-workitem.component.css'],
})
export class ViewPbWorkitemComponent implements OnInit {
  showAdditionalFields = false;
  workLogHistoryId='';

  ProjectStatusState: ProjectStatusState[] = [];
  commentsResponse: WorkItemCommentResponse[] = [];
  isWorkLogHistoryVisible = true;
  isHistoryVisible = true;
  addCommentsForm: FormGroup = new FormGroup({});
  isEndDateValid = true;
  isDetailsVisible = true;
  isDescriptionVisible = true;
  isAttachmentVisible = true;
  isAttachmentDivVisible = false;
  isStateGraphVisible = true;
  isCommentVisible = false;
  iserror: any = '';
  public gridData: any[] = [];
  public gridWorkLogData: any[] = [];
  public gridWorkLogHistroyData :any[]=[];
  public pageSizeOptions: number[] = [1, 3, 10];
  public totalRecords: number = 0;
  public employeeName:string='';
  public pageSize: number = 5;
  public pageNumber: number = 1;
  public sortColumn: string | null = 'CreatedAt';
  public sortOrder: boolean = true;
public workLogTotalRecords:any='';
  selectedItemName: string | null = null;
  public ProjectWorkId: any = '';
  public projectName: any = '';
  public ProjectTitle: string = '';
  public workGroup: string = '';
  public createdDate: any = '';
  public lastModeifiedDtae: any = '';
  public priority: string = '';
  public startDate: any = '';
  public status: any = '';
  public endDate: any = '';
  public assignTo: string = '';
  public originalEst: any = '';
  public reportTo: string = '';
  public remainingEst: any = '';
  public rsi: any = '';
  public workLogged: any = '';
  public workFlow: any = '';
  public description: any = '';
  WorkFlowValue = WorkFlow;
  workFlowValueOptions = [
    { value: WorkFlow.Defect, name: 'Defect' },
    { value: WorkFlow.Task, name: 'Task' },
    { value: WorkFlow.Enhancement, name: 'Enhancement' },
    { value: WorkFlow.Module, name: 'Module' },
    { value: WorkFlow.Request, name: 'Request' },
  ];
  projectStatus = WorkItemProjectStatus;
  projectStatusOptions = [
    { valuue: WorkItemProjectStatus.InProgress, name: 'In-Progress' },
    {
      value: WorkItemProjectStatus.DevCompleted,
      name: 'Dev-Completed',
    },
    {
      value: WorkItemProjectStatus.New,
      name: 'New',
    },
    {
      value: WorkItemProjectStatus.ReadyForTesting,
      name: 'Ready For Testing',
    },
    {
      value: WorkItemProjectStatus.Closed,
      name: 'Closed',
    },
  ];
  public columns: any[] = [
    { field: 'attachment', title: 'Attachment', width: '300' },
    { field: 'description', title: 'Description', width: '300' },
    { field: 'uploadedOn', title: 'Uploaded On', width: '300' },
    { field: 'action', title: 'Action', width: 10 },
  ];
  public workLogColumns: any[] = [
    { field: 'workDate', title: 'Work Date', width: '300' },
    { field: 'workedHours', title: 'Worked Hours', width: '300' },
    { field: 'employee', title: 'Employee', width: '300' },
    {field:'description',title:'Description',width:'300'},
    { field: 'actions', title: 'Action', width: 10 },
  ];
  public workHistoryColumns: any[] = [
    { field: 'field',
     title: 'Field',
      width: '300' ,
       sortable: true,
    sortColumn: 'Field'
  },
    { field: 'employeeName',
     title: 'Changed By',
      width: '300', 
      sortable: true,
    sortColumn: 'EmployeeId'
  },
    { field: 'createdAt',
     title: 'Changed On',
      width: '300' ,
      sortable: true,
    sortColumn: 'CreatedAt'
  },
    {field:'oldValue',
    title:'Old Value',
    width:'300',
    sortable: true,
    sortColumn: 'OldValue'
  },
    { field: 'newValue',
     title: 'New Value',
      width: 300 ,
      sortable: true,
    sortColumn: 'NewValue'
  },
  ];

  showWorkItemRequestSuccess: boolean = false;
  WorkItemSuccessMessage: string = '';
  showWorkItemRequestError: boolean = false;
  WorkItemErrorMessage: string = '';

  constructor(
    private displayHeader: DiaplayHeaderService,
    private datePipe: DatePipe,
    private workitems: ProductBacklogWorkItemService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private successMessageService: SharedSuccessServiceService,
    private deleteService: DeleteserviceService,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private userService: UserServiceService,
    private matDialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.addCommentsForm = this.formBuilder.group({
      Comments: [''],
    });
    this.successMessageService.getSuccessMessage().subscribe((message) => {
      if (message === 'WorkLog Added Successfully') {
        this.showWorkItemRequestSuccess = true;
        this.WorkItemSuccessMessage = message;
        setTimeout(() => {
          this.showWorkItemRequestSuccess = false;
        }, 3000);
      }
    });
    this.successMessageService.getSuccessMessage().subscribe((message) => {
      if (message === 'Workitem Request Updated  Succesfully!..') {
        this.showWorkItemRequestSuccess = true;
        this.WorkItemSuccessMessage = message;
        setTimeout(() => {
          this.showWorkItemRequestSuccess = false;
        }, 3000);
      }
    });

    this.successMessageService.getSuccessMessage().subscribe((message) => {
      if (message === 'Project work item attachment added sucessfully!.') {
        this.showWorkItemRequestSuccess = true;
        this.WorkItemSuccessMessage = message;
        setTimeout(() => {
          this.showWorkItemRequestSuccess = false;
        }, 3000);
     

      }
    });
    this.successMessageService.getSuccessMessage().subscribe((message)=>
    {
      if(message === 'WorkLogHistory Updated  Succesfully!..')
      {
        this.showWorkItemRequestSuccess = true;
        this.WorkItemSuccessMessage = message;
        setTimeout(() => {
          this.showWorkItemRequestSuccess = false;
        }, 3000);
      }
    })
    this.route.queryParams.subscribe((params) => {
      this.ProjectWorkId = params['ProjectWorkId'];
    });
    this.displayHeader.selectedItem$.subscribe((itemName) => {
      this.selectedItemName = itemName;
    });

    this.loadData();
    this.getProjectStatus();
    this.getComments();
    this.workLogHistory();
  }
  sortTable(column: any): void {
    if (column) {
      if (this.sortColumn === column.sortColumn) {
        this.sortOrder = !this.sortOrder;
        console.log(this.sortColumn);
      } else {
        this.sortColumn = column.sortColumn;
        this.sortOrder = true;
      }

      this.loadData();
    this.getProjectStatus();
    this.getComments();
    this.workLogHistory();
    }
  }
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex + 1;

    this.loadData();
    this.getProjectStatus();
    this.getComments();
    this.workLogHistory();
  }

  onPageSizeChange(event: MatSelectChange): void {
    this.pageSize = event.value;
    this.pageNumber = 1;
    this.loadData();
    this.getProjectStatus();
    this.getComments();
    this.workLogHistory();
  }
  workLogHistory()
  {
    const request: GetWorkItemCommentRequest = {
      ProjectWorkId: this.ProjectWorkId,
    };
    this.workitems.GetWorkLogHistory(request).subscribe({
      next:(response:any)=>
      {
        if(!response.isError)
        {
          console.log(response);
          
         
          
          this.gridWorkLogData = [];
          this.gridWorkLogData.push(...response.responce.map((item:any)=>({
            workLogHistoryId:item.workLogHistoryId,
            workDate:item.workDate,
            workedHours:item.workedHours,
            employee:item.employee,
            description:item.description,
            TotalRecords:item.totalRecords
          })))
        }
        else{
          console.log(response.errorMessage);
        }
      },
      error:(error:any)=>
      {
        console.log('Error Fetching in workLogHistory:', error);
this.isWorkLogHistoryVisible = false;
        this.gridWorkLogData = [];
      }
    })
  }
  getComments() {
    const request: GetWorkItemCommentRequest = {
      ProjectWorkId: this.ProjectWorkId,
    };
    this.workitems.GetWorkItemComment(request).subscribe({
      next: (responce: any) => {
        console.log(responce);
        if (!responce.isError) {
          this.commentsResponse = responce.responce;

          console.log('Comments', this.commentsResponse);
        } else {
          console.log(responce.errorMessage);
        }
      },
      error: (error) => {
        console.log('Error Fetching in comments:', error);
      },
    });
  }

  getProjectStatus() {
    const request: GetWorkItemCommentRequest = {
      ProjectWorkId: this.ProjectWorkId,
    };
    // console.log("StateGraphReqyest:",request)
    this.workitems.getProjectStatusState(request).subscribe({
      next: (response: any) => {
        this.ProjectStatusState = response.responce;
        // console.log("ghfcbdsj",this.ProjectStatusState);
      },
      error: (error) => {
        console.log('Error gettinh project State');
      },
    });
  }
  loadData() {
    
    const employeeId = localStorage.getItem('employeeId');
    if (employeeId) {
      const request: ProductBacklogViewModelRequest = {
        ProjectWorkId: this.ProjectWorkId,
        EmployeeId: +employeeId,
      };
      this.workitems.GetWorkItemDetailList(request).subscribe({
        next: (response: any) => {
          this.projectName = response[0].projectName;
          this.ProjectTitle = response[0].projectTitle;
          this.workGroup = response[0].workGroup;
          this.createdDate = this.formatDate(response[0].createdAt);
          this.lastModeifiedDtae = this.formatDate(
            response[0].lastModifiedDate
          );
          this.priority = response[0].priority;
          this.startDate = this.formatDate(response[0].startDate);
          this.endDate = this.formatDate(response[0].endDate);
          this.assignTo = response[0].assignTo;
          this.originalEst = response[0].originalEst;
          this.reportTo = response[0].reportedBy;
          this.remainingEst = response[0].remainingEst;
          this.rsi = response[0].rsi;
          this.workLogged = response[0].workLogged;
          this.status = response[0].status;
          this.workFlow = response[0].workFlow;
          this.description = response[0].description
            ? this.sanitizer.bypassSecurityTrustHtml(response[0].description)
            : null;

          // this.description = response[0].description;
          //  console.log("WorkItemDetails",response);
        },
      });
    }
    const EmployeeId = localStorage.getItem("employeeId");
    if(EmployeeId)
    {
      const history:GetHistoryTable=
      {
       ProjectWorkId: this.ProjectWorkId,
       EmployeeId:+EmployeeId,
       PageNumber: this.pageNumber,
       PageSize: this.pageSize,
       SortColumn: this.sortColumn,
       SortOrder: this.sortOrder,
   
   
      };
      this.workitems.getHistory(history).subscribe({
        next:(response:any)=>
        {
    console.log("HistortTable",response);
    this.gridWorkLogHistroyData =[];
    this.gridWorkLogHistroyData.push(...response.historyRequestList);
    console.warn(response.historyRequestList);
    this.totalRecords = response.historyRequestList[0].totalRecords;
    console.log("recored",this.totalRecords);
        },
        error: (error: any) => {
          this.gridWorkLogHistroyData = [];
          this.totalRecords = 0;
          this.isHistoryVisible = false;
        },
      })
    }
   
    
    const request: GetWorkItemAttachmentRequest = {
      ProjectWorkId: this.ProjectWorkId,
    };
    this.workitems.getAttachment(request).subscribe({
      next: (response: any) => {
        // console.log("AttachmentResponse",response)
        this.iserror = response.isError;

        if (response.isError == false) {
          this.isAttachmentDivVisible = true;
          this.gridData = [];
          this.gridData.push(
            ...response.responce.map((item: any) => ({
              attachment: item.attachment,
              description: item.description,
              uploadedOn: this.formatUploadedOn(item.uploadedOn),
              attachmentPath: item.attachmentPath,
              attachmentId: item.attachmentId,
            }))
          );
        }
      },
      error: (error: any) => {
        this.isAttachmentDivVisible = false;
        this.gridData = [];
      },
    });
  }
  formatUploadedOn(uploadedOn: string): string {
    const date = new Date(uploadedOn);
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${(
      date.getFullYear() + ''
    ).slice(-2)}`;
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedTime = `${hours % 12 || 12}:${
      minutes < 10 ? '0' : ''
    }${minutes} ${ampm}`;
    return `${formattedDate}, ${formattedTime}`;
  }

  OnBackClicked() {
    this.router.navigate(['/work-item/view-workItem']);
  }
  getEnumvalue(value: number): string {
    switch (value) {
      case WorkFlow.Defect:
        return 'Defect';
      case WorkFlow.Task:
        return 'Task';
      case WorkFlow.Enhancement:
        return 'Enhancement';
      case WorkFlow.Module:
        return 'Module';
      case WorkFlow.Request:
        return 'Request';
      default:
        return '';
    }
  }
  getEnumStatus(value: number): string {
    switch (value) {
      case WorkItemProjectStatus.InProgress:
        return 'In-Progress';
      case WorkItemProjectStatus.DevCompleted:
        return 'Dev-Completed';
      case WorkItemProjectStatus.New:
        return 'New';
      case WorkItemProjectStatus.ReadyForTesting:
        return 'Ready For Testing';
      case WorkItemProjectStatus.Closed:
        return 'Closed';
      default:
        return '';
    }
  }
  ToggleComment() {
    this.isCommentVisible = !this.isCommentVisible;
    this.addCommentsForm.reset();
  }
  toggleDetails() {
    this.isDetailsVisible = !this.isDetailsVisible;
  }
  formatDate(inputDate: string): string {
    const dateParts = inputDate.split('-');
    if (dateParts.length === 3) {
      const day = dateParts[0];
      const month = this.getMonthName(dateParts[1]);
      const year = dateParts[2];
      return `${day}-${month}-${year}`;
    } else {
      return inputDate;
    }
  }
  getMonthName(month: string): string {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const monthIndex = parseInt(month) - 1;
    if (monthIndex >= 0 && monthIndex < monthNames.length) {
      return monthNames[monthIndex];
    } else {
      return month;
    }
  }
  toggleDescription() {
    this.isDescriptionVisible = !this.isDescriptionVisible;
  }
  toggleStateGraph() {
    this.isStateGraphVisible = !this.isStateGraphVisible;
  }
  openAttachmentmodal(projectWorkId: any) {
    const addmodal = this.dialogService.openAddAttachmentModal(projectWorkId);
    // console.log("ProjectWorkId",projectWorkId);
  }
  toggleAttachment() {
    this.isAttachmentVisible = !this.isAttachmentVisible;
  }
  deleteAttachment(attachmentId: string) {
    this.deleteService
      .openConfirmDialogue('Are You Sure you want to delete Selected Item?')
      .afterClosed()
      .subscribe((result: boolean) => {
        // console.log(result);
        if (result == true) {
          const request: DeleteWorkItemAttachmentRequest = {
            WorkItemAttachmentId: attachmentId,
          };
          // console.log(request);

          this.workitems.DeleteAttachment(request).subscribe({
            next: (response: any) => {
              // console.log(response);

              const responseMessage = response;
              this.successMessageService.setSuccessMessage(responseMessage);
              this.successMessageService
                .getSuccessMessage()
                .subscribe((message) => {
                  if (message === 'Attachment Deleted Successfully!..') {
                    this.showWorkItemRequestSuccess = true;
                    this.WorkItemSuccessMessage = message;
                    setTimeout(() => {
                      this.showWorkItemRequestSuccess = false;
                    }, 3000);
                    this.loadData();
    this.getProjectStatus();
    this.getComments();
    this.workLogHistory();
                  }
                });
            },
          });
        }
      });
  }
  ManageWorkItem(projectWorkId: any): any {
    // console.log("ManageProjectID",projectWorkId);

    this.router.navigate(['/pbWorkItem/manage-workItem'], {
      queryParams: {
        ProjectWorkId: projectWorkId,
      },
    });
  }
  SaveComment(projectWorkID: number) {
    // console.log("pwe",projectWorkID);
    const formValues = this.addCommentsForm.value;
    const employeeId = localStorage.getItem('employeeId');
    // console.log("EmployeeeID",employeeId);
    // console.log("Commnet",formValues.Comments);
    if (!formValues.Comments || formValues.Comments.trim() === '') {
      this.showWorkItemRequestError = true;
      this.isEndDateValid = false;

      this.WorkItemErrorMessage = 'Please mention your comments!..';
      setTimeout(() => {
        this.isEndDateValid = true;
        this.showWorkItemRequestError = false;
      }, 3000);
    }
    if (!this.isEndDateValid) {
      this.showWorkItemRequestError = true;
      this.WorkItemErrorMessage = 'Please mention comment!..';
      setTimeout(() => {
        this.showWorkItemRequestError = false;
      }, 3000);
      return;
    }
    if (employeeId) {
      const request: AddWorkItemCommentRequest = {
        ProjectWorkID: projectWorkID,
        EmployeeId: +employeeId,
        Comments: formValues.Comments,
      };
      this.workitems.InsertComments(request).subscribe({
        next: (response: any) => {
          const responseMessage = response;
          this.successMessageService.setSuccessMessage(responseMessage);
          this.successMessageService
            .getSuccessMessage()
            .subscribe((message) => {
              if (message === 'Comments Addded Successfully!..') {
                this.showWorkItemRequestSuccess = true;
                this.WorkItemSuccessMessage = message;
                setTimeout(() => {
                  this.showWorkItemRequestSuccess = false;
                }, 3000);
                this.isCommentVisible = !this.isCommentVisible;
                this.loadData();
                this.getProjectStatus();
                this.getComments();
                this.workLogHistory();
              }
            });
        },
      });
    }
  }
  AddWorkLog(projectWorkID: any) {
    this.successMessageService.setServiceRouter(
      '/pbWorkItem/view-WorkItem?ProjectWorkId=' + projectWorkID
    );

    // this.successMessageService.setServiceRouter('/pbWorkItem/view-WorkItem');

    const request: GetUpdateworkItemRequest = {
      ProjectWorkId: projectWorkID,
    };
    this.userService.getUpdatedWorkItem(request).subscribe({
      next: (response: GetUpdateWorkItemResponse) => {
        console.log("response:",response);

        // console.warn("gjk",response.workItemName);
        const formattedWorkDoneOn = this.datePipe.transform(
          response.workDoneOn ?? '',
          'MM-dd-yyyy'
        );

        this.matDialog
          .open(DialogBoxComponent, {
            width: '800px',
            data: {
              workItemName: response.workItemName,
              workDoneBy: response.workDoneBy,
              formattedWorkDoneOn: new Date(response.workDoneOn),
              originalEst: response.originalEst,
              remainingHours: response.remainingHours,
              workDone: response.workDone,
            },
          })
          .afterClosed()
          .subscribe((response) => {
            if (response) {
              this.ngOnInit();
            }
            // console.log(response);
          });

        // console.warn('API REsponse:', response)
      },
      error: (error: any) => {
        console.warn('API error', error);
      },
    });
  }

  DeleteComment(CommentId: any) {
    this.deleteService
      .openConfirmDialogue('Are You Sure you want to delete Selected Item?')
      .afterClosed()
      .subscribe((result: boolean) => {
        // console.log(result);
        if (result == true) {
          const request: DeleteWorkItemComments = {
            CommentId: +CommentId,
          };
          // console.log(request);

          this.workitems.DeleteWorkItemComment(request).subscribe({
            next: (response: any) => {
              // console.log(response);

              const responseMessage = response;
              this.successMessageService.setSuccessMessage(responseMessage);
              this.successMessageService
                .getSuccessMessage()
                .subscribe((message) => {
                  if (message === 'Comments Deleted Successfully!..') {
                    this.showWorkItemRequestSuccess = true;
                    this.WorkItemSuccessMessage = message;
                    setTimeout(() => {
                      this.showWorkItemRequestSuccess = false;
                    }, 3000);
                    this.loadData();
    this.getProjectStatus();
    this.getComments();
    this.workLogHistory();
                  }
                });
            },
          });
        }
      });
  }
  AddWorkLogHistory(projectWorkID:any,workLogHistoryId:any,description:any)
  {
    console.log(workLogHistoryId);
    this.successMessageService.setServiceRouter(
      '/pbWorkItem/view-WorkItem?ProjectWorkId=' + projectWorkID
    );


    const request: GetUpdateworkItemRequest = {
      ProjectWorkId: projectWorkID,
    };
    this.userService.getUpdatedWorkItem(request).subscribe({
      next: (response: GetUpdateWorkItemResponse) => {
        console.log("bfhjdbfvjdnfvbhjdnvjdsnv",response);
        
        // console.warn("gjk",response.workItemName);
        const formattedWorkDoneOn = this.datePipe.transform(
          response.workDoneOn ?? '',
          'MM-dd-yyyy'
        );

        this.matDialog
          .open(DialogBoxComponent, {
            width: '800px',
            data: {
              workItemName: response.workItemName,
              workDoneBy: response.workDoneBy,
              formattedWorkDoneOn: new Date(response.workDoneOn),
              originalEst: response.originalEst,
              remainingHours: response.remainingHours,
              workDone: response.workDone,
              description:description,
              showFields: false,
              workLogHistoryId:workLogHistoryId
            },
          })
          .afterClosed()
          .subscribe((response) => {
            if (response) {
              this.ngOnInit();
            }
          });

      },
      error: (error: any) => {
        console.warn('API error', error);
      },
    });
  }
  DeleteWorkLogHistory(projectWorkId:any,workLogHistoryId:any)
  {
    this.deleteService
    .openConfirmDialogue('Are You Sure you want to delete Selected Item?')
    .afterClosed()
    .subscribe((result: boolean) => {
      // console.log(result);
      if (result == true) {
        const request: DeleteWorkLogHistory = {
          WorkLogHistoryId: +workLogHistoryId,
          ProjectWorkId:+projectWorkId
        };
        // console.log(request);

        this.workitems.DeleteWorkLogEntry(request).subscribe({
          next: (response: any) => {
            // console.log(response);

            const responseMessage = response;
            this.successMessageService.setSuccessMessage(responseMessage);
            this.successMessageService
              .getSuccessMessage()
              .subscribe((message) => {
                if (message === 'WorkLog Deleted Successfully!..') {
                  this.showWorkItemRequestSuccess = true;
                  this.WorkItemSuccessMessage = message;
                  setTimeout(() => {
                    this.showWorkItemRequestSuccess = false;
                  }, 3000);
                  this.loadData();
  this.getProjectStatus();
  this.getComments();
  this.workLogHistory();
                }
              });
          },
        });
      }
    });
  }
  formatTime(decimalValue: number): string {
    const hours = Math.floor(decimalValue);
    const minutes = Math.round((decimalValue - hours) * 60);
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  }

}
