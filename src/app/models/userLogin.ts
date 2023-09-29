export interface UserLogin{
    userName:string,
    password:string,
}
export interface RefreshToken{
    refershToken: string
}


export interface GetWorkItemDetailsViewModelRequest {
    EmployeeId: number;
    ProjectName: string | null;
  }
  
  export interface GetWorkItemDetailsViewModelResponse {
    projectName: string;
    projectId:number;
    title: string;
    step: number;
    priority: string;
    estimation: string;
    remaining: string;
    workDone: string;
    startDate: any;
    endDate: any;
  }
  export interface GetUpdateworkItemRequest{
    ProjectWorkId: number
  }
  export interface GetUpdateWorkItemResponse{
    title:any;
    workItemName : string;
    workDoneBy:string;
    workDoneOn: string;
    originalEst: any;
    remainingHours: any;
    workDone: string | null;
    description: any;
  }
  export interface GetAddWorkLog{
    employeeId: number;
    projectWorkId:number;
    workDoneOn:any;
    workTime:any;
    //  remaining:any;
    description: string;
  }
  
