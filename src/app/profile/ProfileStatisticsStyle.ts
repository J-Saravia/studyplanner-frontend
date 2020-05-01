import { createStyles, Theme } from '@material-ui/core';

const ProfileStatisticsStyle = (theme: Theme) =>
    createStyles({
        total: { fontWeight: 'bold' },
        enoughCredits: { color: 'green' },
        notEnoughCredits: { color: 'orange' },
    });

export default ProfileStatisticsStyle;
