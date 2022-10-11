import React, { useContext } from 'react';
import { Header } from 'flotiq-components-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Button/Button';

// :: Component
import { SocialsPanel } from '../../components/SocialsPanel/SocialsPanel';

// Context
import { AppContext } from '../../contexts/AppContext';

// :: Images
import logo from '../../images/logo.svg';

// :: Style
import './Home.css';

const App = () => {
    const { appContext, updateAppContext } = useContext(AppContext);

    const handleUpdate = () => {
        updateAppContext({
            ...appContext,
            language: 'fr ' + (Math.random() * 100).toFixed(2),
        });
    };
    return (
        <div className="App">
            <header className="App-header">
                <Header
                    alignment="center"
                    level={4}
                    additionalClasses={['w-full']}
                >
                    Page: Home
                </Header>

                <Link to="/landing">
                    <Button label="Landing" primary />
                </Link>
                <Link to="/grid">
                    <Button label="Grid" primary />
                </Link>
                <Link to="/page-no-exist">
                    <Button label="Page 404" primary />
                </Link>

                <img src={logo} className="App-logo" alt="logo" />

                <p className="text-2xl font-bold">Context:</p>
                <span className="text-sm">
                    Full name: {appContext.fullName}
                </span>
                <span className="text-sm">Language: {appContext.language}</span>

                <Button
                    label="Context Language Update"
                    primary
                    onClick={handleUpdate}
                    className="my-4"
                />

                <p className="text-2xl font-bold my-2">
                    Component Socials Panel:
                </p>
                <SocialsPanel />
            </header>
        </div>
    );
};

export default App;
