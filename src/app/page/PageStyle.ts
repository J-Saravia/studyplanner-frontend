import { createStyles, Theme } from '@material-ui/core';

const PageStyle = (theme: Theme) => createStyles({
    root: {
        display: 'flex',
        height: '100%',
        alignItems: 'stretch'
    },
    content: {
        flexGrow: 1,
        height: '100%',
        overflow: 'auto',
        padding: theme.spacing(1),
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
    },
});

export default PageStyle;