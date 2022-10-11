import React from 'react';
import { Routes, Route } from 'react-router-dom';

// :: Pages
import PageHome from '../pages/Home/Home';
import Page404 from '../pages/Page404/Page404';
import PageLanding from '../pages/Landing/Landing';
import PageGrid from '../pages/Grid/Grid.tsx';
import PageGridReactTable from '../pages/Grid/GridReactTable.tsx';
import PageGridReactSuite from '../pages/Grid/GridReactSuite.js';

const AppRouter = () => (
    <Routes>
        <Route path="/home" element={<PageHome />} />
        <Route path="/landing" element={<PageLanding />} />
        <Route path="/grid" element={<PageGrid />} />
        <Route path="/grid-react-table" element={<PageGridReactTable />} />
        <Route path="/grid-react-suite" element={<PageGridReactSuite />} />
        <Route path="/" element={<PageHome />} />
        <Route path="*" element={<Page404 />} />
    </Routes>
);

export default AppRouter;
