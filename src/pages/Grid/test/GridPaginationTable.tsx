import React, { useState, useEffect } from 'react';
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    ColumnResizeMode,
    ColumnOrderState,
} from '@tanstack/react-table';

import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { getBlogPosts } from './blog';
import config from './config';
// @ts-ignore
import { columns } from './tableConfig.tsx';

// :: Style
import './Grid.css';

const reorderColumn = (draggedColumnId, targetColumnId, columnOrder) => {
    columnOrder.splice(
        columnOrder.indexOf(targetColumnId),
        0,
        columnOrder.splice(
            columnOrder.indexOf(draggedColumnId),
            1,
        )[0] as string,
    );
    return [...columnOrder];
};

const DraggableColumnHeader = ({ header, table }) => {
    const { getState, setColumnOrder } = table;
    const { columnOrder } = getState();
    const { column } = header;

    const [, dropRef] = useDrop({
        accept: 'column',
        drop: (draggedColumn) => {
            const newColumnOrder = reorderColumn(
                draggedColumn.id,
                column.id,
                columnOrder,
            );
            setColumnOrder(newColumnOrder);
        },
    });

    const [{ isDragging }, dragRef, previewRef] = useDrag({
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        item: () => column,
        type: 'column',
    });

    return (
        <th
            ref={dropRef}
            colSpan={header.colSpan}
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            <div ref={previewRef}>
                {header.isPlaceholder
                    ? null
                    : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                      )}
                <button ref={dragRef}>🟰</button>
            </div>
        </th>
    );
};

const GridPage = () => {
    const [data, setData] = useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});

    const [columnResizeMode, setColumnResizeMode] = React.useState('onChange');

    const [columnOrder, setColumnOrder] = React.useState(
        columns.map((column) => column.id),
    );

    const [orderDirection, setOrderDirection] = React.useState();
    const [orderBy, setOrderBy] = React.useState();

    const [filterInput, setFilterInput] = React.useState({
        id: '',
        slug: '',
        title: '',
        headerImage: '',
    });

    const [{ pageIndex, pageSize }, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const table = useReactTable({
        data,
        columns,
        // @ts-ignore
        columnResizeMode,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            columnVisibility,
        },
        onColumnVisibilityChange: setColumnVisibility,
    });

    const optionTable = {
        pagination: true,
        footer: false,
        columnToggle: true,
    };

    const handleFetch = async () => {
        let filterStorage = '';

        for (let key in filterInput) {
            if (filterInput[key]) {
                let item = `"${key}":{"type":"contains", "filter": "${filterInput[key]}"}`;
                if (filterStorage) {
                    filterStorage += ',';
                }
                filterStorage += item;
            }
        }

        const res = await getBlogPosts(
            1,
            config.blog.postPerPage,
            filterStorage !== '' && '{' + filterStorage + '}',
            orderDirection,
            orderBy,
            '1',
        );

        setData(res.data);
    };

    useEffect(() => {
        handleFetch();
    }, [filterInput, orderBy, orderDirection]);

    const handleFilter = (e, id) => {
        setFilterInput({ ...filterInput, [id]: e.target.value || '' });
    };

    const handleSort = (order, id) => {
        setOrderDirection(order);
        setOrderBy(id);
    };

    return (
        <div className="page-grid">
            <div className="table-wrap">
                <table>
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <>
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            {...{
                                                key: header.id,
                                                style: {
                                                    width: header.getSize(),
                                                },
                                            }}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                            <div
                                                {...{
                                                    onMouseDown:
                                                        header.getResizeHandler(),
                                                    onTouchStart:
                                                        header.getResizeHandler(),
                                                    className: `resizer ${
                                                        header.column.getIsResizing()
                                                            ? 'isResizing'
                                                            : ''
                                                    }`,
                                                    style: {
                                                        transform:
                                                            columnResizeMode ===
                                                                'onEnd' &&
                                                            header.column.getIsResizing()
                                                                ? `translateX(${
                                                                      table.getState()
                                                                          .columnSizingInfo
                                                                          .deltaOffset
                                                                  }px)`
                                                                : '',
                                                    },
                                                }}
                                            />
                                        </th>
                                    ))}
                                </tr>
                                <tr key={headerGroup.id + 'select-group'}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            {...{
                                                key: header.id + 'select',
                                                style: {
                                                    width: header.getSize(),
                                                },
                                            }}
                                        >
                                            <div>
                                                {header.id !== 'select' &&
                                                    header.id !== 'actions' && (
                                                        <>
                                                            <input
                                                                className="table-input"
                                                                onChange={(e) =>
                                                                    handleFilter(
                                                                        e,
                                                                        header.id,
                                                                    )
                                                                }
                                                            ></input>
                                                            {header.id !==
                                                                'headerImage' &&
                                                                header.id !==
                                                                    'actions' && (
                                                                    <>
                                                                        <button
                                                                            className="table-sort-button"
                                                                            onClick={() =>
                                                                                handleSort(
                                                                                    'asc',
                                                                                    header.id,
                                                                                )
                                                                            }
                                                                        >
                                                                            ASC
                                                                        </button>
                                                                        <button
                                                                            className="table-sort-button"
                                                                            onClick={() =>
                                                                                handleSort(
                                                                                    'desc',
                                                                                    header.id,
                                                                                )
                                                                            }
                                                                        >
                                                                            DESC
                                                                        </button>
                                                                    </>
                                                                )}
                                                        </>
                                                    )}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                    <tfoot hidden={!optionTable.footer}>
                        {table.getFooterGroups().map((footerGroup) => (
                            <tr key={footerGroup.id}>
                                {footerGroup.headers.map((header) => (
                                    <th key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .footer,
                                                  header.getContext(),
                                              )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </tfoot>
                </table>

                {optionTable.pagination && (
                    <div className="table-pagination">
                        <div className="flex items-center gap-2">
                            <button
                                className="border rounded p-1"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                {'<<'}
                            </button>
                            <button
                                className="border rounded p-1"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                {'<'}
                            </button>
                            <button
                                className="border rounded p-1"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                {'>'}
                            </button>
                            <button
                                className="border rounded p-1"
                                onClick={() =>
                                    table.setPageIndex(table.getPageCount() - 1)
                                }
                                disabled={!table.getCanNextPage()}
                            >
                                {'>>'}
                            </button>
                            <span className="flex items-center gap-1">
                                <div>Page</div>
                                <strong>
                                    {table.getState().pagination.pageIndex + 1}{' '}
                                    of {table.getPageCount()}
                                </strong>
                            </span>
                            <span className="flex items-center gap-1">
                                | Go to page:
                                <input
                                    type="number"
                                    defaultValue={
                                        table.getState().pagination.pageIndex +
                                        1
                                    }
                                    onChange={(e) => {
                                        const page = e.target.value
                                            ? Number(e.target.value) - 1
                                            : 0;
                                        table.setPageIndex(page);
                                    }}
                                    className="border p-1 rounded w-16"
                                />
                            </span>
                            <select
                                value={table.getState().pagination.pageSize}
                                onChange={(e) => {
                                    table.setPageSize(Number(e.target.value));
                                }}
                            >
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <option key={pageSize} value={pageSize}>
                                        Show {pageSize}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </div>
            <select
                value={columnResizeMode}
                onChange={(e) =>
                    setColumnResizeMode(e.target.value as ColumnResizeMode)
                }
                className="border p-2 border-black rounded"
            >
                <option value="onEnd">Resize: "onEnd"</option>
                <option value="onChange">Resize: "onChange"</option>
            </select>
            {optionTable.columnToggle && (
                <div className="inline-block border border-black shadow rounded table-visibility">
                    <div className="px-1 border-b border-black">
                        <label>
                            <input
                                {...{
                                    type: 'checkbox',
                                    checked: table.getIsAllColumnsVisible(),
                                    onChange:
                                        table.getToggleAllColumnsVisibilityHandler(),
                                }}
                            />{' '}
                            Toggle All
                        </label>
                    </div>
                    <div className="grid">
                        {table.getAllLeafColumns().map((column) => {
                            return (
                                <div
                                    key={column.id}
                                    className="px-1 table-visibility-option"
                                >
                                    <label>
                                        <input
                                            {...{
                                                type: 'checkbox',
                                                checked: column.getIsVisible(),
                                                onChange:
                                                    column.getToggleVisibilityHandler(),
                                            }}
                                        />{' '}
                                        {column.id}
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GridPage;
