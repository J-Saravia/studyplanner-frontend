import { createStyles, Theme } from '@material-ui/core';

const ModuleGroupStatisticsStyle = (theme: Theme) => createStyles({
    total: { fontWeight: 'bold' },
    enoughCredits: { color: 'forestgreen' },
    notEnoughCredits: { color: 'darkorange' },
    group: {
        position: 'relative',
        margin: theme.spacing(1),
        marginTop: theme.spacing(2),
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
        fontWeight: theme.typography.fontWeightBold,
        color: theme.palette.common.black
    },
    elem: {
        borderRadius: 5,
        height: '75px',
        width: '135px',
        margin: theme.spacing(1),
        border: '1px solid black',
        borderColor: '#FFB066',
        backgroundColor: '#ffeede',
        [theme.breakpoints.down('sm')]: {
            flexGrow: 1,
        }
    },
    value: {
        color: theme.palette.common.black,
        textAlign: 'center'
    }
});

export default ModuleGroupStatisticsStyle;
