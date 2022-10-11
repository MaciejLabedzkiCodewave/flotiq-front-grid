import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Button/Button';

const Page404 = () => {
    return (
        <div className="App">
            <header className="App-header">
                Page 404
                <Link to="/landing">
                    <Button label="Landing" primary />
                </Link>
                <Link to="/home">
                    <Button label="Home" primary />
                </Link>
            </header>
        </div>
    );
};

export default Page404;
