import {createStyles, Theme} from '@material-ui/core';

const SemesterViewStyle = (theme: Theme) => createStyles({
    root: {
        margin: theme.spacing(3)
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'default'
    },
    title: {
        flexShrink: 1,
        marginRight: theme.spacing(2),
        userSelect: 'text',
        color: '#1976D2'
    },
    rule: {
        flexGrow: 1,
        border: 0,
        borderBottom: '1px solid #666699',
    },
    content: {
        display: 'flex',
        flexDirection: 'column'
    },
    modules: {
        flexGrow: 1,
        display: 'flex',
        flexWrap: 'wrap',
        [theme.breakpoints.down('sm')]: {
            justifyContent: 'center'
        }
    },
    buttonSpace: {
        display: 'flex',
        flexGrow: 1,
        flexWrap: 'wrap',
        flexDirection: 'column',
        alignItems: 'flex-end',
        [theme.breakpoints.down('sm')]: {
            alignItems: 'center'
        }
    },
    button: {
        fontSize: '2.25em'
    }
});

export default SemesterViewStyle;
