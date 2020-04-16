import { createStyles, Theme } from '@material-ui/core';

const LoadingPageStyle = (theme: Theme) => createStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        '& > *': {
            margin: theme.spacing(1)
        }
    },
});

export default LoadingPageStyle;