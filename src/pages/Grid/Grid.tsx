import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from 'flotiq-components-react';

// :: Components
import { Button } from '../../components/Button/Button';

// :: Fetch
import { getBlogPosts } from './blog';

// :: Style
import './Grid.css';

const GridPage = () => {
    const [data, setData] = useState([]);
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
                Grid Home
            </Header>

            <hr className="my-5" />

            <Link to="/grid-react-table">
                <Button
                    label="Grid: React Table"
                    primary
                    backgroundColor={undefined}
                    size={undefined}
                    className="mr-5"
                />
            </Link>

            <Link to="/grid-react-suite">
                <Button
                    label="Grid: React Suite"
                    primary
                    backgroundColor={undefined}
                    size={undefined}
                    className="mr-5"
                />
            </Link>

            <div className="table-wrap"></div>
        </div>
    );
};

export default GridPage;
