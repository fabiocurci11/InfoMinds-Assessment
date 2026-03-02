import { useState, useMemo } from "react"; // Aggiunto useMemo
import { EmployeeListQuery } from "../types/employee";
import { useExportXML } from "../hooks/useExportXML";
import { useFetch } from "../hooks/useFetch";
import DataTable from "../components/ui/Table/DataTable";
import { SearchField, TableColumn } from "../types/table";
import Header from "../components/ui/Header";
import AppToast from "../components/ui/AppToast";

const PAGE_TITLE: string = "Employees"
const EMPLOYEES_LIST_API = "/api/employees/list";

export default function EmployeeListPage() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [toast, setToast] = useState({ open: false, message: "" });

  //memo filters params
  const fetchParams = useMemo(() => ({
    FirstName: firstName,
    LastName: lastName,
  }), [firstName, lastName]);

  //handle get and filter API 
  const { data: list, loading, error,} = useFetch<EmployeeListQuery>(EMPLOYEES_LIST_API, fetchParams);

  //custom hook to export XML
  const { exportToXML, isExporting } = useExportXML<EmployeeListQuery>();

  //memo columns
  const columns = useMemo<TableColumn<EmployeeListQuery>[]>(() => [
    { field: "code", headerName: "Code", renderCell: (row) => row.code},
    { field: "firstName", headerName: "FirstName", renderCell: (row) => row.firstName},
    { field: "lastName", headerName: "LastName", renderCell: (row) => row.lastName},
    { field: "address", headerName: "Address", renderCell: (row) => row.address},
    { field: "email", headerName: "Email", renderCell: (row) => row.email},
    { field: "phone", headerName: "Phone", renderCell: (row) => row.phone},
    { field: "department.code", headerName: "Dep. Code", renderCell: (row) => row.department?.code || "-"},
    { field: "department.description", headerName: "Dep. Description", renderCell: (row) => row.department?.description || "-"},
  ], []);

  //memo search filter
  const searchFields = useMemo<SearchField[]>(() => [
    {
      name: "firstName",
      label: "First Name",
      placeholder: "Search by first name...",
      value: firstName,
      onChange: setFirstName,
    },
    {
      name: "lastName",
      label: "Last Name",
      placeholder: "Search by last name...",
      value: lastName,
      onChange: setLastName,
    },
  ], [firstName, lastName]);

  const handleExport = () => {
    exportToXML(list, {
      filename: `employees_${new Date().toISOString().split("T")[0]}.xml`,
    });

    setToast({
      open: true,
      message: `Export complete! ${list.length} records exported.`,
    });
  };

  return (
    <>
      <Header title={PAGE_TITLE} />

      <DataTable
        columns={columns}
        data={list}
        loading={loading}
        error={error}
        config={{
          showSearch: true,
          searchFields: searchFields,
          showExport: true,
          onExport: handleExport,
          exportLabel: "Export",
          isExporting: isExporting,
        }}
      />

      <AppToast
        open={toast.open}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </>
  );
}