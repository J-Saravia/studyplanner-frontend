import {createStyles, Theme} from '@material-ui/core';

const SemesterStatisticsStyle = (theme: Theme) => createStyles({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        [theme.breakpoints.down('sm')]: {
            flexGrow: 1,
            justifyContent: 'stretch',
            flexDirection: 'column'
        }

    },

    group: {
        position: 'relative',
        margin: theme.spacing(1),
        marginTop: theme.spacing(2),
        cursor: 'default',
        border: '1px solid black',
        borderColor: '#FF9633',
        borderRadius: 2,
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            justifyContent: 'stretch',
            alignItems: 'stretch',
            justifyItems: 'stretch',
            flexGrow: 1
        }

    },
    groupTitle: {
        position: 'absolute',
        transform: `translateX(10%) translateY(-50%) translateY(-${theme.spacing(0.2) + 1}px)`,
        backgroundColor: 'white',
        fontWeight: theme.typography.fontWeightBold
    },

    elem: {
        borderRadius: 5,
        margin: theme.spacing(1),
        cursor: 'default',
        border: '1px solid black',
        borderColor: '#FFB066',
        backgroundColor: '#ffeede',
        minWidth: '100px',
        [theme.breakpoints.down('sm')]: {
            flexGrow: 1,

        }
    },
    label: {
        color: theme.palette.common.black,
        textAlign: 'center',
        fontWeight: theme.typography.fontWeightBold
    },
    value: {
        color: theme.palette.common.black,
        textAlign: 'center'
    }
});

export default SemesterStatisticsStyle;