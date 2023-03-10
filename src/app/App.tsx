import React from 'react';
import './App.css';
import Page from './page/Page';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import MainTheme from './MainTheme';

function App() {
    return (
        <React.Suspense fallback={<div/>}>
            <BrowserRouter>
                <ThemeProvider theme={MainTheme}>
                    <CssBaseline/>
                    <Page/>
                </ThemeProvider>
            </BrowserRouter>
        </React.Suspense>
    );
}

export default App;
