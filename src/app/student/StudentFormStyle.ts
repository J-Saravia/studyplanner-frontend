import { createStyles, Theme } from '@material-ui/core';

const StudentFormStyle = (theme: Theme) => createStyles({
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
});

export default StudentFormStyle;