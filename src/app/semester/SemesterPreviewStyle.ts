import { createStyles, Theme } from '@material-ui/core';

const SemesterPreviewStyle = (theme: Theme) => createStyles({
    root: {
        // position: 'relative'
    },
    header: {
        display: 'flex',
        alignItems: 'center'
    },
    title: {
        flexShrink: 1,
        marginRight: theme.spacing(2)
    },
    rule: {
        flexGrow: 1,
        border: 0,
        borderBottom: '1px solid #666699',
    },
    content: {
        display: 'flex',
        alignItems: 'center'
    },
    modules: {
        flexGrow: 1,
        display: 'flex',
        flexWrap: 'wrap',
    },
    button: {

    },
    summary: {
        minWidth: 64,
        textAlign: 'center',
    }
});

export default SemesterPreviewStyle;