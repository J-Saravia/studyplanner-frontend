import React from 'react';
import './App.css';
import Page from './page/Page';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import MainTheme from './MainTheme';

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider theme={MainTheme}>
                <CssBaseline />
                <Page />
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
