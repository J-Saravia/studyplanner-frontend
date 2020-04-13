import { createStyles, Theme } from '@material-ui/core';

const ModuleVisitDialogStyle = (theme: Theme) => createStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        '& > *': {
            margin: theme.spacing(1),
        }
    },
    stateIndicator: {
        borderRadius: '50%',
        height: 24,
        width: 24,
        display: 'inline-block',
        border: '1px solid',
        marginRight: theme.spacing(1),
    },
    statePlanned: {
        backgroundColor: '#c4d3ff',
        borderColor: '#3366ff',
    },
    stateOngoing: {
        backgroundColor: '#ffffe0',
        borderColor: '#ffff33',
    },
    statePassed: {
        backgroundColor: '#eeffdd',
        borderColor: '#99ff33',
    },
    stateFailed: {
        backgroundColor: '#ffdddd',
        borderColor: '#ff3333',
    },
    stateSelection: {
        display: 'flex',
        alignItems: 'center'
    },
    stateSelectionSelect: {
        flexGrow: 1
    },
    module: {
        borderBottom: '1p solid black'
    },
    moduleButton: {
        color: theme.palette.primary.main,
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'underline'
        }
    }
});

export default ModuleVisitDialogStyle;
