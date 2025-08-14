import type { ReactNode } from "react";

export type Column<T> = {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
  className?: string;
};

export type Pagination = {
  page: number;
  pageSize: number;
  total: number;
};

export type CommonProps = {
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  onChange?: (value: any) => void;
  id?: string;
};
