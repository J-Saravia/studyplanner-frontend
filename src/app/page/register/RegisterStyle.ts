import { createStyles, Theme } from '@material-ui/core';

const RegisterStyle = (theme: Theme) => createStyles({
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(4),
        paddingTop: theme.spacing(2),
        backgroundColor: theme.palette.common.white,
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
    },
});

export default RegisterStyle;