import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DialogService } from 'src/app/common/services/dialogservice';
import { DiaplayHeaderService } from 'src/app/common/services/displayheader.service';
import { ServiceRequestService } from 'src/app/common/services/service-request.service';
import { SharedSuccessServiceService } from 'src/app/common/services/shared-success-service.service';
import { UpdateServiceRequestService } from 'src/app/common/services/sharedforsubject';
import { ServiceRequestStatus } from 'src/app/models/enum';
import { GetServiceDetail } from 'src/app/models/serviceRequest';

@Component({
  selector: 'app-view-service-request',
  templateUrl: './view-service-request.component.html',
  styleUrls: ['./view-service-request.component.css'],
})
export class ViewServiceRequestComponent implements OnInit {
  updateSuccessSubscription!: Subscription;

  ticketvalueForm: FormGroup = new FormGroup({});

  constructor(
    private servicerequest: ServiceRequestService,
    private displayHeader: DiaplayHeaderService,
    private matDialog: MatDialog,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dialogService: DialogService,
    private updateServiceRequestService: UpdateServiceRequestService,
    private successMessageService:SharedSuccessServiceService,
    private router: Router
  ) {
    this.ticketvalueForm = this.formBuilder.group({
      ticket: [''],
    });
  }
  selectedItemName: string | null = null;
  ServiceRequestStatus = ServiceRequestStatus;
  defaultOptionValue: ServiceRequestStatus = ServiceRequestStatus.Pending;
  ServiceRequestOptions = [
    { value: ServiceRequestStatus.Pending, name: 'Pending' },
    { value: ServiceRequestStatus.Approved, name: 'Approved' },
    { value: ServiceRequestStatus.Closed, name: 'Closed' },
    { value: ServiceRequestStatus.Rejected, name: 'Rejected' },
    { value: ServiceRequestStatus.Hold, name: 'Hold' },
    { value: ServiceRequestStatus.Acknowledged, name: 'Acknowledged' },
    { value: ServiceRequestStatus.Cancel, name: 'Cancel' },
    { value: ServiceRequestStatus.Reopen, name: 'Reopen' },
    { value: ServiceRequestStatus.WorkStarted, name: 'WorkStarted' },
  ];

  public gridData: any[] = [];
  public pageSizeOptions: number[] = [1, 3, 10];
  public totalRecords: number = 0;
  public pageSize: number = 1;
  public pageNumber: number = 1;
  public sortColumn: string | null = 'Ticket';
  public sortOrder: boolean = true;
  ticketNumber: any | null = null;
  public Columns: any[] = [
    {
      field: 'ticket',
      title: 'Ticket #',
      width: '250',
      sortable: true,
      sortColumn: 'Ticket',
    },
    {
      field: 'requestDate',
      title: 'Request Date',
      width: '250',
      sortable: true,
      sortColumn: 'RequestDate',
    },
    {
      field: 'name',
      title: 'Name (PC NO)',
      width: '250',
      sortable: true,
      sortColumn: 'Name',
    },
    {
      field: 'category',
      title: 'Category',
      width: '150',
      sortable: true,
      sortColumn: 'Category',
    },
    {
      field: 'subCategory',
      title: 'Sub Category',
      width: '250',
      sortable: true,
      sortColumn: 'SubCategory',
    },
    {
      field: 'priority',
      title: 'Priority',
      width: '150',
      sortable: true,
      sortColumn: 'Priority',
    },
    {
      field: 'serviceDetails',
      title: 'Service Details',
      width: '300',
      sortable: true,
      sortColumn: 'ServiceDetails',
    },
    {
      field: 'pendingAt',
      title: 'Pending At',
      width: '250',
      sortable: true,
      sortColumn: 'PendingAt',
    },
    {
      field: 'status',
      title: 'Status',
      width: '150',
      sortable: true,
      sortColumn: 'Status',
    },
    {
      field: 'closedBy',
      title: 'Closed By',
      width: '250',
      sortable: true,
      sortColumn: 'ClosedBy',
    },
    {
      field: 'closedAt',
      title: 'Closed Date',
      width: '250',
      sortable: true,
      sortColumn: 'ClosedAt',
    },
    { field: 'action', title: 'Action', width: '1' },
  ];
  selectedServiceRequestStatus: ServiceRequestStatus = this.defaultOptionValue;

  @ViewChild('projectMenuTrigger', { static: false })
  projectMenuTrigger!: MatMenuTrigger;
  selectServiceRequestStatusValue(statusValue: ServiceRequestStatus): void {
    this.selectedServiceRequestStatus = statusValue;
  }
  addservice: boolean = false;
  showServiceRequestSuccess: boolean = false;
  serviceRequestSuccessMessage: string = '';
  ngOnInit(): void {

    this.successMessageService.getSuccessMessage().subscribe((message)=>
    {
   if(message === 'Service Request Successfully Added')
   {
    this.showServiceRequestSuccess = true;
    this.serviceRequestSuccessMessage = 'Service Request Added Successfully!.';
    setTimeout(() => {
      this.showServiceRequestSuccess = false;

    }, 3000);
   }
   if(message === 'Updated Service Request Successfully')
   {
    this.showServiceRequestSuccess = true;
    this.serviceRequestSuccessMessage = 'Service Request Updated Successfully!.';
    setTimeout(() => {
      this.showServiceRequestSuccess = false;
    }, 3000);

   }
   if(message === 'Service Request Changed to reopen')
   {
    this.showServiceRequestSuccess = true;
    this.serviceRequestSuccessMessage = 'Service Request Successfully changed to reopen!.';
    setTimeout(() => {
      this.showServiceRequestSuccess = false;
    }, 3000);
   }
    })
    this.displayHeader.selectedItem$.subscribe((itemName) => {
      this.selectedItemName = itemName;
    }); 


    // this.updateServiceRequestService.updateSuccessSubject.subscribe(
    //   (success) => {
    //     if (success === true) {
    //       console.warn("success : ",success);
          
    //       this.showServiceRequestSuccess = true;
    //       this.serviceRequestSuccessMessage = 'Service Request Updated Successfully.';
    //       setTimeout(() => {
    //         this.showServiceRequestSuccess = false;
    //       }, 2000);
    //     }
    //   }
    // );
    // this.dialogService.serviceRequestAdded.subscribe((result) => {
    //   if (result === undefined) {
       
    //     // this.dialogService.serviceRequestAdded.next(result);
    //     this.showServiceRequestSuccess = true;
    //     this.serviceRequestSuccessMessage =
    //       'Service Request Added Successfully.';
    //     setTimeout(() => {
    //       this.showServiceRequestSuccess = false;
          
    //     }, 5000);
    //     // this.onLoadData();
       
    //   }
    // });
    // this.route.queryParams.subscribe((params) =>
    // {
    //   if(params['ServiceRequestStatusReopen'] === 'true')
    //   {
    //     this.showServiceRequestSuccess = true;
    //     this.serviceRequestSuccessMessage = 'Service Request Successfully changed to Reopen';
    //     setTimeout(() => {
    //       this.showServiceRequestSuccess = false;
    //     }, 5000);
    //   }
    // })
    this.onLoadData();


   
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

      this.onLoadData();
    }
  }
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex + 1;

    this.onLoadData();
  }

  onPageSizeChange(event: MatSelectChange): void {
    this.pageSize = event.value;
    this.pageNumber = 1;
    this.onLoadData();
  }
  getticketNumber(event: any) {
    this.ticketNumber = event.target.value;
    if (this.ticketNumber === '') {
      this.ticketNumber = null;
    }
    this.onLoadData();
  }
  onLoadData() {
    const selectedEnumValue = this.selectedServiceRequestStatus;
    const employeeId = localStorage.getItem('employeeId');
    const ticketNumber = this.ticketvalueForm.get('ticket')?.value || null;
    console.log('TicketNumber', ticketNumber);

    if (employeeId) {
      const request: GetServiceDetail = {
        EmployeeId: +employeeId,
        TicketNumber: ticketNumber,
        RequestStatus: selectedEnumValue,
        PageNumber: this.pageNumber,
        PageSize: this.pageSize,
        SortColumn: this.sortColumn,
        SortOrder: this.sortOrder,
      };
      this.servicerequest.getServiceDetails(request).subscribe({
        next: (response: any) => {
          console.log(response);
          this.gridData = [];
          this.gridData.push(...response);
          console.log(...response);

          this.totalRecords = response[0].totalRecords;

          console.log('Total Records:', this.totalRecords);
        },
        error: (error: any) => {
          this.gridData = [];
          this.totalRecords = 0;
        },
      });
    }
  }
  OnSearchServiceRequestFilter() {
    const selectedEnumValue = this.selectedServiceRequestStatus;
    const ticketNumber = this.ticketvalueForm.get('ticket')?.value || null;
    console.log('status', selectedEnumValue);
    console.log('ticket', ticketNumber);
    this.onLoadData();
  }

  OnClearServiceRequestFilter() {
    this.ticketvalueForm.reset();
    this.selectedServiceRequestStatus = this.defaultOptionValue;
    this.onLoadData();
  }
  openAddServiceModal() {
    const addmodal = this.dialogService.openAddServiceRequestModal();
    console.log('add Service', addmodal);
  }
  UpdateServiceRequest(ticket: number, status: any) {
    console.log(ticket, status);
    this.router.navigate(['/service-request/edit-serviceRequest'], {
      queryParams: {
        serviceRequestId: ticket,
        serviceRequestStatus: status,
      },
    });
  }
}
