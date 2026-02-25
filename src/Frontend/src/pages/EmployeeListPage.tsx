import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
  tableCellClasses,
  CircularProgress,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { EmployeeListQuery } from "../types/employee";
import { useExportXML } from "../hooks/useExportXML";

const EMPLOYEES_API = "/api/employees";
const EMPLOYEES_LIST_API = `${EMPLOYEES_API}/list`;

export default function EmployeeListPage() {
  const [list, setList] = useState<EmployeeListQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  //XML export function
  const handleExportWithMetadata = () => {
    exportToXML(list, {
      filename: `employees_${new Date().toISOString().split("T")[0]}.xml`,
      rootElement: "Employees",
      itemElement: "Employee",
      includeMetadata: false, 
      companyName: "InfoMinds", 
      exportedBy: "Fabio_Curci", 
      version: "1.0", 
    });
  };

  return (
    <>
      <Typography variant="h4" sx={{ textAlign: "center", mt: 4, mb: 4 }}>
        Employees
      </Typography>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2, mt: 2, width: "100%" }}
      >
        <Stack direction="row" gap={2}>
          <TextField
            variant="outlined"
            placeholder="First Name..."
            label="First Name"
            size="small"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            variant="outlined"
            placeholder="Last Name..."
            label="Last Name"
            size="small"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </Stack>
        <Button
          variant="contained"
          onClick={handleExportWithMetadata}
          disabled={loading || list.length === 0 || isExporting}
        >
          {isExporting ? "Esportazione..." : "Export"}
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableHeadCell>Code</StyledTableHeadCell>
              <StyledTableHeadCell>FirstName</StyledTableHeadCell>
              <StyledTableHeadCell>LastName</StyledTableHeadCell>
              <StyledTableHeadCell>Address</StyledTableHeadCell>
              <StyledTableHeadCell>Email</StyledTableHeadCell>
              <StyledTableHeadCell>Phone</StyledTableHeadCell>
              <StyledTableHeadCell>Dep. Code</StyledTableHeadCell>
              <StyledTableHeadCell>Dep. Description</StyledTableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8}>
                  <Stack alignItems="center" sx={{ py: 6 }}>
                    <CircularProgress />
                  </Stack>
                </TableCell>
              </TableRow>
            ) : error ? ( 
              <TableRow>
                <TableCell colSpan={8}>
                  <Stack alignItems="center" spacing={2} sx={{ py: 6 }}>
                    <Typography variant="h6" color="text.secondary">
                      Oops, something went wrong
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Try reloading page
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : list.length === 0 ? (
              // No data
              <TableRow>
                <TableCell colSpan={8}>
                  <Stack alignItems="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">No data</Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : (
              list.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{row.code}</TableCell>
                  <TableCell>{row.firstName}</TableCell>
                  <TableCell>{row.lastName}</TableCell>
                  <TableCell>{row.address}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.department?.code}</TableCell>
                  <TableCell>{row.department?.description}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
  },
}));
