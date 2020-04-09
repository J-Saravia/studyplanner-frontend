import { createStyles, Theme } from '@material-ui/core';

const SemesterStatisticsStyle = (theme: Theme) => createStyles({
    root: {
        borderRadius: 2,
        position: 'relative',
        margin: theme.spacing(1),
        cursor: 'pointer',
        '&:active': {
            boxShadow: 'none'
        },
        border: '1px solid black',
        textAlign: 'left',
        backgroundColor: '#ffeede',
        color: '#FFB066',
        borderColor: '#FFB066'
    },
    label: {
        color: theme.palette.common.black,
        textAlign: 'center'
    },

    hidden: {
        display: 'none'
    }
});

export default SemesterStatisticsStyle;