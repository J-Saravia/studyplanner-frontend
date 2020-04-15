import { createStyles, Theme } from '@material-ui/core';

const SemesterListStyle = (theme: Theme) => createStyles({
    root: {
        display: 'flex',
        flexDirection: 'column'
    },
    list: {
        margin: theme.spacing(1),
        padding: theme.spacing(1),
    },
    addSemesterButton: {
        alignSelf: 'baseline',
        [theme.breakpoints.down('sm')]: {
            alignSelf: 'stretch'
        }
    }
});

export default SemesterListStyle;