import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  TextField,
  Button,
  CircularProgress,
  Typography,
  styled,
} from "@mui/material";
import { BaseEntity, TableColumn, DataTableConfig } from "../types/table";

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
}));

interface DataTableProps<T extends BaseEntity> {
  columns: TableColumn<T>[];
  data: T[];
  loading: boolean;
  error?: boolean | string;
  config?: DataTableConfig;
}

export default function DataTable<T extends BaseEntity>({
  columns,
  data,
  loading = false,
  error = false,
  config,
}: DataTableProps<T>) {
  const {
    showSearch = false,
    searchFields = [],
    showExport = false,
    onExport,
    exportLabel = "Export",
    isExporting = false,
  } = config || {};

  return (
    <>
      {/* Search and Export Section */}
      {(showSearch || showExport) && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2, mt: 2, width: "100%" }}
        >
          {/* Search Fields */}
          {showSearch && (
            <Stack direction="row" gap={2}>
              {searchFields.map((field) => (
                <TextField
                  key={field.name}
                  variant="outlined"
                  placeholder={field.placeholder}
                  label={field.label}
                  size="small"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              ))}
            </Stack>
          )}

          {/* Export Button */}
          {showExport && (
            <Button
              variant="contained"
              onClick={onExport}
              disabled={loading || data.length === 0 || isExporting}
              sx={{ ml: showSearch ? 0 : "auto" }}
            >
              {isExporting ? "Exporting..." : exportLabel}
            </Button>
          )}
        </Stack>
      )}

      {/* Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="data table">
          {/* Header */}
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <StyledTableHeadCell key={column.field}>
                  {column.headerName}
                </StyledTableHeadCell>
              ))}
            </TableRow>
          </TableHead>

          {/* Body */}
          <TableBody>
            {/* Loading State */}
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <Stack alignItems="center" sx={{ py: 6 }}>
                    <CircularProgress />
                  </Stack>
                </TableCell>
              </TableRow>
            ) : /* Error State */ error ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
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
            ) : /* No Data */ data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <Stack alignItems="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">No data</Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : (
              /* Data Rows */
              data.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {columns.map((column) => (
                    <TableCell key={column.field}>
                      {
                        column.renderCell
                          ? column.renderCell(row)
                          : ((row[column.field as keyof T] ??
                              "-") as React.ReactNode)
                      }
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
