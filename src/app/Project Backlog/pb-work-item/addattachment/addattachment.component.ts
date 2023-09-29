import { HttpClient, HttpEventType } from '@angular/common/http';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, EventType, Router } from '@angular/router';
import { ProductBacklogWorkItemService } from 'src/app/common/services/product-backlog-work-item.service';
import { SharedSuccessServiceService } from 'src/app/common/services/shared-success-service.service';

@Component({
  selector: 'app-addattachment',
  templateUrl: './addattachment.component.html',
  styleUrls: ['./addattachment.component.css']
})
export class AddattachmentComponent implements OnInit,AfterViewInit {
  showAttachmentError:boolean = false;
  attachmentErrorMessage: string='';
  showAttachmentSuccess:boolean = false;
  attachmentSuccessMessage:string='';
  fileName = '';
  projectId: any;
  responce: any;

  constructor( @Inject(MAT_DIALOG_DATA) public data: { projectId: any },
  private dialogRef: MatDialogRef<AddattachmentComponent>,
  private api:ProductBacklogWorkItemService,
  private formBuilder: FormBuilder,
  private http: HttpClient,
  private successMessageService:SharedSuccessServiceService,
  private route: ActivatedRoute,
  private router: Router,


  )
{
  this.projectId = data.projectId;
}
 

  ngAfterViewInit(): void {
  }
  ngOnInit(): void {
  }
  addAttachmentForm = this.formBuilder.group({
    description: new FormControl<string | null>(null)
  });
  upload(files: any) {
    var description  = this.addAttachmentForm.value.description;
    if(files.length === 0)
    {
      return;
    }
      const formData = new FormData();
  formData.append('projectWorkId', this.data.projectId);
  if (description != null) {
    formData.append('description', description);
  }
      for(const file of files)
      {
        formData.append(file.name,file);
        this.fileName += file.name + "";
      }
      this.api.uploadFile(formData).subscribe({
        next: (response:any)=>
        {

          if(response.isError == false)
          {
            this.responce = response.responce;
            
            this.closeDialog();
          
            
          }
          
        }
      })

    }
    closeDialog() {
      
      this.dialogRef.close(this.responce);
      const responseMessage = this.responce;
      console.log("FullResponse",responseMessage)
      
      this.successMessageService.setSuccessMessage(responseMessage);
      this.router.navigate(['/pbWorkItem/view-WorkItem'],
      {
        queryParams:{
          ProjectWorkId:this.data.projectId
        }
      });
     
    }
  }
 

