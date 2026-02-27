export interface EmployeeDepartment {
  code: string | null;
  description: string | null;
}

export interface EmployeeListQuery {
  id: number;
  code: string | null;
  firstName: string | null;
  lastName: string | null;
  address: string | null;
  email: string | null;
  phone: string | null;
  department: EmployeeDepartment | null;
}