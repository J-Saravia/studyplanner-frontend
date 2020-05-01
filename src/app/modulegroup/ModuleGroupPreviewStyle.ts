import { createStyles, Theme } from '@material-ui/core';

const ModuleGroupPreviewStyle = (theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(1),
            boxSizing: 'border-box',
            borderRadius: 2,
            color: theme.palette.text.primary,
            display: 'block',
            '&:hover': {
                [theme.breakpoints.up('md')]: {
                    border: '1px solid #666699',
                    padding: theme.spacing(1) - 1, // To prevent shifting everything
                },
                color: theme.palette.text.secondary,
            },
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
            [theme.breakpoints.down('sm')]: {
                width: '100%',
            },
        },
        unclickablePlanned:{
            cursor:'default',
            '&:hover': {
                backgroundColor: '#DEE7FF'
            }
        },
        unclickableOngoing:{
            cursor:'default',
            '&:hover': {
                backgroundColor: '#ffffe0'
            },

        },
        unclickablePassed:{
            cursor:'default',
            '&:hover': {
                backgroundColor: '#eeffdd'
            }
        },
        unclickableFailed:{
            cursor:'default',
            '&:hover': {
                backgroundColor: '#ffc2c2'
            },
        }
    });

export default ModuleGroupPreviewStyle;
