import { useState } from 'react';
import type { Column, Pagination } from '../utils/types';
import { classNames } from '../utils/classNames';

type ThemeConfig = {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    borderRadius: string;
    spacing: {
        small: string;
        medium: string;
        large: string;
    };
};

type FeatureConfig = {
    showPagination: boolean;
    allowSorting: boolean;
    showSearch: boolean;
    exportData: boolean;
    rowActions?: string[];
};

export function DataTable<T extends Record<string, any>>({
    data,
    columns,
    onSort,
    pagination,
    onPageChange,
    theme,
    features,
    loading = false,
    emptyMessage = 'No data',
}: {
    data: T[];
    columns: Column<T>[];
    onSort?: (key: string, direction: 'asc' | 'desc' | null) => void;
    pagination?: Pagination;
    onPageChange?: (page: number) => void;
    theme: ThemeConfig;
    features: FeatureConfig;
    loading?: boolean;
    emptyMessage?: string;
}) {
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<'asc' | 'desc' | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSort = (key: string) => {
        if (!features.allowSorting) return;
        if (sortKey !== key) {
            setSortKey(key);
            setSortDir('asc');
            onSort?.(key, 'asc');
        } else if (sortDir === 'asc') {
            setSortDir('desc');
            onSort?.(key, 'desc');
        } else {
            setSortKey(null);
            setSortDir(null);
            onSort?.(key, null);
        }
    };

    const filteredData = features.showSearch
        ? data.filter((row) =>
            Object.values(row).some((val) =>
                String(val).toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
        : data;

    return (
        <div
            className="w-full overflow-x-auto rounded-md shadow-sm"
            style={{ fontFamily: theme.fontFamily }}
        >
            {/* Search Bar */}
            {features.showSearch && (
                <div style={{ marginBottom: theme.spacing.medium }}>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            padding: theme.spacing.small,
                            borderRadius: theme.borderRadius,
                            border: `1px solid ${theme.secondaryColor}`,
                            width: '100%',
                        }}
                    />
                </div>
            )}

            <table className="min-w-full divide-y divide-gray-200">
                <thead style={{ backgroundColor: theme.primaryColor, color: 'white' }}>
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                scope="col"
                                className={classNames(
                                    'px-4 py-3 text-left text-xs font-medium uppercase tracking-wider select-none',
                                    features.allowSorting && col.sortable ? 'cursor-pointer' : ''
                                )}
                                onClick={() => col.sortable && handleSort(col.key)}
                                aria-sort={
                                    sortKey === col.key
                                        ? sortDir === 'asc'
                                            ? 'ascending'
                                            : 'descending'
                                        : 'none'
                                }
                            >
                                <div className="flex items-center gap-2">
                                    <span>{col.label}</span>
                                    {features.allowSorting && col.sortable && sortKey === col.key && (
                                        <span className="text-xs">
                                            {sortDir === 'asc' ? '▲' : '▼'}
                                        </span>
                                    )}
                                </div>
                            </th>
                        ))}
                        {features.rowActions?.length ? (
                            <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider">
                                Actions
                            </th>
                        ) : null}
                    </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-100">
                    {loading ? (
                        Array.from({ length: pagination?.pageSize ?? 5 }).map((_, i) => (
                            <tr key={`skeleton-${i}`}>
                                {columns.map((_, idx) => (
                                    <td key={idx} className="px-4 py-4">
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : filteredData.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length + (features.rowActions?.length ? 1 : 0)}
                                className="px-4 py-8 text-center text-sm text-gray-500"
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        filteredData.map((row, i) => (
                            <tr key={(row.id as string) ?? i} className="hover:bg-gray-50">
                                {columns.map((col) => (
                                    <td
                                        key={col.key}
                                        className={classNames('px-4 py-3 align-top', col.className)}
                                    >
                                        {col.render ? col.render(row) : String(row[col.key])}
                                    </td>
                                ))}
                                {features.rowActions?.length ? (
                                    <td className="px-4 py-3">
                                        {features.rowActions.map((action) => (
                                            <button
                                                key={action}
                                                style={{
                                                    backgroundColor: theme.secondaryColor,
                                                    color: 'white',
                                                    padding: theme.spacing.small,
                                                    borderRadius: theme.borderRadius,
                                                    marginRight: theme.spacing.small,
                                                    border: 'none',
                                                }}
                                            >
                                                {action}
                                            </button>
                                        ))}
                                    </td>
                                ) : null}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            {features.showPagination && pagination && (
                <div
                    className="flex items-center justify-between p-3 border-t"
                    style={{ backgroundColor: theme.spacing.large }}
                >
                    <div className="text-sm" style={{ color: theme.secondaryColor }}>
                        Showing{' '}
                        <strong>
                            {Math.min(
                                (pagination.page - 1) * pagination.pageSize + 1,
                                pagination.total
                            )}
                        </strong>{' '}
                        to{' '}
                        <strong>
                            {Math.min(
                                pagination.page * pagination.pageSize,
                                pagination.total
                            )}
                        </strong>{' '}
                        of <strong>{pagination.total}</strong>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            style={{
                                backgroundColor: theme.primaryColor,
                                color: 'white',
                                borderRadius: theme.borderRadius,
                                padding: theme.spacing.small,
                                border: 'none',
                            }}
                            onClick={() => onPageChange?.(Math.max(1, pagination.page - 1))}
                            disabled={pagination.page <= 1}
                        >
                            Prev
                        </button>
                        <div className="px-3 py-1 border rounded">{pagination.page}</div>
                        <button
                            style={{
                                backgroundColor: theme.primaryColor,
                                color: 'white',
                                borderRadius: theme.borderRadius,
                                padding: theme.spacing.small,
                                border: 'none',
                            }}
                            onClick={() =>
                                onPageChange?.(
                                    Math.min(
                                        Math.ceil(pagination.total / pagination.pageSize),
                                        pagination.page + 1
                                    )
                                )
                            }
                            disabled={
                                pagination.page >=
                                Math.ceil(pagination.total / pagination.pageSize)
                            }
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Export Button */}
            {features.exportData && (
                <div style={{ marginTop: theme.spacing.medium }}>
                    <button
                        style={{
                            backgroundColor: theme.primaryColor,
                            color: 'white',
                            borderRadius: theme.borderRadius,
                            padding: theme.spacing.small,
                            border: 'none',
                        }}
                    >
                        Export CSV
                    </button>
                </div>
            )}
        </div>
    );
}
