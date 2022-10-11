import { createColumnHelper } from '@tanstack/react-table';
import React, { HTMLProps } from 'react';

type Person = {
    id: string;
    title: string;
    slug: string;
    headerImage: boolean;
    actions: boolean;
};

export const DefaultData: Person[] = [
    {
        id: 'tanner',
        slug: 'linsley',
        title: 'In Relationship',
        headerImage: true,
        actions: true,
    },
    {
        id: 'tandy',
        slug: 'miller',
        title: 'Single',
        headerImage: true,
        actions: true,
    },
    {
        id: 'joe',
        slug: 'dirte',
        title: 'Complicated',
        headerImage: true,
        actions: true,
    },
];

const columnHelper = createColumnHelper<Person>();

// eslint-disable-next-line
function IndeterminateCheckbox({
    indeterminate,
    className = '',
    ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
    const ref = React.useRef<HTMLInputElement>(null!);

    React.useEffect(() => {
        if (typeof indeterminate === 'boolean') {
            ref.current.indeterminate = !rest.checked && indeterminate;
        }
    }, [ref, indeterminate]);

    return (
        <input
            type="checkbox"
            ref={ref}
            className={className + ' cursor-pointer'}
            {...rest}
        />
    );
}

export const columns = [
    {
        id: 'select',
        size: 20,
        // minSize: 20,
        // maxSize: 20,
        header: ({ table }) => (
            <IndeterminateCheckbox
                {...{
                    checked: table.getIsAllRowsSelected(),
                    indeterminate: table.getIsSomeRowsSelected(),
                    onChange: table.getToggleAllRowsSelectedHandler(),
                }}
            />
        ),
        cell: ({ row }) => (
            <div className="px-1">
                <IndeterminateCheckbox
                    {...{
                        checked: row.getIsSelected(),
                        indeterminate: row.getIsSomeSelected(),
                        onChange: row.getToggleSelectedHandler(),
                    }}
                />
            </div>
        ),
    },
    columnHelper.accessor('id', {
        size: 100,
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
    }),
    columnHelper.accessor('slug', {
        size: 50,
        // minSize: 100,
        // maxSize: 100,
        header: () => 'slug',
        cell: (info) => info.renderValue(),
        footer: (info) => info.column.id,
    }),
    columnHelper.accessor('title', {
        header: () => 'Title',
        cell: (info) => info.renderValue(),
        footer: (info) => info.column.id,
    }),
    columnHelper.accessor('headerImage', {
        header: () => <span>headerImage</span>,
        cell: (info) => info.renderValue()?.[0]?.id,
        footer: (info) => info.column.id,
    }),
    columnHelper.accessor('actions', {
        header: 'actions',
        cell: (info) => '(E) (O)',
        footer: (info) => info.column.id,
    }),
];
