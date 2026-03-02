import { useMemo } from "react";
import { SupplierListQuery } from "../types/supplier";
import { TableColumn } from "../types/table";
import { useFetch } from "../hooks/useFetch";
import DataTable from "../components/ui/Table/DataTable";
import Header from "../components/ui/Header";

const SUPPLIERS_API_URL = "/api/suppliers/list";
const PAGE_TITLE = 'Suppliers';
const FETCH_PARAMS = {}; 

export default function SupplierListPage() {
  
  const { data: list, loading, error } = useFetch<SupplierListQuery>(
    SUPPLIERS_API_URL, 
    FETCH_PARAMS
  );

  const columns = useMemo<TableColumn<SupplierListQuery>[]>(() => [
    { field: 'name', headerName: 'Name', renderCell: (row) => row.name },
    { field: 'address', headerName: 'Address', renderCell: (row) => row.address },
    { field: 'email', headerName: 'Email', renderCell: (row) => row.email },
    { field: 'phone', headerName: 'Phone', renderCell: (row) => row.phone }
  ], []);

  return (
    <>
      <Header title={PAGE_TITLE}/>
      <DataTable
        loading={loading} 
        error={error} 
        columns={columns} 
        data={list} 
      />
    </>
  );
}