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

export default function EmployeeListPage() {
  const [list, setList] = useState<EmployeeListQuery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/employees/list")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setList(data as EmployeeListQuery[]);
      })
      .finally(() => setLoading(false));
  }, []);

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
        <TextField
          variant="outlined"
          placeholder="First Name or Last Name..."
          id="outlined-basic"
          label="First Name or Last Name"
          size="small"
          sx={{ width: "20%" }}
        />
        <Button variant="contained">Export</Button>
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
            ) : list.length === 0 ? (
              //No data
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
