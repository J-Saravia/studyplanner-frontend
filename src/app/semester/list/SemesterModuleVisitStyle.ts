import { createStyles, Theme } from '@material-ui/core';

const SemesterModuleVisitStyle = (theme: Theme) => createStyles({
    root: {
        borderRadius: 2,
        position: 'relative',
        margin: theme.spacing(1),
        cursor: 'pointer',
        '&:active': {
            boxShadow: 'none'
        },
        border: '1px solid black',
        textAlign: 'left',
    },
    planned: {
        backgroundColor: '#c4d3ff',
        color: '#3366ff',
        borderColor: '#3366ff',
        '&:hover': {
            backgroundColor: '#c4d3ff'
        },
    },
    ongoing: {
        backgroundColor: '#ffffe0',
        color: '#ffff33',
        borderColor: '#ffff33',
        '&:hover': {
            backgroundColor: '#ffffc4'
        },
    },
    passed: {
        backgroundColor: '#eeffdd',
        color: '#99ff33',
        borderColor: '#99ff33',
        '&:hover': {
            backgroundColor: '#e0ffc2'
        },
    },
    failed: {
        backgroundColor: '#ffdddd',
        color: '#ff3333',
        borderColor: '#ff3333',
        '&:hover': {
            backgroundColor: '#ffc2c2'
        },
    },
    mobile: {
        flexGrow: 1,
        width: '100%',
    },
    label: {
        color: theme.palette.common.black,
    },
    button: {
        position: 'absolute',
        right: 0,
        top: 'calc(50% - 11px)',
        color: '#000',
        '&:hover': {
            color: '#ff0000'
        },
    },
    hidden: {
        display: 'none',
    }
});

export default SemesterModuleVisitStyle;