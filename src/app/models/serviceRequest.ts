export interface GetServiceDetail
{
    EmployeeId:number;
    TicketNumber:any;
    RequestStatus:number|null;
    PageNumber:number|null;
    PageSize:number|null;
    SortColumn:string|null;
    SortOrder:any;
}
export interface GetServiceRequestInsertDetailsViewModelRequest
{
    EmployeeId:number;
}
export interface GetServiceCategoryDropdownViewModelRequest
{
    InputServiceGroupId:number;
}
export interface GetServiceSubCategoryDropdownViewModelRequest
{
    InputCategoryId:number;
}
export interface InsertServiceRequest
{
    EmployeeId:number;
    ServiceGroupId:number;
    CategoryId:number;
    SubCategoryId:number;
    ServiceRequestPriority:string;
    ServiceDetails:string;

}
export interface GetUpdateServiceRequestDetails
{
    ServiceRequestId:any;
}
export interface GetUpdateCategoryDropDown
{
    InputServiceGroupId:number;
    ServiceRequestId:number;
}
export interface GetUpdateSubCategoryDropDown
{
    InputCategoryId:number;
    ServiceRequestId:number;
}
export interface UpdateServiceRequestViewModelRequest
{
    ServiceRequestId:number;
    RequestedDate:any;
    Status:number;
    ServiceGroupId:number;
    CategoryId:number;
    SubCategoryId:number;
    ServiceRequestPriority:string;
    ServiceDetails:string;
    Comments:any;
}
export interface ChangeServiceRequestStatus
{
    employeeId:number;
    RequestStatus:number;
    ServicerequestId:number;
    Comments:any;
}
