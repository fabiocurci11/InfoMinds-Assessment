import { TableRow, TableCell, Skeleton } from "@mui/material";

interface TableSkeletonProps {
  columnsCount: number;
  rowCount?: number;
}

export default function TableSkeleton({ columnsCount, rowCount = 5 }: TableSkeletonProps) {
  return (
    <>
      {Array.from(new Array(rowCount)).map((_, rowIndex) => (
        <TableRow key={`skeleton-row-${rowIndex}`}>
          {Array.from(new Array(columnsCount)).map((_, colIndex) => (
            <TableCell key={`skeleton-col-${colIndex}`}>
              <Skeleton 
                variant="text" 
                animation="wave" 
                width={colIndex % 2 === 0 ? "70%" : "50%"} 
                height={24} 
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}