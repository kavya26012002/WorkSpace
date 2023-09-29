import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/common/services/dialogservice';
import { ServiceRequestService } from 'src/app/common/services/service-request.service';
import { SharedSuccessServiceService } from 'src/app/common/services/shared-success-service.service';
import { ServiceGroupDropDown } from 'src/app/models/enum';
import { GetServiceCategoryDropdownViewModelRequest, GetServiceRequestInsertDetailsViewModelRequest, GetServiceSubCategoryDropdownViewModelRequest, InsertServiceRequest } from 'src/app/models/serviceRequest';
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
  selector: 'app-add-service-request',
  templateUrl: './add-service-request.component.html',
  styleUrls: ['./add-service-request.component.css']
})
export class AddServiceRequestComponent implements OnInit,AfterViewInit {
  showServiceRequestError:boolean = false;
  serviceRequestErrorMessage: string='';
  showServiceRequestSuccess:boolean = false;
  serviceRequestSuccessMessage:string='';
  priorityOptions:string[]=['Low','Medium','High'];
  defaultSelectedPriority:string='Low';
  addServiceRequestForm: FormGroup = new FormGroup({});
  ServiceGroupDropDown = ServiceGroupDropDown;
  defaultServiceGroupOptionValue: string = 'Select';
  selectedServiceGroup: any =null;
  categoryOptions: Category[] = [];
  subCategoryOptions:SubCategory[]=[];
  defaultCategoryOption:string = 'Select';
  defaultSubCategoryOption:string='Select'

  ServiceGroupOPtions = [
    { value: ServiceGroupDropDown.HR, name: 'HR' },
    { value: ServiceGroupDropDown.Accounts, name: 'Accounts' },
    { value: ServiceGroupDropDown.Networking, name: 'Networking' },
    { value: ServiceGroupDropDown.Admin, name: 'Admin' },
    { value: ServiceGroupDropDown.TechnologyCEO, name: 'TechnologyCEO' },
    { value: ServiceGroupDropDown.InteranlSystems, name: 'InteranlSystems' },


  ];

  constructor(private router:Router,
    private serviceRequest: ServiceRequestService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AddServiceRequestComponent>,
    private datePipe: DatePipe,
    private dialog:DialogService,
    private successMessageService:SharedSuccessServiceService

    )
  {

  }
  ngAfterViewInit(): void {
    this.loadData()
    
  }
  onCategoryGroupSelectionChange(event:any)
  {
    const inputCtaegory = event.value;
    console.log('Selected Category:', event.value);
    const request:GetServiceSubCategoryDropdownViewModelRequest =
    {
      InputCategoryId: inputCtaegory
    };
    this.serviceRequest.getSubCategoryDropdown(request).subscribe({
      next:(response:any)=>
      {
         this.subCategoryOptions = response;
         this.addServiceRequestForm.controls['subCategoryId'].setValue('Select');

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
    this.serviceRequest.getCategoryDropDown(request).subscribe({
      next: (response:any)=>
      {
        console.log("CtaegoryDropdown",response[0].categoryId);
        this.categoryOptions = response;
        this.addServiceRequestForm.controls['categoryId'].setValue('Select');
        this.addServiceRequestForm.controls['subCategoryId'].setValue('Select');
        

        
      }
    })
  }
  else{
    this.categoryOptions = [];
  }
  }
  ngOnInit(): void {
    this.addServiceRequestForm = this.formBuilder.group({
      name:[''],
      requestedDate:[''],
      serviceGroupId: ['Select'],
      categoryId: ['Select'],
      subCategoryId: ['Select'], 
      serviceDetails:['']

    })
    
   
  }
 

  loadData()
  {
    
    const employeeId = localStorage.getItem('employeeId');
    console.log(employeeId);
    
    if(employeeId)
    {
      const request:GetServiceRequestInsertDetailsViewModelRequest=
      {
        EmployeeId: +employeeId
      };
      this.serviceRequest.getInsertServiceDetails(request).subscribe(
        {
          next:(response:any)=>
          {
            const data=response.getServiceRequestInsertDetailsViewModelResponse;
            this.addServiceRequestForm.controls['name'].setValue(data.name);
            const formattedDate = this.datePipe.transform(data.requestedDate, 'dd-MMM-yyyy HH:mm:ss');
            this.addServiceRequestForm.controls['requestedDate'].setValue(formattedDate);
            console.log(data);
          }
        }
        
      )
    }
  }
  
  OnSaveServiceRequest() {
    if (
      this.addServiceRequestForm.get('serviceGroupId')?.value === 'Select' ||
      this.addServiceRequestForm.get('categoryId')?.value === 'Select' ||
      this.addServiceRequestForm.get('subCategoryId')?.value === 'Select' 
    ) {
      this.showServiceRequestError = true;
              this.serviceRequestErrorMessage = 'Please Select the above options';
              setTimeout(() => {
                this.showServiceRequestError = false;
              }, 2000);
            }   
            else if( this.addServiceRequestForm.get('serviceDetails')?.value === ''
            )
            {
              this.showServiceRequestError = true;
              this.serviceRequestErrorMessage = 'Please mention service details';
              setTimeout(() => {
                this.showServiceRequestError = false;
              }, 2000);
            }

          const selectedServiceGroupId = this.addServiceRequestForm.get('serviceGroupId')?.value;
          console.log("serviceGroupId",selectedServiceGroupId);
          
          const selectedCategoryId = this.addServiceRequestForm.get('categoryId')?.value;
          console.log("CategoryId",selectedCategoryId);
          
          const selectedSubCategoryId = this.addServiceRequestForm.get('subCategoryId')?.value;
          console.log("subcategoryId",selectedSubCategoryId);
          
          const selectedPriority = this.defaultSelectedPriority;
          console.log("Priroity",selectedPriority);
          
          const serviceDetails = this.addServiceRequestForm.get('serviceDetails')?.value;
          console.log("servicedetails",serviceDetails);
          
          const employeeId = localStorage.getItem('employeeId');
          if(employeeId)    
          {
             const request:InsertServiceRequest=
             {
              EmployeeId:+employeeId,
              ServiceGroupId:selectedServiceGroupId,
              CategoryId:selectedCategoryId,
              SubCategoryId:selectedSubCategoryId,
              ServiceRequestPriority:selectedPriority,
              ServiceDetails:serviceDetails
             };
             this.serviceRequest.insertServiceRequest(request).subscribe(
              {
                next:(response:any)=>
                {
                  console.log(response);
                  const responseMessage= response;
                  this.successMessageService.setSuccessMessage(responseMessage);
                  this.dialogRef.close();

                  // if(response === "Service Request Successfully Added")
                  // {
                  //   this.dialog.serviceRequestAdded.next(true);
                  // }
              
                  // this.dialogRef.close();

                }
              }
             )
             {

             }
          }
  }
}
  

