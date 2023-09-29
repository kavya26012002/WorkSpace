import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { DiaplayHeaderService } from 'src/app/common/services/displayheader.service';
import { TimelogService } from 'src/app/common/services/timelog.service';
import { UserServiceService } from 'src/app/common/services/user-service.service';
import { GetTimeLog, GetTimeLogDetailsBottomPartViewModelResponse, GetTimeLogDetailsTopPartViewModelResponse, GetTimeLogYearlyRequest, HoverTimeLogMonthlyRequest } from 'src/app/models/timelog';

@Component({
  selector: 'app-view-timelogs',
  templateUrl: './view-timelogs.component.html',
  styleUrls: ['./view-timelogs.component.css'],
})
export class ViewTimelogsComponent implements OnInit {
  selectedItemName: string | null = null;
  selectType: string = 'Monthly';
  selectMonth: string = '';
  months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  selectYear: number = new Date().getFullYear();
  years: number[] = [];
  selectedProject: string | null = null;
  contentSearching2Visible: boolean = true; 
  defaultMonth: number = new Date().getMonth() + 1;
  defaultYear:number = new Date().getFullYear();
  tooltipResponseData: any = {
    outHours1: '',
    outHours2: '',
    timeIn1: '',
    timeIn2: '',
    timeOut1: '',
    timeOut2: '',
    workHours1: '',
    workHours2: ''
  };



  constructor(
    private displayHeader: DiaplayHeaderService,
    private userService: UserServiceService,
    private matDialog: MatDialog,
    private timelogService: TimelogService,
    private datePipe: DatePipe


  ) {
    const currentDate = new Date();
    this.selectMonth = this.months[currentDate.getMonth()];
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 4;
    for (let i = startYear; i <= currentYear; i++) {
      this.years.push(i);
    }
  }
  public gridTopData: any[] = [];
  public gridBottomData: any[] = [];
  public gridYearly: any[]=[];
    
  
  public topColumns: any[] = [
    { field: 'employeeNo', title: 'Employee No', width: '100' },
    { field: 'name', title: 'Name', width: '100' },
    { field: 'shift', title: 'Shift', width: '10' },
    { field: 'experience', title: 'Experience', width: '10' },
    { field: 'hours', title: 'Hours', width: '10' },
    { field: 'presentDays', title: 'P Days', width: '100' },
    { field: 'leaveDays', title: 'L Days', width: '100' },
    { field: 'halfLeave', title: 'Half Leaves', width: '100' },
    { field: 'Late Days', title: 'Late Days', width: '100' },
    { field: 'avgTimeLog', title: 'Avg Time Log', width: '100' },
    { field: 'avgWorkLog', title: 'Avg Work Log', width: '100' },
    { field: 'difference', title: 'Difference[TL/WL]', width: '10' },
    { field: 'outHours', title: 'Out Hours[Avg]', width: '100' },
];

public bottomColumns: any[]=[
  {field:'date', title:'Date',width:'100'},
  {field:'lateComer', title:'Late Comer?', width:'100'},
  {field:'firstInTime', title:'First In Time', width:'100'},
  {field:'lastOutTime', title:'Last Out Time', width:'100'},
  {field:'totalOutHours', title:'Total Out Hours', width:'100'},
  {field:'timeLog', title:'Time Log', width:'100'},
  {field:'workLog', title:'Work Log', width:'100'},
  {field:'difference', title:'Difference', width:'100'}
];

public yaerlyColumns: any[] = [
  { field: 'employeeNo', title: 'Employee No', width: '100' },
  { field: 'name', title: 'Name', width: '100' },
  { field: 'month', title: 'Month', width: '100' },
  { field: 'hours', title: 'Hours', width: '10' },
  
  { field: 'pDays', title: 'P Days', width: '100' },
  { field: 'lDays', title: 'L Days', width: '100' },
  { field: 'halfLeaves', title: 'Half Leaves', width: '100' },
  { field: 'Late Days', title: 'Late Days', width: '100' },
  { field: 'avgTimeLog', title: 'Avg Time Log', width: '100' },
  { field: 'avgWorkLog', title: 'Avg Work Log', width: '100' },
  { field: 'difference', title: 'Difference[TL/WL]', width: '10' },
  { field: 'outHours', title: 'Out Hours[Avg]', width: '100' },
];
ngOnInit(): void {
  this.loadTimeLogData();
  this.displayHeader.selectedItem$.subscribe((itemName) => {
    this.selectedItemName = itemName;
  });
}

loadTimeLogData() {
  const employeeId = localStorage.getItem('employeeId');
  if (employeeId) {
    const request: GetTimeLog = {
      EmployeeId: +employeeId,
      Month: this.defaultMonth,
      Year: this.defaultYear
    };

    this.timelogService.getTimeLog(request).subscribe({
      next: (response: any) => {
        let toppartresponse = response.getTimeLogDetailsTopPartViewModelResponse;
        let bottonpartresponse = response.getTimeLogDetailsBottomPartViewModelResponse;

        if (toppartresponse === null) {
          // console.log('No data available for the top part.');
          this.gridTopData = [];
        } else {
          this.gridTopData = [];

          this.gridTopData.push(toppartresponse);
          console.log(this.gridTopData);
        }

        if (bottonpartresponse === null || bottonpartresponse.length === 0) {
          // console.log('No data available for the bottom part.');
          this.gridBottomData = [];
        } else {
          this.gridBottomData = [];

          this.gridBottomData.push(...bottonpartresponse);
          console.log(this.gridBottomData);
        }
      }
    });
  }
}
clearfilter()
{
  this.loadTimeLogData();

}
 
  @ViewChild('projectMenuTrigger', { static: false })
  projectMenuTrigger!: MatMenuTrigger;

  selectTypeValue(value: string) {
    this.selectType = value;
    this.contentSearching2Visible = value ==='Monthly';
    
this.gridYearly = [];


    this.projectMenuTrigger.closeMenu();
  }
  selectMonthValue(month: string) {
    this.selectMonth = month;
    this.projectMenuTrigger.closeMenu();
    const employeeId = localStorage.getItem('employeeId');
  
  }
  selectYearValue(year: number) {
    this.selectYear = year;
    this.projectMenuTrigger.closeMenu();
    
  }
  clearyearly()
  {
    this.selectTypeValue('Monthly');
    this.gridYearly = [];
    
  }
  callApiYearly()
  {
    const employeeId = localStorage.getItem('employeeId');
  if (employeeId) {
    const request: GetTimeLogYearlyRequest = {
      EmployeeId: +employeeId,
     
      Year: this.defaultYear
    };
    this.timelogService.getTimeLogYearly(request).subscribe({
      next: (response:any)=>
      {
        let yearlyresponse = response.timeLogYearlyList;
        if (yearlyresponse === null || yearlyresponse.length === 0) {
        
          this.gridYearly = [];
        } else {
          this.gridYearly = [];

          this.gridYearly.push(...yearlyresponse);
          console.log(this.gridYearly);
        console.log(response.timeLogYearlyList);
      }
    }
    })
    }
  }
  onSearchYearlyButtonClick()
  {
    const employeeId = localStorage.getItem('employeeId');
    if(employeeId)
    {
      const request:GetTimeLogYearlyRequest=
      {
        EmployeeId: +employeeId,
        Year:this.selectYear
      };
      this.timelogService.getTimeLogYearly(request).subscribe({
        next: (response:any)=>
        {
          let yearlyresponse = response.timeLogYearlyList;
        if (yearlyresponse === null || yearlyresponse.length === 0) {
        
          this.gridYearly = [];
        } else {
          this.gridYearly = [];

          this.gridYearly.push(...yearlyresponse);
          console.log(this.gridYearly);
        console.log(response.timeLogYearlyList);
      }
        }
      })
    }
  }
  onSearchButtonClick()
  {

    const employeeId = localStorage.getItem('employeeId');
    if(employeeId)
    {
      const request: GetTimeLog = 
      {
        EmployeeId:+employeeId,
        Month:this.months.indexOf(this.selectMonth) +1,
        Year: this.selectYear

      }
      this.timelogService.getTimeLog(request).subscribe(
        {
          next: (response:any)=>
          {
            
            let toppartresponse= response.getTimeLogDetailsTopPartViewModelResponse;
            let bottonpartresponse=response.getTimeLogDetailsBottomPartViewModelResponse;
           
           
            if (toppartresponse === null) {
              console.log('No data available for the top part.');
              this.gridTopData = [];
            } else {
              this.gridTopData = [];

              this.gridTopData.push(toppartresponse);
              console.log(this.gridTopData)
            }
        
            if (bottonpartresponse === null || bottonpartresponse.length === 0) {
              console.log('No data available for the bottom part.');
              this.gridBottomData = [];
            } else {
              this.gridBottomData = [];

              this.gridBottomData.push(...bottonpartresponse);
              console.log(this.gridBottomData);
            }

           
          }
        }
        
       
      );

    }
  }

  onProjectMenuClosed() {
    if (!this.selectedProject) {
      this.selectedProject = null;
    }
  }
 
  onProjectTitleHover(title: string) {
    let splitteddate = title.split('[')[0].trim();
    const parsedDate = this.parseCustomDate(splitteddate);
  
    if (parsedDate) {
      const formattedLogDate = this.datePipe.transform(parsedDate,  'yyyy-MM-dd');

       const employeeId = localStorage.getItem("employeeId");
      if(employeeId)
      {
        const request:HoverTimeLogMonthlyRequest=
        {
          EmployeeId: +employeeId,
          LogDate:formattedLogDate,
          Month:null,
          Year:null
        }
        console.log(request);
     
        
        this.timelogService.getHoverMontly(request).subscribe({
          next: (response:any)=>
          {

            this.tooltipResponseData = 
            {
              outHours1:response[0].outHours1,
              outHours2:response[0].outHours2,
              timeIn1:response[0].timeIn1,
              timeIn2:response[0].timeIn2,
              timeOut1:response[0].timeOut1,
              timeOut2:response[0].timeOut2,
              workHours1:response[0].workHours1,
              workHours2:response[0].workHours2
            }
            
            console.log(response[0].outHours1);
            console.log(response[0].outHours2);
            console.log(response[0].timeIn1);
            console.log(response[0].timeIn2);
            console.log(response[0].timeOut1);
            console.log(response[0].timeOut2);
            console.log(response[0].workHours1);
            console.log(response[0].workHours2);


          }
        })
      }
    } else {
      console.log("Invalid Date");
    }
  }

  private parseCustomDate(dateString: string): Date | null {
    const parts = dateString.split('-');
    
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; 
      const year = parseInt(parts[2], 10);
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
  
    return null; 
  }
          
  onProjectTitleLeave()
  {
  }
}
