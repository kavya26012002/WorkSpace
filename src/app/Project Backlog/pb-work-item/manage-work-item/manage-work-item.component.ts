import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ProductBacklogWorkItemService } from 'src/app/common/services/product-backlog-work-item.service';
import { SharedSuccessServiceService } from 'src/app/common/services/shared-success-service.service';
import { WorkFlow, WorkItemProjectStatus } from 'src/app/models/enum';
import { GetupdateworkItemRequest, GetWorkItemAttachmentRequest } from 'src/app/models/ProductBacklogWorkItem';

@Component({
  selector: 'app-manage-work-item',
  templateUrl: './manage-work-item.component.html',
  styleUrls: ['./manage-work-item.component.css']
})
export class ManageWorkItemComponent implements OnInit,AfterViewInit {
  @ViewChild('editor') editor: any;

  projectWorkId!: number; 
  public editorInstance: any;
  editorData: string = ''; // Initialize with an empty string or any default data
  selectedItemName: string | null = null;
  public AssignedEmployeeId:any;
  public WorkGroupId:any;
  public defaultWorkFlowType:any;
  public defaultStatus:any;
  public getManageWorkItemReportingByList:any;
  public getManageWorkItemSubProjectList:any;
  public defaultReportedBy:any;
  public defaultSubProject:any;
  showmanageWorkItemError:boolean = false;
  manageWorkItemErrorMessage: string='';
  showmanageWorkItemSuccess: boolean = false;
  manageWorkItemSuccessMessage: string = '';
  priorityOptions:string[]=['Low','Medium','High'];
  isEndDateValid = true;


  manageWorkItemForm: FormGroup = new FormGroup({});
  public Editor = ClassicEditor;
  
  WorkFLowTypeOPtion = WorkFlow;
  WorkFLowTypeOption = [
    { value: WorkFlow.Defect, name: 'Defect' },
    { value: WorkFlow.Task, name: 'Task' },
    { value: WorkFlow.Enhancement, name: 'Enhancement' },
    {value: WorkFlow.Module, name: 'Module'},
    {
      value:WorkFlow.Request,
      name:'Request'
    }
  ];
  StatusOption = WorkItemProjectStatus;
  statusOptions = [
    { value: WorkItemProjectStatus.New, name: 'New' },
    { value: WorkItemProjectStatus.InProgress, name: 'In-Progress' },
    { value: WorkItemProjectStatus.DevCompleted, name: 'Dev-Completed' },
    {value: WorkItemProjectStatus.ReadyForTesting, name: 'Ready For Testing'},
    {
      value:WorkItemProjectStatus.Closed,
      name:'Closed'
    }
  ];
  constructor( private dialog: MatDialog,
    private _snackbar: MatSnackBar,
    private router: Router,
    private formBuilder: FormBuilder,
    private service: ProductBacklogWorkItemService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private successMessageService:SharedSuccessServiceService)
  {
    
  }

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe(params =>
      {
        const projectWorkId = params['ProjectWorkId'];
        this.loadData(projectWorkId);

      
      });
     
     
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params =>
      {
this.projectWorkId = params['ProjectWorkId'];
      });
      this.manageWorkItemForm = this.formBuilder.group({
        title:[''],
        workGroup:[''],
        workFlowType:[''],
        priority:[''],
        status:[''],
        startDate:[''],
        endDate:[''],
        originalEst:[''],
        assignedTo:[''],
        remainingEst:[''],
        reportedBy:[''],
        subProject:[''],
        releasedToProduction:[''],
        rsi:[''],
        description:['']
      })
    
  }
  loadData(projectWorkId:any)
  {
     const request:GetWorkItemAttachmentRequest=
     {
      ProjectWorkId:projectWorkId
     };
     this.service.GetManageWorkItem(request).subscribe({
      next: (response:any)=>
      {
        console.log("GetMAnageWorkItemDetals",response);
        const getManageWorkItemTopPartResponse = response.getManageWorkItemTopPartResponse;
        console.log(getManageWorkItemTopPartResponse);
        this.AssignedEmployeeId = getManageWorkItemTopPartResponse[0].assignedId;
        this.WorkGroupId = getManageWorkItemTopPartResponse[0].workGroupId;
        console.log("WorkGroupId", this.WorkGroupId);
        
        
        this.getManageWorkItemSubProjectList = response.getManageWorkItemSubProjectList;
        this.getManageWorkItemReportingByList = response.getManageWorkItemReportingByList;
    
        this.manageWorkItemForm.controls['title'].setValue(getManageWorkItemTopPartResponse[0].title);
        this.manageWorkItemForm.controls['workGroup'].setValue(getManageWorkItemTopPartResponse[0].workGroup);
        const workFlowTypeValue: number = parseInt(getManageWorkItemTopPartResponse[0].workFlowType, 10);
        const defaultOption = this.WorkFLowTypeOption.find(option => option.value === workFlowTypeValue);
        const workFlowType = defaultOption ? defaultOption.value : '';
        this.defaultWorkFlowType = workFlowType;
        console.log("DefaultNAme",this.defaultWorkFlowType);
        
        this.manageWorkItemForm.controls['workFlowType'].setValue(workFlowType);
        this.manageWorkItemForm.controls['priority'].setValue(getManageWorkItemTopPartResponse[0].priority);
        // this.manageWorkItemForm.controls['status'].setValue(this.getStatusName(getManageWorkItemTopPartResponse[0].status));
        const statusValue: number = parseInt(getManageWorkItemTopPartResponse[0].status, 10);
        const defaultStatusOption = this.statusOptions.find(option => option.value === statusValue);
        const status = defaultStatusOption ? defaultStatusOption.value : '';
        this.defaultStatus = status;
        


         console.log("Status",this.defaultStatus);
         const foramttedStartDate = this.datePipe.transform(getManageWorkItemTopPartResponse[0].startDate,'yyyy-MM-dd');
         const formattedEndDate = this.datePipe.transform(getManageWorkItemTopPartResponse[0].endDate,'yyyy-MM-dd');
         this.manageWorkItemForm.controls['startDate'].setValue(foramttedStartDate);
         this.manageWorkItemForm.controls['endDate'].setValue(formattedEndDate);
         this.manageWorkItemForm.controls['originalEst'].setValue(getManageWorkItemTopPartResponse[0].originalEst);
         this.manageWorkItemForm.controls['remainingEst'].setValue(getManageWorkItemTopPartResponse[0].remainingEst);

         this.manageWorkItemForm.controls['assignedTo'].setValue(getManageWorkItemTopPartResponse[0].assignedTo);
         this.manageWorkItemForm.controls['reportedBy'].setValue(getManageWorkItemTopPartResponse[0].reportedId);
         this.defaultReportedBy= getManageWorkItemTopPartResponse[0].reportedId;
         this.manageWorkItemForm.controls['subProject'].setValue(getManageWorkItemTopPartResponse[0].subProjectId);
         this.defaultSubProject = getManageWorkItemTopPartResponse[0].subProjectId;
         this.manageWorkItemForm.controls['rsi'].setValue(getManageWorkItemTopPartResponse[0].rsi);
         this.manageWorkItemForm.controls['releasedToProduction'].setValue(getManageWorkItemTopPartResponse[0].releasedToProduction);
         this.manageWorkItemForm.controls['description'].setValue(getManageWorkItemTopPartResponse[0].descriptions);
        //  this.editorData = getManageWorkItemTopPartResponse[0].descriptions;
        







        
      }
     })
  }
  dateComparision()
  {
    const formValues = this.manageWorkItemForm.value;
    const StartDate = formValues.startDate;
      const EndDate = formValues.endDate

      const formattedStartDate=this.datePipe.transform(StartDate ?? '', 'yyyy-MM-dd');
      const formattedEndDate = this.datePipe.transform(EndDate ?? '', 'yyyy-MM-dd');
      if (formattedStartDate && formattedEndDate && formattedEndDate < formattedStartDate)
      {
         this.showmanageWorkItemError = true;
         this.isEndDateValid = false;
         this.manageWorkItemErrorMessage = 'End Date Must Be Greater then Start Date';
         setTimeout(() => {
          this.showmanageWorkItemError = false;
         }, 3000);
         return;
      }
      else{
        this.isEndDateValid = true;
        this.showmanageWorkItemError = false;
        



      }
  }
  UpdateWorkItem(projectWorkId:number){
    if(!this.isEndDateValid)
    {
      this.showmanageWorkItemError = true;
      this.manageWorkItemErrorMessage = 'Please check all the fields!..'
      setTimeout(() => {
        this.showmanageWorkItemError = false;
      }, 3000);
      return;
    }
    const employeeId = localStorage.getItem("employeeId");
    if(employeeId)
    {
      const formValues = this.manageWorkItemForm.value;
      const title=formValues.title;
      const formattedTitle = title.split(':')[1].trim('');
      const StartDate = formValues.startDate;
      const EndDate = formValues.endDate

      const formattedStartDate=this.datePipe.transform(StartDate ?? '', 'yyyy-MM-dd');
      const formattedEndDate = this.datePipe.transform(EndDate ?? '', 'yyyy-MM-dd');
      const request :GetupdateworkItemRequest=
      {
        ProjectWorkId:+projectWorkId,
        Title:formattedTitle,
        EmployeeId:+employeeId,
        SubProjectId:this.defaultSubProject,
        WorkGroupId:this.WorkGroupId,
        WorkFlow:this.defaultWorkFlowType,
        Priority:formValues.priority,
        Status:this.defaultStatus,
        StartDate:formattedStartDate,
        EndDate:formattedEndDate,
        OriginalEst:formValues.originalEst,
        RemainingEst:formValues.remainingEst,
        AssignedEmployeeId:this.AssignedEmployeeId,
        ReportedEmployeeId:this.defaultReportedBy,
        ReleasedToProduction:Boolean(formValues.releasedToProduction),
        RSI:formValues.rsi,
        Description:formValues.description

      };
      console.log(request);
      this.service.UpdateWorkItems(request).subscribe({
        next: (response:any)=>
        {
          const responseMessage = response;
          this.successMessageService.setSuccessMessage(responseMessage);
          this.router.navigate(['/pbWorkItem/view-WorkItem'],
          {
            queryParams:{
              ProjectWorkId:projectWorkId
            }
          });
          console.log(response);
        }
      })
    }

  }
 
  CancelManageWorkItem(projectWorkId:number)
  {
    this.router.navigate(['/pbWorkItem/view-WorkItem'],
          {
            queryParams:{
              ProjectWorkId:projectWorkId
            }
          });
    
  }
}
