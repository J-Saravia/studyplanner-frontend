import { createMuiTheme, darken, lighten } from '@material-ui/core';

const MainTheme = createMuiTheme({
    palette: {
        primary: {
            main: "#1976d2",
            light: lighten("#1976d2"),
            dark: darken("#1976d2"),
        },
    }
});

export default MainTheme;