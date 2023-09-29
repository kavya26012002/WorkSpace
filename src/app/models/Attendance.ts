export interface getAttendanceRequest {
    employeeId: string,
    month: number | null,
    year: number | null
}
export interface Attendance {
    attendanceOption: number | null,
    currentDate: Date | null,
    currentWeekDay: string | null,
    isApproved: boolean | null
}

export interface fillAttendance {
    employeeId: string,
    attendanceOption: number
}

export interface holiDay {
    key: bigint,
    value: Date
}
export enum AttendanceOption {
    H,
    A,
    P,
    ""
}