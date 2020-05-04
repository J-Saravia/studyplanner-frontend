import { createStyles, Theme } from '@material-ui/core';

const ModuleGroupListStyle = (theme: Theme) => createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
        },
        list: {
            margin: theme.spacing(1),
            padding: theme.spacing(1),
        },
        title: {
            userSelect: 'text',
            color: theme.palette.primary.dark,
        }
    });

export default ModuleGroupListStyle;
