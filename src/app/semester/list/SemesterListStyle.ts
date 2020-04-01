import { createStyles, Theme } from '@material-ui/core';

const SemesterListStyle = (theme: Theme) => createStyles({
    root: {},
    list: {
        margin: theme.spacing(1),
        padding: theme.spacing(1),
    }
});

export default SemesterListStyle;