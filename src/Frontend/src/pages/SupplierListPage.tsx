import { useEffect, useState } from "react";

import DataTable from "../components/DataTable";
import { TableColumn } from "../types/table";
import { SupplierListQuery } from "../types/supplier";
import Header from "../components/ui/Header";


const SUPPLIERS_API: string = "/api/suppliers/list";

export default function SupplierListPage() {
  const [list, setList] = useState<SupplierListQuery[]>([]);
  const [loading, setLoading] = useState(true);

  const pageTitle: string = 'Suppliers'

  //API get suppliers
  useEffect(() => {
    fetch(SUPPLIERS_API)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setList(data as SupplierListQuery[]);
      })
      .finally(() => setLoading(false));
  }, []);

  //Configure table column for DataTable component
  const columns: TableColumn<SupplierListQuery>[] = [
    { field: 'name', 
      headerName: 'Name' ,
      renderCell: (row) => row.name  
    },
    { field: 'address', 
      headerName: 'Address',
      renderCell: (row) => row.address  
    },
    { field: 'email',
      headerName: 'Email',
    renderCell: (row) => row.email  
   },
    { field: 'phone', 
      headerName: 'Phone',
      renderCell: (row) => row.phone  
    }
  ];

  return (
    <>
      <Header title={pageTitle}/>
      <DataTable
        loading={loading} 
        columns={columns} 
        data={list} />
    </>
    )
}



