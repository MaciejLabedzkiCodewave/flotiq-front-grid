import React from 'react';
import PropTypes from 'prop-types';

export const Panel = ({ title, spaceless = false, children }) => (
    <div
        className={[
            'max-w-lg overflow-hidden text-left',
            spaceless ? '' : 'bg-white rounded',
        ].join(' ')}
    >
        <div className={spaceless ? '' : 'px-7 py-7'}>
            <div className="font-bold font-header text-xl text-blue-dark mb-6">
                {title}
            </div>
            <div className="text-blue text-base">{children}</div>
        </div>
    </div>
);

Panel.propTypes = {
    title: PropTypes.string,
    spaceless: PropTypes.bool,
    children: PropTypes.any,
};
