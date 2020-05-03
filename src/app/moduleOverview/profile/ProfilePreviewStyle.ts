import { createStyles, Theme } from '@material-ui/core';

const ProfilePreviewStyle = (theme: Theme) => createStyles({
    root: {
        padding: theme.spacing(1),
        boxSizing: 'border-box',
        borderRadius: 2,
        color: theme.palette.text.primary,
        display: 'block',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
    },
    title: {
        flexShrink: 1,
        marginRight: theme.spacing(2),
        userSelect: 'text',
        color: theme.palette.primary.main,
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
        },
    },
    modules: {
        flexGrow: 1,
        display: 'flex',
        flexWrap: 'wrap',
        width: '85%',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
    },
    statistic: {
        width:'15%',
        minWidth:'153px',
        marginLeft:'4px',
        display: 'flex',
        flexGrow: 1,
        justifyContent:'center'
    }
});

export default ProfilePreviewStyle;
