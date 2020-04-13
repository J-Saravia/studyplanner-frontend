import { createStyles, Theme } from '@material-ui/core';

const SelectModuleDialogStyle = (theme: Theme) => createStyles({
    root: {

    },
    info: {
        width: 256,
        minWidth: 256,
        paddingRight: theme.spacing(1),
        marginRight: theme.spacing(1),
        borderRight: '1px solid black',
    },
    infoTitle: {
        fontWeight: theme.typography.fontWeightBold,
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
    },
    requirement: {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        padding: theme.spacing(0.25)
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
    },
    modules: {
        display: 'flex',
        flexWrap: 'wrap',
        overflowY: 'auto',

    },
    module: {
        width: `calc(33% - ${theme.spacing(2)}px)`,
        minWidth: 256,
        margin: theme.spacing(1),
        cursor: 'pointer',
        padding: theme.spacing(0.5),
        border: '1px solid black',
        borderRadius: 2,
        [theme.breakpoints.down(1215)]: {
            width: `calc(50% - ${theme.spacing(2)}px)`,
        },
        [theme.breakpoints.down(680)]: {
            flexGrow: 1
        }
    },
    passed: {
        backgroundColor: '#959991',
        borderColor: '#7b995c'
    },
    selected: {
        backgroundColor: '#8fcc7a',
        borderColor: '#54cc29'
    },
    moduleTitle: {
        fontWeight: theme.typography.fontWeightBold,
        display: 'block',
        borderBottom: '1px solid black',
        margin: `0 ${-theme.spacing(0.5) - 1}px ${theme.spacing(0.5)}px`,
        padding: `0 ${theme.spacing(0.5)}px`,
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    fullWidth: {
        width: 'calc(100% - 64px)'
    },
    fullHeight: {
        height: 'calc(100% - 64px)'
    }
});

export default SelectModuleDialogStyle;