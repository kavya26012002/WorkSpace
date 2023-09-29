import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DialogService } from 'src/app/common/services/dialogservice';
import { DiaplayHeaderService } from 'src/app/common/services/displayheader.service';
import { ServiceRequestService } from 'src/app/common/services/service-request.service';
import { SharedSuccessServiceService } from 'src/app/common/services/shared-success-service.service';
import { UpdateServiceRequestService } from 'src/app/common/services/sharedforsubject';
import { ServiceGroupDropDown, ServiceRequestStatus } from 'src/app/models/enum';
import { ChangeServiceRequestStatus, GetServiceCategoryDropdownViewModelRequest, GetServiceSubCategoryDropdownViewModelRequest, GetUpdateCategoryDropDown, GetUpdateServiceRequestDetails, GetUpdateSubCategoryDropDown, UpdateServiceRequestViewModelRequest } from 'src/app/models/serviceRequest';
interface Category {
  categoryId: number;
  categoryName: string;
}
interface SubCategory
{
   subCategoryId:number;
   subCategoryName:string;
}
@Component({
  selector: 'app-update-service-request',
  templateUrl: './update-service-request.component.html',
  styleUrls: ['./update-service-request.component.css']
})
export class UpdateServiceRequestComponent implements OnInit,AfterViewInit {
  updateServiceRequest: FormGroup = new FormGroup({});

  constructor(private servicerequest: ServiceRequestService,
    private displayHeader: DiaplayHeaderService,
    private matDialog: MatDialog,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dialogService:DialogService,
    private updateServiceRequestService: UpdateServiceRequestService,
    private router: Router,
    private successMessageService:SharedSuccessServiceService
    ){}
  
    serviceRequestStatus!:any;
    serviceRequestId!:any;
  showServiceRequestSuccess:boolean = false;
  serviceRequestSuccessMessage: string='';
  showServiceRequestError: boolean = false;
  serviceRequestErrorMessage: string = '';
  selectedItemName: string | null = null;
  public gridData: any[] = [];
  ServiceGroupDropDown = ServiceGroupDropDown;
  priorityOptions:string[]=['Low','Medium','High'];
  categoryOptions: Category[] = [];
  subCategoryOptions:SubCategory[]=[];
  selectedServiceGroup: any =null;
  // updateSuccessSubject: Subject<boolean> = new Subject<boolean>();



  public Columns:any[] =[
    {field:'closedBy', title:'Name',width:'10'},
    {field:'closedAt', title:'Status Changed Date' ,width:'10'},
    {field:'status', title:'Status',width:'10'},
    {field:'comments', title:'Comments',width:'10'},
    {field:'attachments', title:'Attachments',width:'10'},
   
  ];
  public bottomtable:any[]=[
    {field:'ticket', title:'Name',width:'100'},
    {field:'requestDate', title:'Time Spent' ,width:'100'},
  ];
  ServiceGroupOPtions = [
    { value: ServiceGroupDropDown.HR, name: 'HR' },
    { value: ServiceGroupDropDown.Accounts, name: 'Accounts' },
    { value: ServiceGroupDropDown.Networking, name: 'Networking' },
    { value: ServiceGroupDropDown.Admin, name: 'Admin' },
    { value: ServiceGroupDropDown.TechnologyCEO, name: 'TechnologyCEO' },
    { value: ServiceGroupDropDown.InteranlSystems, name: 'InteranlSystems' },


  ];
  statusOptions: { [key: number]: string } = {
    [ServiceRequestStatus.Approved]: 'Approved',
    [ServiceRequestStatus.Pending]: 'Pending',
    [ServiceRequestStatus.Rejected]: 'Rejected',

    [ServiceRequestStatus.Hold]: 'Hold',
    [ServiceRequestStatus.Acknowledged]: 'Acknowledged',
    [ServiceRequestStatus.Closed]: 'Closed',
    [ServiceRequestStatus.Cancel]: 'Cancel',
    [ServiceRequestStatus.Reopen]: 'Reopen',
    [ServiceRequestStatus.WorkStarted]: 'WorkStarted',

    
  };


  ngOnInit() {
    this.displayHeader.selectedItem$.subscribe((itemName) => {
      this.selectedItemName = itemName;
    }); 
    this.route.queryParams.subscribe(params => {
      this.serviceRequestStatus = params['serviceRequestStatus'];
    });   
    this.updateServiceRequest = this.formBuilder.group({
      ticket:[''],
      requestDate:[''],
      name:[''],
      status:[''],
      serviceGroupId:[''],
      categoryId:[''],
      subCategoryId:[''],
      priority:[''],
      serviceDetails:[''],
      extraComments:[''],
      serviceGroup:[''],
      category:[''],
      subCategory:['']

    }) 
 
}

ngAfterViewInit(): void {
  this.route.queryParams.subscribe(params => {
    const serviceRequestId = params['serviceRequestId'];
    this.serviceRequestId=params['serviceRequestId'];
   this.loadData(serviceRequestId);
    
});  }
private storedServiceRequestId: any = ''; 
private serviceGroupId : any = '';
private categoryId: any ='';
private storedServiceRequestStatus:any = '';
loadData(serviceRequestId:any)
{
  this.storedServiceRequestId = serviceRequestId;
  const request: GetUpdateServiceRequestDetails=
  {
    ServiceRequestId: serviceRequestId
  };
  this.servicerequest.updateGetServiceRequest(request).subscribe({
    next: (response:any)=>
    {
      console.log("Updateget",response);
     const formattedStatusChangedDate = this.datePipe.transform(response[0].closedAt,'dd-MMM-yyyy')
      this.gridData = [
        {closedBy:response[0].closedBy,closedAt:formattedStatusChangedDate,status:this.statusOptions[response[0].status],comments:response[0].comments,attachments:response[0].attachments},
       
      ]
      this.updateServiceRequest.controls['ticket'].setValue(response[0].ticket);
      const formattedDate = this.datePipe.transform(response[0].requestDate, 'dd-MMM-yyyy');
      this.updateServiceRequest.controls['requestDate'].setValue(formattedDate);
      this.updateServiceRequest.controls['name'].setValue(response[0].name);
      this.updateServiceRequest.controls['status'].setValue(this.statusOptions[response[0].status]);
      this.updateServiceRequest.controls['serviceGroupId'].setValue(response[0].serviceGroupId);
      this.updateServiceRequest.controls['priority'].setValue(response[0].priority);
      this.updateServiceRequest.controls['serviceDetails'].setValue(response[0].serviceDetails);
      this.updateServiceRequest.controls['extraComments'].setValue(response[0].extraComments);
      this.updateServiceRequest.controls['serviceGroup'].setValue(response[0].serviceGroup);
      this.updateServiceRequest.controls['subCategory'].setValue(response[0].subCategory);
      this.updateServiceRequest.controls['category'].setValue(response[0].category);
      

      this.categoryId = response[0].categoryId
      this.serviceGroupId = response[0].serviceGroupId
      this.storedServiceRequestId = response[0].ticket
      this.category()
      this.subCategory()

    }
  })
}
category()
{
  const request:GetUpdateCategoryDropDown =
  {
    InputServiceGroupId: this.serviceGroupId,
    ServiceRequestId:this.storedServiceRequestId
  }
  console.log("ServiceGroupId",request);
  this.servicerequest.updateCategoryDropdown(request).subscribe(
    {
      next: (response:any)=>
      {
        // console.log("categoryOptions",response);
        this.categoryOptions = response.getUpdateServiceRequestCategoryDropdownTopViewModelResponse;
        this.updateServiceRequest.controls['categoryId'].setValue(response.getUpdateServiceRequestCategoryDropdownBottomViewModelResponse[0].bottomCategoryId);
      }
    }
  )

}
subCategory()
{
  const request:GetUpdateSubCategoryDropDown =
  {
    InputCategoryId: this.categoryId,
    ServiceRequestId: this.storedServiceRequestId
  };
  // console.log("Categoryid",request);
  this.servicerequest.updateSubCategoryDropdown(request).subscribe({
    next:(response:any)=>
    {
      this.subCategoryOptions = response.getUpdateServiceRequestSubCategoryDropdownTopViewModelResponse;
      this.updateServiceRequest.controls['subCategoryId'].setValue(response.getUpdateServiceRequestSubCategoryDropdownBottomViewModelResponse[0].bottomSubCategoryId);
      console.log(response);
    }
  })
}
onServiceGroupSelectioChange(event: any) {
  this.selectedServiceGroup = event.value;
  if(this.selectedServiceGroup != null)
  {

  
  console.log('Selected Service Group:', this.selectedServiceGroup);
  const request:GetServiceCategoryDropdownViewModelRequest =
  {
    InputServiceGroupId: this.selectedServiceGroup
  };
  console.log(request);
  this.servicerequest.getCategoryDropDown(request).subscribe({
    next: (response:any)=>
    {
      // console.log("CtaegoryDropdown",response[0].categoryId);
      this.categoryOptions = response;
      this.updateServiceRequest.controls['categoryId'].setValue('Select');
      this.updateServiceRequest.controls['subCategoryId'].setValue('Select');
    }
  })
}
else{
  this.categoryOptions = [];
}
}
onCategoryGroupSelectionChange(event:any)
  {
    const inputCtaegory = event.value;
    // console.log('Selected Category:', event.value);
    const request:GetServiceSubCategoryDropdownViewModelRequest =
    {
      InputCategoryId: inputCtaegory
    };
    this.servicerequest.getSubCategoryDropdown(request).subscribe({
      next:(response:any)=>
      {
         this.subCategoryOptions = response;
         this.updateServiceRequest.controls['subCategoryId'].setValue('Select');

      }
    })


  }
  UpdateServiceRequest()
  {
    if (
      this.updateServiceRequest.get('serviceGroupId')?.value === 'Select' ||
      this.updateServiceRequest.get('categoryId')?.value === 'Select' ||
      this.updateServiceRequest.get('subCategoryId')?.value === 'Select' 
    ) {
      this.showServiceRequestError = true;
      this.serviceRequestErrorMessage = 'Please Select the above options';
      setTimeout(() => {
        this.showServiceRequestError = false;

      }, 2000);

    }
    else if( this.updateServiceRequest.get('serviceDetails')?.value === ''
    )
    {
      this.showServiceRequestError = true;
      this.serviceRequestErrorMessage = 'Please mention service details';
      setTimeout(() => {
        this.showServiceRequestError = false;
      }, 2000);
    }
    const currentDate = new Date();
    const formattedDate = this.datePipe.transform(currentDate, 'yyyy-MM-ddTHH:mm:ss.sss');  

    const selectedServiceGroupId = this.updateServiceRequest.get('serviceGroupId')?.value;
    
    const selectedCategoryId = this.updateServiceRequest.get('categoryId')?.value;
    
    const selectedSubCategoryId = this.updateServiceRequest.get('subCategoryId')?.value;
  
    
    const selectedPriority = this.updateServiceRequest.get('priority')?.value;
   
    
    const serviceDetails = this.updateServiceRequest.get('serviceDetails')?.value;
   
    const extracomments = this.updateServiceRequest.get('extraComments')?.value;
   

    const request:UpdateServiceRequestViewModelRequest = 
    {
      ServiceRequestId:this.storedServiceRequestId,
      RequestedDate:formattedDate,
      Status:this.serviceRequestStatus,
      ServiceGroupId:selectedServiceGroupId,
      CategoryId:selectedCategoryId,
      SubCategoryId:selectedSubCategoryId,
      ServiceRequestPriority:selectedPriority,
      ServiceDetails:serviceDetails,
      Comments:extracomments
    };
    console.log(request);
    this.servicerequest.updateServiceRequest(request).subscribe({
      next: (response)=>
      {
        console.log("Update Service Request",response);
        const responseMessage = response;
        this.successMessageService.setSuccessMessage(responseMessage);
        this.router.navigate(['/service-request/view-serviceRequest']);
        // this.router.navigate(['/service-request/view-serviceRequest']);
        // this.updateServiceRequestService.updateSuccessSubject.next(true);

      }
    })

    
}
CancelUpdateServiceRequest()
{
  this.router.navigate(['/service-request/view-serviceRequest']);
}
ChangeServiceRequestStatus()
{
  const employeeId = localStorage.getItem("employeeId");
  // console.log("EmployeeId",employeeId);
  
  const serviceRequestId = this.serviceRequestId;
  // console.log("ServiceRequestId",serviceRequestId);
  
  const serviceRequestStatus = this.serviceRequestStatus;
  // console.log("status",serviceRequestStatus);
  
  const extracomments = this.updateServiceRequest.get('extraComments')?.value;
  // console.log("Comments",extracomments);
  if(employeeId)
  {
    const request:ChangeServiceRequestStatus=
    {
      employeeId:+employeeId,
      RequestStatus:serviceRequestStatus,
      ServicerequestId:serviceRequestId,
      Comments:extracomments
    };
    this.servicerequest.updateServiceRequestStatus(request).subscribe({
      next:(response:any)=>
      {

        const responseMessage = response;
        this.successMessageService.setSuccessMessage(responseMessage);
        this.router.navigate(['/service-request/view-serviceRequest']);
        // this.router.navigate(['/service-request/view-serviceRequest'],
        // {queryParams: { ServiceRequestStatusReopen: 'true' }});

      }
    })
  }
  


}
}


