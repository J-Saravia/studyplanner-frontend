import { createStyles, Theme } from '@material-ui/core';

const RegisterStyle = (theme: Theme) => createStyles({
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding:theme.spacing(4),
        paddingTop: theme.spacing(2),
        backgroundColor: theme.palette.common.white,
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
});

export default RegisterStyle;