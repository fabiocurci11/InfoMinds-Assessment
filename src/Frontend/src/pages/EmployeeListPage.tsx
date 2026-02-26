import { useEffect, useState } from "react";
import { EmployeeListQuery } from "../types/employee";
import { useExportXML } from "../hooks/useExportXML";
import DataTable from "../components/DataTable";
import { SearchField, TableColumn } from "../types/table";
import Header from "../components/ui/Header";

const EMPLOYEES_API: string = "/api/employees";
const EMPLOYEES_LIST_API: string = `${EMPLOYEES_API}/list`;

export default function EmployeeListPage() {
  const [list, setList] = useState<EmployeeListQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean | string>(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const { exportToXML, isExporting } = useExportXML<EmployeeListQuery>();

  //API return all employees
  useEffect(() => {
    fetch(EMPLOYEES_LIST_API)
      .then((response) => {
        if (!response.ok) throw new Error(`Errore: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        setList(data as EmployeeListQuery[]);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  //API get searched employees
  //todo: edit BE search for optimize UX/UI experience
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const queryParams = new URLSearchParams();
      if (firstName) queryParams.append("FirstName", firstName);
      if (lastName) queryParams.append("LastName", lastName);

      const queryString = queryParams.toString();
      const url = `${EMPLOYEES_LIST_API}${queryString ? `?${queryString}` : ""}`;
      console.log(url);

      fetch(url)
        .then((response) => response.json())
        .then((data) => setList(data as EmployeeListQuery[]))
        .finally(() => setLoading(false));
    }, 500);

    return () => clearTimeout(timer);
  }, [firstName, lastName]);

  const columns: TableColumn<EmployeeListQuery>[] = [
    {
      field: "code",
      headerName: "Code",
      renderCell: (row) => row.code,
    },
    {
      field: "firstName",
      headerName: "FirstName",
      renderCell: (row) => row.firstName,
    },
    {
      field: "lastName",
      headerName: "LastName",
      renderCell: (row) => row.lastName,
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
      field: "department.code",
      headerName: "Dep. Code",
      renderCell: (row) => row.department?.code || "-",
    },
    {
      field: "department.description",
      headerName: "Dep. Description",
      renderCell: (row) => row.department?.description || "-",
    },
  ];

  // Config search field
  const searchFields: SearchField[] = [
    {
      name: "firstName",
      label: "First Name",
      placeholder: "First Name...",
      value: firstName,
      onChange: setFirstName,
    },
    {
      name: "lastName",
      label: "Last Name",
      placeholder: "Last Name...",
      value: lastName,
      onChange: setLastName,
    },
  ];

  // ✅ XML export function with metadata
  const handleExport = async () => {
    //isExporting(true);
    try {
      // Filtra la lista in base ai criteri di ricerca (opzionale)
      const filteredList = list.filter((employee) => {
        // Se firstName della ricerca esiste, controlla il match, altrimenti passa true
        const matchFirstName = firstName
          ? employee.firstName?.toLowerCase().includes(firstName.toLowerCase())
          : true;

        // Stessa logica per lastName
        const matchLastName = lastName
          ? employee.lastName?.toLowerCase().includes(lastName.toLowerCase())
          : true;

        return matchFirstName && matchLastName;
      });

      exportToXML(filteredList, {
        filename: `employees_${new Date().toISOString().split("T")[0]}.xml`,
        rootElement: "Employees",
        itemElement: "Employee",
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
      <Header title="Employees" />

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
