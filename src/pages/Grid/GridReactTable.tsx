import React, { useState, useEffect } from 'react';
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    ColumnResizeMode,
} from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { Header } from 'flotiq-components-react';

// :: Components
import { Button } from '../../components/Button/Button';

// :: Fetch
import { getBlogPosts } from './blog';

// :: Config
// @ts-ignore
import { columns } from './gridReactTableConfig.tsx';

// :: Style
import './Grid.css';

const GridPage = () => {
    const [data, setData] = useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [columnResizeMode, setColumnResizeMode] = React.useState('onChange');
    const [orderDirection, setOrderDirection] = React.useState();
    const [orderBy, setOrderBy] = React.useState();
    const [pageCount, setPageCount] = React.useState();

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

    const pagination = React.useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize],
    );

    const table = useReactTable({
        data,
        columns,
        pageCount,
        // @ts-ignore
        columnResizeMode,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            columnVisibility,
            pagination,
        },
        onColumnVisibilityChange: setColumnVisibility,
        manualPagination: true,
        onPaginationChange: setPagination,
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
            pagination?.pageIndex + 1,
            pagination?.pageSize,
            filterStorage !== '' && '{' + filterStorage + '}',
            orderDirection,
            orderBy,
            '1',
        );
        setPageCount(res.total_pages);
        setData(res.data);
    };

    useEffect(() => {
        handleFetch();
    }, [filterInput, orderBy, orderDirection, pagination]);

    const handleFilter = (e, id) => {
        setFilterInput({ ...filterInput, [id]: e.target.value || '' });
    };

    const handleSort = (order, id) => {
        setOrderDirection(order);
        setOrderBy(id);
    };

    return (
        <div className="page-grid">
            <Header
                alignment="center"
                level={4}
                additionalClasses={['w-full text-white']}
            >
                Grid React Table
            </Header>

            <hr className="my-5" />

            <Link to="/grid">
                <Button
                    label="Grid"
                    primary={true}
                    backgroundColor={undefined}
                    size={undefined}
                    className="mr-5"
                />
            </Link>
            <Link to="/home">
                <Button
                    label="Home"
                    primary={true}
                    backgroundColor={undefined}
                    size={undefined}
                    className={undefined}
                />
            </Link>

            <hr className="my-5" />

            <Header
                alignment="center"
                level={4}
                additionalClasses={['w-full text-white']}
            >
                Table Options:
            </Header>
            <p>
                <a
                    href="https://tanstack.com/table/v8/docs/examples/react/column-dnd"
                    className="text-white hover:text-blue"
                >
                    Link: Example Column Drag & Drop
                </a>
            </p>

            <p>
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
            </p>

            <p>
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
                                                    checked:
                                                        column.getIsVisible(),
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
            </p>

            <hr className="my-5" />

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
                                            {header.isPlaceholder ? null : (
                                                <>
                                                    {flexRender(
                                                        header.column.columnDef
                                                            .header,
                                                        header.getContext(),
                                                    )}
                                                    {header.id !==
                                                        'headerImage' &&
                                                        header.id !==
                                                            'select' &&
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
                                                                    ↑
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
                                                                    ↓
                                                                </button>
                                                            </>
                                                        )}
                                                </>
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
                                                        <input
                                                            className="table-input"
                                                            onChange={(e) =>
                                                                handleFilter(
                                                                    e,
                                                                    header.id,
                                                                )
                                                            }
                                                        />
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
                                {[10, 20, 30].map((pageSize) => (
                                    <option key={pageSize} value={pageSize}>
                                        Show {pageSize}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GridPage;
