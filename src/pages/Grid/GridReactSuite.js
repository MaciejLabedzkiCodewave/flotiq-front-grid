import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from 'flotiq-components-react';
import { Table, Checkbox, Pagination, TagPicker } from 'rsuite';

// :: Components
import { Button } from '../../components/Button/Button';

// :: Fetch
import { getBlogPosts } from './blog';

// :: Style
import './GridReactSuite.css';

const { Column, HeaderCell, Cell } = Table;

const CheckCell = ({ rowData, onChange, checkedKeys, dataKey, ...props }) => (
    <Cell {...props} style={{ padding: 0 }}>
        <div style={{ lineHeight: '46px' }}>
            <Checkbox
                value={rowData[dataKey]}
                inline
                onChange={onChange}
                checked={checkedKeys.some((item) => item === rowData[dataKey])}
            />
        </div>
    </Cell>
);

const SortComponent = ({ sortKey, handleSort }) => {
    return (
        <>
            <button
                className="table-sort-button"
                onClick={() => handleSort('asc', sortKey)}
            >
                ↑
            </button>
            <button
                className="table-sort-button"
                onClick={() => handleSort('desc', sortKey)}
            >
                ↓
            </button>
        </>
    );
};

const DEF_COL = [
    {
        id: 'id',
        name: 'Id',
        width: 300,
        align: 'left',
        search: true,
        sort: true,
    },
    {
        id: 'slug',
        name: 'Slug',
        width: 300,
        align: 'left',
        search: true,
        sort: true,
    },
    {
        id: 'title',
        name: 'Title',
        width: 300,
        align: 'left',
        search: true,
        sort: true,
    },
    {
        id: 'headerImage',
        cellId: 'headerImage[0].id',
        name: 'headerImage',
        width: 300,
        search: true,
        sort: false,
    },
    { id: 'action', name: 'Action', width: 100, cellData: '✎ ⎘' },
];

const GridPage = () => {
    const [checkedKeys, setCheckedKeys] = React.useState([]);
    const [data, setData] = useState([]);
    const [orderDirection, setOrderDirection] = React.useState();
    const [orderBy, setOrderBy] = React.useState();
    const [pageCount, setPageCount] = React.useState();
    const [limit, setLimit] = React.useState(10);
    const [page, setPage] = React.useState(1);
    const [columns, setColumns] = React.useState(DEF_COL);
    const [columnKeys, setColumnKeys] = React.useState(
        columns.map((column) => column.id),
    );

    const columnsVisible = columns.filter((column) =>
        columnKeys.some((key) => key === column.id),
    );

    let checked = false;
    let indeterminate = false;

    if (checkedKeys.length === data.length) {
        checked = true;
    } else if (checkedKeys.length === 0) {
        checked = false;
    } else if (checkedKeys.length > 0 && checkedKeys.length < data.length) {
        indeterminate = true;
    }

    const [pageTotal, setPageTotal] = React.useState(1);

    // const dataFiltered = data.filter((v, i) => {
    //     const start = limit * (page - 1);
    //     const end = start + limit;
    //     return i >= start && i < end;
    // });

    const handleCheckAll = (value, checked) => {
        const keys = checked ? data.map((item) => item.id) : [];
        setCheckedKeys(keys);
    };
    const handleCheck = (value, checked) => {
        const keys = checked
            ? [...checkedKeys, value]
            : checkedKeys.filter((item) => item !== value);
        setCheckedKeys(keys);
    };

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

        setPageTotal(res.total_count);
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

    const handleChangeLimit = (dataKey) => {
        setPage(1);
        setLimit(dataKey);
        setPagination({
            pageIndex: 0,
            pageSize: dataKey,
        });
    };

    const handleChangePage = (page) => {
        setPage(page);
        setPagination({
            pageIndex: page - 1,
            pageSize: pageSize,
        });
    };

    const handleOnResize = (a, b) => {
        const updateColumns = DEF_COL;

        for (var key in updateColumns) {
            if (updateColumns[key].id === b) {
                updateColumns[key].width = a;
            }
        }
        setColumns(updateColumns);
    };

    return (
        <div className="page-grid">
            <Header
                alignment="center"
                level={4}
                additionalClasses={['w-full text-white']}
            >
                Grid Suite
            </Header>
            <hr className="my-5" />
            <Link to="/grid">
                <Button
                    label="Grid"
                    primary
                    backgroundColor={undefined}
                    size={undefined}
                    className={undefined}
                />
            </Link>
            <hr className="my-5" />
            <p>
                <a
                    href="https://rsuitejs.com/components/table/#fluid"
                    target="_blank"
                    rel="noreferrer"
                >
                    Link: Table Fluid
                </a>
            </p>
            <p className="text-white">
                Note: After setting flexGrow, you cannot set the width and
                resizable properties. You can set a minimum width by minwidth.
            </p>
            <p>
                <a
                    href="https://codesandbox.io/s/rsuite5-table-with-react-dnd15-ttrsck"
                    target="_blank"
                    rel="noreferrer"
                >
                    Link: Table Column Drag and Drop (codesandbox)
                </a>
            </p>
            <hr className="my-5" />
            <Header
                alignment="center"
                level={4}
                additionalClasses={['w-full text-white']}
            >
                Table Options
            </Header>

            <div className="text-white">Columns Toggle：</div>
            <TagPicker
                data={columns}
                labelKey="name"
                valueKey="id"
                value={columnKeys}
                onChange={setColumnKeys}
                cleanable={false}
            />
            <hr className="my-5" />
            <div className="rs-table-wrap">
                <Table height={450} data={data} width={1450}>
                    <Column width={50} align="center">
                        <HeaderCell style={{ padding: 0 }}>
                            <div style={{ lineHeight: '40px' }}>
                                <Checkbox
                                    inline
                                    checked={checked}
                                    indeterminate={indeterminate}
                                    onChange={handleCheckAll}
                                />
                            </div>
                        </HeaderCell>
                        <CheckCell
                            dataKey="id"
                            checkedKeys={checkedKeys}
                            onChange={handleCheck}
                        />
                    </Column>

                    {columnsVisible.map((column) => (
                        <Column
                            width={column.width}
                            key={column.id}
                            flexGrow={column.flexGrow}
                            align={column.align}
                            resizable
                            onResize={(columnWidth, dataKey) =>
                                handleOnResize(columnWidth, dataKey)
                            }
                        >
                            <HeaderCell>
                                {column.name}

                                {column.sort && (
                                    <SortComponent
                                        sortKey={column.id}
                                        handleSort={handleSort}
                                    />
                                )}

                                <input
                                    className=""
                                    value={filterInput[column.id]}
                                    onChange={(e) => handleFilter(e, column.id)}
                                />
                            </HeaderCell>
                            <Cell dataKey={column.cellId || column.id}>
                                {column.cellData}
                            </Cell>
                        </Column>
                    ))}
                </Table>
            </div>
            <div style={{ padding: 20 }} className="rs-table-pagination">
                <Pagination
                    prev
                    next
                    first
                    last
                    ellipsis
                    boundaryLinks
                    maxButtons={5}
                    size="xs"
                    layout={['total', '-', 'limit', '|', 'pager', 'skip']}
                    total={pageTotal}
                    limitOptions={[5, 10, 15, 30]}
                    limit={limit}
                    activePage={page}
                    onChangePage={handleChangePage}
                    onChangeLimit={handleChangeLimit}
                />
            </div>
        </div>
    );
};

export default GridPage;
