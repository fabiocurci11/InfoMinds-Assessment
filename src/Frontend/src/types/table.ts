// types/index.ts
export interface TableColumn<T = unknown> {
  field: string;
  headerName: string;
  renderCell: (row: T) => React.ReactNode;
}

export interface BaseEntity {
  id: number;
}

export interface SearchField {
  name: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export interface DataTableConfig {
  showSearch?: boolean;
  searchFields?: SearchField[];
  showExport?: boolean;
  onExport?: () => void;
  exportLabel?: string;
  isExporting?: boolean;
  exportMetadata?: Record<string, unknown>; 
}




