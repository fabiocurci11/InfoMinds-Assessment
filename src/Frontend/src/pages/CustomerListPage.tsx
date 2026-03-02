import { useState, useMemo } from "react"; // Aggiunto useMemo
import { useExportXML } from "../hooks/useExportXML";
import { useFetch } from "../hooks/useFetch";
import DataTable from "../components/ui/Table/DataTable";
import Header from "../components/ui/Header";
import { CustomerListQuery } from "../types/customer";
import { TableColumn, SearchField } from "../types/table";
import AppToast from "../components/ui/AppToast";

const PAGE_TITLE: string = "Customers"
const CUSTOMERS_LIST_API = "/api/customers/list";

export default function CustomerListPage() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [toast, setToast] = useState({ open: false, message: "" });

  //memo filters params
  const fetchParams = useMemo(() => ({
    Name: name,
    Email: email
  }), [name, email]);

  //handle get and filter API 
  const {data: list, loading, error} = useFetch<CustomerListQuery>(CUSTOMERS_LIST_API, fetchParams);

  const { exportToXML, isExporting } = useExportXML<CustomerListQuery>();

  //memo columns 
  const columns = useMemo<TableColumn<CustomerListQuery>[]>(() => [
    { field: "name", headerName: "Name", renderCell: (row) => row.name },
    { field: "address", headerName: "Address", renderCell: (row) => row.address},
    { field: "email", headerName: "Email", renderCell: (row) => row.email },
    { field: "phone", headerName: "Phone", renderCell: (row) => row.phone },
    { field: "iban", headerName: "Iban", renderCell: (row) => row.iban },
    { field: "customerCategory.code", headerName: "Customer Code", renderCell: (row) => row.customerCategory?.code || "-",},
    { field: "customerCategory.description", headerName: "Customer Description", renderCell: (row) => row.customerCategory?.description || "-",}
  ], []);

  //memo search filter
  const searchFields = useMemo<SearchField[]>(() => [
    {
      name: "name",
      label: "Name",
      placeholder: "Search by name...",
      value: name,
      onChange: setName,
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Search by email...",
      value: email,
      onChange: setEmail,
    },
  ], [name, email]);

  const handleExport = () => {
    exportToXML(list, {
      filename: `customers_${new Date().toISOString().split("T")[0]}.xml`,
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