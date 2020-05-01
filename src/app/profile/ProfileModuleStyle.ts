import { createStyles, Theme } from '@material-ui/core';

const ProfileModuleStyle = (theme: Theme) =>
    createStyles({
        root: {
            borderRadius: 2,
            position: 'relative',
            margin: theme.spacing(1),
            cursor: 'pointer',
            '&:active': {
                boxShadow: 'none',
            },
            border: '1px solid black',
            textAlign: 'left',
            minWidth: '110px',
        },
        blank: {
            backgroundColor: 'grey',
            color: theme.palette.common.black,
            borderColor: 'darkgrey',
        },
        planned: {
            backgroundColor: '#DEE7FF',
            color: '#3366ff',
            borderColor: '#3366ff',
            '&:hover': {
                backgroundColor: '#c4d3ff',
            },
            '&:focus': {
                backgroundColor: '#DEE7FF',
            },
        },
        ongoing: {
            backgroundColor: '#ffffe0',
            color: '#ffff33',
            borderColor: '#ffff33',
            '&:hover': {
                backgroundColor: '#ffffc4',
            },
            '&:focus': {
                backgroundColor: '#ffffe0',
            },
        },
        passed: {
            backgroundColor: '#eeffdd',
            color: '#99ff33',
            borderColor: '#99ff33',
            '&:hover': {
                backgroundColor: '#e0ffc2',
            },
            '&:focus': {
                backgroundColor: '#eeffdd',
            },
        },
        mobile: {
            flexGrow: 1,
            width: '100%',
        },
        label: {
            color: theme.palette.common.black,
            textAlign: 'center',
        },
    });

export default ProfileModuleStyle;
