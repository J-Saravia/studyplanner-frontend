import { createStyles, Theme } from '@material-ui/core';

const SelectionDialogStyle = (theme: Theme) => createStyles({
    root: {
        padding: theme.spacing(2),
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
    }
});

export default SelectionDialogStyle;