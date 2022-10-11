import React from 'react';
import { Header } from 'flotiq-components-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Button/Button';

// :: Images
import logo from '../../images/logo.svg';

// :: Style
import './Landing.css';

const Landing = () => (
    <div className="App">
        <header className="App-header">
            <Header alignment="center" level={4} additionalClasses={['w-full']}>
                Page: Landing
            </Header>

            <Link to="/home">
                <Button label="Home" primary />
            </Link>

            <Link to="/page-no-exist">
                <Button label="Page 404" primary />
            </Link>

            <img src={logo} className="App-logo" alt="logo" />
        </header>
    </div>
);

export default Landing;
