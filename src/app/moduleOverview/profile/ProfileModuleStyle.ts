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
            backgroundColor: 'gainsboro',
            cursor: 'default',
            color: theme.palette.common.black,
            borderColor: 'grey',
        },
        planned: {
            backgroundColor: '#DEE7FF',
            color: '#3366ff',
            borderColor: '#3366ff',
            cursor: 'default',
            '&:hover': {
                backgroundColor: '#DEE7FF'
            }
        },
        ongoing: {
            backgroundColor: '#ffffe0',
            color: '#ffff33',
            borderColor: '#ffff33',
            cursor: 'default',
            '&:hover': {
                backgroundColor: '#ffffe0'
            },
        },
        passed: {
            backgroundColor: '#eeffdd',
            color: '#99ff33',
            cursor: 'default',
            borderColor: '#99ff33',
            '&:hover': {
                backgroundColor: '#eeffdd'
            }
        },
        failed: {
            backgroundColor: '#ffdddd',
            color: '#ff3333',
            cursor: 'default',
            borderColor: '#ff3333',
            '&:hover': {
                backgroundColor: '#ffdddd'
            },

        },
        mobile: {
            flexGrow: 1,
            width: '100%',
        },
        label: {
            color: theme.palette.common.black,
            textAlign: 'center',
            cursor: 'text',
        },
    });

export default ProfileModuleStyle;
