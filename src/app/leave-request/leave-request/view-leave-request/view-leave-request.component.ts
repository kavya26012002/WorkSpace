import { DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MatDatepicker,
  MatDatepickerInputEvent,
} from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteserviceService } from 'src/app/common/services/deleteservice.service';
import { DiaplayHeaderService } from 'src/app/common/services/displayheader.service';
import { LeaveRequestService } from 'src/app/common/services/leave-request.service';
import { SharedSuccessServiceService } from 'src/app/common/services/shared-success-service.service';
import {
  DeleteLeaveRequest,
  GetLeaveRequest,
} from 'src/app/models/leaveRequest';

@Component({
  selector: 'app-view-leave-request',
  templateUrl: './view-leave-request.component.html',
  styleUrls: ['./view-leave-request.component.css'],
})
export class ViewLeaveRequestComponent implements OnInit {
  selectedItemName: string | null = null;
  selectedProject: string | null = null;
  leaveRequestStatusOptions: string[] = ['Pending', 'Approved', 'Cancelled'];
  selectedLeaveRequestStatus!: string;
  public dateFrom: any | null = null;
  public dateTo: any | null = null;

  public gridData: any[] = [];
  public pageSizeOptions: number[] = [1, 3, 10];
  public totalRecords: number = 0;
  public pageSize: number = 1;
  public pageNumber: number = 1;
  public sortColumn: string | null = 'LeaveStartDate';
  public sortOrder: boolean = true;
  public Columns: any[] = [
    { field: 'rowNo', title: '#', width: '1' },
    {
      field: 'leaveStartDate',
      title: 'StartDate',
      width: '100',
      sortable: true,
      sortColumn: 'LeaveStartDate',
    },
    {
      field: 'leaveEndDate',
      title: 'EndDate',
      width: '10',
      sortable: true,
      sortColumn: 'LeaveEndDate',
    },
    {
      field: 'duration',
      title: 'Duration',
      width: '10',
      sortable: true,
      sortColumn: 'Duration',
    },
    {
      field: 'returnDate',
      title: 'Return Date',
      width: '10',
      sortable: true,
      sortColumn: 'ReturnDate',
    },
    {
      field: 'availibiltyOnPhone',
      title: 'Avail On Phone',
      width: '150',
      sortable: true,
      sortColumn: 'AvailibilityOnPhone',
    },
    {
      field: 'availibiltyInCity',
      title: 'Avail in Ahmedabad',
      width: '150',
      sortable: true,
      sortColumn: 'AvailibiltyInCity',
    },
    {
      field: 'leaveRequestStatus',
      title: 'Leave Status',
      width: '150',
      sortable: true,
      sortColumn: 'LeaveRequestStatus',
    },
    {
      field: 'approvedDate',
      title: 'Approved Date',
      width: '150',
      sortable: true,
      sortColumn: 'ApprovedDate',
    },
    { field: 'action', title: 'Actions', width: '1' },
  ];
  constructor(
    private displayHeader: DiaplayHeaderService,
    private leaverequestservice: LeaveRequestService,
    private matDialog: MatDialog,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router,
    private deleteService: DeleteserviceService,
    private successMessageService:SharedSuccessServiceService

  ) {}
  @Output() menuItemClicked = new EventEmitter<string>();

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
    }
  }
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex + 1;

    this.loadData();
  }

  onPageSizeChange(event: MatSelectChange): void {
    this.pageSize = event.value;
    this.pageNumber = 1;
    this.loadData();
  }
  onSearchClicked() {
    console.log('serach clockes');

    console.log('Date From:', this.dateFrom);
    console.log('Date To:', this.dateTo);
    this.loadData();
  }
  onDateFromChanged(event: MatDatepickerInputEvent<Date>): void {
    this.dateFrom = event.value;
  }

  onDateToChanged(event: MatDatepickerInputEvent<Date>): void {
    this.dateTo = event.value;
  }

  loadData(): void {
    const formattedWorkDoneOn = this.datePipe.transform(
      this.dateFrom ?? '',
      'MM-dd-yyyy'
    );
    const formattedWorkDoneTo = this.datePipe.transform(
      this.dateTo ?? '',
      'MM-dd-yyyy'
    );
    const employeeId = localStorage.getItem('employeeId');
    if (employeeId) {
      const request: GetLeaveRequest = {
        EmployeeId: +employeeId,
        LeaveStartDate: formattedWorkDoneOn,
        LeaveEndDate: formattedWorkDoneTo,
        LeaveRequestStatus: this.selectedLeaveRequestStatus || 'Pending',
        PageNumber: this.pageNumber,
        PageSize: this.pageSize,
        SortColumn: this.sortColumn,
        SortOrder: this.sortOrder,
      };

      this.leaverequestservice.getLeaveRequest(request).subscribe({
        next: (response: any) => {
          console.log(response);
          this.gridData = [];
          this.gridData.push(...response.leaveRequestList);
          console.warn(response.leaveRequestList);
  
          this.totalRecords = response.leaveRequestList[0].totalRecords || 0;

        },
        error: (error: any) => {
          this.gridData = [];
          this.totalRecords = 0;
        },
      });
    }
  }
  showLeaveRequestSuccess: boolean = false;
  leaveRequestSuccessMessage: string = '';

  ngOnInit(): void {

    this.successMessageService.getSuccessMessage().subscribe((message)=>
    {
      if(message === 'Leave Request Successfully Added')
      {
        this.showLeaveRequestSuccess = true;
        this.leaveRequestSuccessMessage = 'Leave Request Added Successfully!..';
        setTimeout(() => {
          this.showLeaveRequestSuccess = false;
        }, 3000);
      }
      if(message === 'Upadted Leave Request Succesfully')
      {
        this.showLeaveRequestSuccess = true;
        this.leaveRequestSuccessMessage = 'Leave Request Updated Successfullt!..';
        setTimeout(() => {
          this.showLeaveRequestSuccess = false;
        }, 3000);
      }
    })
   
    

    this.loadData();
  }

  @ViewChild('projectMenuTrigger', { static: false })
  projectMenuTrigger!: MatMenuTrigger;

  selectLeaveRequestStatusValue(status: string) {
    this.selectedLeaveRequestStatus = status;

    this.projectMenuTrigger.closeMenu();
  }
 

  resetFilters(): void {
    this.dateFrom = null;
    this.dateTo = null;
    this.selectedLeaveRequestStatus = 'Pending';
    if (this.dateFrom) {
      this.dateFrom.select(null);
    }
    if (this.dateTo) {
      this.dateTo.select(null);
    }
  }

  onClearClicked() {
    this.resetFilters();
    this.onSearchClicked();
  }

  onProjectMenuClosed() {
    if (!this.selectedProject) {
      this.selectedProject = null;
    }
  }
  onMenuItemClick(itemName: string) {
    this.menuItemClicked.emit(itemName);
    this.displayHeader.setSelectedItem(itemName);
  }
  DeleteLeaveRequest(leaveRequestId: string) {
    this.deleteService
      .openConfirmDialogue('Are you sure to cancel leave request?')
      .afterClosed()
      .subscribe((result: boolean) => {
        console.log(result);
        if (result == true) {
          const employeeId = localStorage.getItem('employeeId');
          if (employeeId) {
            const request: DeleteLeaveRequest = {
              EmployeeId: +employeeId,
              LeaveRequestId: leaveRequestId,
            };
            this.leaverequestservice.DeleteLeaveRequest(request).subscribe({
              next: (response: any) => {

                const responseMessage= response;
                this.successMessageService.setSuccessMessage(responseMessage);
                this.successMessageService.getSuccessMessage().subscribe((message)=>
                {
                  if(message === 'Leave Request Deleted Successfully')
                  {this.showLeaveRequestSuccess = true;
                    this.leaveRequestSuccessMessage = 'Leave Request Deleted Successfully!..';
                    setTimeout(() => {
                      this.showLeaveRequestSuccess = false;

                    }, 3000);

                    this.loadData();
                  }
                })
              
                console.log(response);
              },
            });
          }
        }
      });
    console.log(leaveRequestId);
  }
  UpdateLeaveRequest(leaveRequestId:string,leaveRequestStatus:any)
  {
    console.log(leaveRequestStatus);
    this.router.navigate(['/leave-request/edit-leaveRequest'],
    {queryParams:
    {
      LeaveRequestId:leaveRequestId,
      LeaveRequestStatus:leaveRequestStatus
    }});
  }
}
