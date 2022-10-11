import React, { useState, useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppContext } from '../../contexts/AppContext';
import AppRouter from '../../router/AppRouter';

// :: Style
import './App.css';

const INITIAL_STATE = {
    fullName: 'Flotiq Page',
    language: 'en',
};

const App = () => {
    const [appContext, setAppContext] = useState(INITIAL_STATE);

    const providerValue = useMemo(
        () => ({ appContext, updateAppContext: setAppContext }),
        [appContext],
    );

    return (
        <BrowserRouter basename="/">
            <AppContext.Provider value={providerValue}>
                <AppRouter />
            </AppContext.Provider>
        </BrowserRouter>
    );
};

export default App;
