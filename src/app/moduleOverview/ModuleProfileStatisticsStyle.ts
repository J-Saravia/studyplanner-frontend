import { createStyles, Theme } from '@material-ui/core';

const ModuleProfileStatisticsStyle = (theme: Theme) => createStyles({
        total: { fontWeight: 'bold' },
        enough: { color: 'forestgreen' },
        notEnough: { color: 'darkorange' },
        group: {
            position: 'relative',
            margin: theme.spacing(1),
            marginTop: theme.spacing(2),
            border: '1px solid black',
            borderColor: '#FF9633',
            borderRadius: 2,
        },
        groupTitle: {
            position: 'absolute',
            transform: `translateX(10%) translateY(-50%) translateY(-${theme.spacing(0.2) + 1}px)`,
            backgroundColor: 'white',
            fontWeight: theme.typography.fontWeightBold,
            color: theme.palette.common.black
        },
        elem: {
            height: '55px',
            width: '95px',
            margin: theme.spacing(1),
            backgroundColor: 'white',
        },
        value: {
            color: theme.palette.common.black,
            textAlign: 'center',
        },
        label: {
            paddingRight: '0px',
            paddingLeft: '0px'
        }
    })
;

export default ModuleProfileStatisticsStyle;
