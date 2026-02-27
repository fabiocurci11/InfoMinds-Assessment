import { useEffect, useState } from "react";
import { useExportXML } from "../hooks/useExportXML";
import DataTable from "../components/DataTable";
import { SearchField, TableColumn } from "../types/table";
import Header from "../components/ui/Header";
import { CustomerListQuery } from "../types/customer";

const CUSTOMERS_API: string = "/api/customers";
const CUSTOMERS_LIST_API: string = `${CUSTOMERS_API}/list`;

export default function CustomerListPage() {
  const [list, setList] = useState<CustomerListQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean | string>(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const { exportToXML, isExporting } = useExportXML<CustomerListQuery>();

  //API return all customers
  useEffect(() => {
    fetch(CUSTOMERS_LIST_API)
      .then((response) => {
        if (!response.ok) throw new Error(`Errore: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        setList(data as CustomerListQuery[]);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const queryParams = new URLSearchParams();
      if (name) queryParams.append("Name", name);
      if (email) queryParams.append("Email", email);

      const queryString = queryParams.toString();
      const url = `${CUSTOMERS_LIST_API}${queryString ? `?${queryString}` : ""}`;
      console.log(url);

      fetch(url)
        .then((response) => response.json())
        .then((data) => setList(data as CustomerListQuery[]))
        .finally(() => setLoading(false));
    }, 500);

    return () => clearTimeout(timer);
  }, [name, email]);

  const columns: TableColumn<CustomerListQuery>[] = [
    {
      field: "name",
      headerName: "Name",
      renderCell: (row) => row.name,
    },
    {
      field: "address",
      headerName: "Address",
      renderCell: (row) => row.address,
    },
    {
      field: "email",
      headerName: "Email",
      renderCell: (row) => row.email,
    },
    {
      field: "phone",
      headerName: "Phone",
      renderCell: (row) => row.phone,
    },
    {
      field: "iban",
      headerName: "Iban",
      renderCell: (row) => row.iban,
    },
    {
      field: "customerCategory.code",
      headerName: "Customer Code",
      renderCell: (row) => row.customerCategory?.code || "-",
    },
    {
      field: "customerCategory.description",
      headerName: "Customer Description",
      renderCell: (row) => row.customerCategory?.description || "-",
    },
  ];

  // Config search field
  const searchFields: SearchField[] = [
    {
      name: "name",
      label: "Name",
      placeholder: "Name...",
      value: name,
      onChange: setName,
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Email...",
      value: email,
      onChange: setEmail,
    },
  ];

  // ✅ XML export function with metadata
  const handleExport = async () => {
    //isExporting(true);
    try {
      
      const filteredList = list.filter((customer) => {
        
        const matchName = name
          ? customer.name?.toLowerCase().includes(name.toLowerCase())
          : true;

        
        const matchEmail = email
          ? customer.email?.toLowerCase().includes(email.toLowerCase())
          : true;

        return matchName && matchEmail;
      });

      exportToXML(filteredList, {
        filename: `customers_${new Date().toISOString().split("T")[0]}.xml`,
        rootElement: "Customer",
        itemElement: "Customer",
        includeMetadata: true,
        companyName: "InfoMinds",
        exportedBy: "Fabio_Curci",
        version: "1.0",
      });

      alert(`Export complete! ${filteredList.length} record exported.`);
    } finally {
      //setIsExporting(false);
    }
  };

  return (
    <>
      <Header title="Customers" />

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
    </>
  );
}
