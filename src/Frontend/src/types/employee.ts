export interface EmployeeDepartment {
  code: string;
  description: string;
}

export interface EmployeeListQuery {
  id: number;
  code: string;
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  phone: string;
  department: EmployeeDepartment | null;
}