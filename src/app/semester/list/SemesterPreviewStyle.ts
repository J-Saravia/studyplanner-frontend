import { createStyles, Theme } from '@material-ui/core';

const SemesterPreviewStyle = (theme: Theme) => createStyles({
    root: {
        padding: theme.spacing(1),
        boxSizing: 'border-box',
        borderRadius: 2,
        userSelect: 'none',
        color: theme.palette.text.primary,
        display: 'block',
        '&:hover': {
            [theme.breakpoints.up('md')]: {
                border: '1px solid #666699',
                padding: theme.spacing(1) - 1, // To prevent shifting everything
            },
            color: theme.palette.text.secondary,
        }
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        textDecoration: 'none',
    },
    title: {
        flexShrink: 1,
        marginRight: theme.spacing(2),
        userSelect: 'text',
        color: theme.palette.primary.main,
        textDecoration: 'underline',
    },
    rule: {
        flexGrow: 1,
        border: 0,
        borderBottom: '1px solid #666699',
    },
    content: {
        display: 'flex',
        alignItems: 'center',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            alignItems: 'stretch',
        }
    },
    modules: {
        flexGrow: 1,
        display: 'flex',
        flexWrap: 'wrap',
    },
    button: {
        fontSize: '2.25em'
    },
    summary: {
        minWidth: 64,
        textAlign: 'center',
    }
});

export default SemesterPreviewStyle;