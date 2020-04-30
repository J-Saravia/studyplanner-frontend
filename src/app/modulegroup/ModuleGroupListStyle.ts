import { createStyles, Theme } from '@material-ui/core';

const ModuleGroupListStyle = (theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
        },
        list: {
            margin: theme.spacing(1),
            padding: theme.spacing(1),
        },
        title: {
            flexShrink: 1,
            marginRight: theme.spacing(2),
            marginLeft: theme.spacing(3),
            userSelect: 'text',
            color: '#1976D2',
        },
        rule: {
            flexGrow: 1,
            marginRight: theme.spacing(3),
            border: 0,
            borderBottom: '1px solid #666699',
        },
        content: {
            display: 'flex',
            flexDirection: 'column',
            marginLeft: theme.spacing(3),
        },
        modules: {
            flexGrow: 1,
            display: 'flex',
            flexWrap: 'wrap',
            [theme.breakpoints.down('sm')]: {
                justifyContent: 'center',
            },
        },
    });

export default ModuleGroupListStyle;
