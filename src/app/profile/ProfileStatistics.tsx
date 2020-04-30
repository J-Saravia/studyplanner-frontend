import * as React from 'react';
import { StyledComponentProps, withStyles } from '@material-ui/core';
import ModuleVisit from '../../model/ModuleVisit';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import ProfileStatisticsStyle from './ProfileStatisticsStyle';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';
import Profile from '../../model/Profile';

interface ProfileStatisticsProps extends StyledComponentProps, WithTranslation {
    classes: ClassNameMap;
    moduleVisits?: ModuleVisit[];
    profile: Profile;
}

class ProfileStatistics extends React.Component<ProfileStatisticsProps, any> {
    constructor(props: Readonly<ProfileStatisticsProps>) {
        super(props);
        this.state = {};
    }

    public render() {
        const { classes, moduleVisits, profile } = this.props;
        let passedModules = 0;
        let plannedOrOngoingModules = 0;
        moduleVisits &&
            moduleVisits.forEach((mv) => {
                if (mv.state === 'planned' || mv.state === 'ongoing') {
                    plannedOrOngoingModules += 1;
                }
                if (mv.state === 'passed') {
                    passedModules += 1;
                }
            });

        return (
            <div>
                <div>
                    {plannedOrOngoingModules}{' '}
                    <Trans>
                        translation:messages.moduleGroupAndProfileStatistics.plannedOrOngoing
                    </Trans>
                </div>
                <div>
                    {passedModules}{' '}
                    <Trans>
                        translation:messages.moduleGroupAndProfileStatistics.passed
                    </Trans>
                </div>
                <div
                    className={
                        classes.total +
                        ' ' +
                        (plannedOrOngoingModules + passedModules >=
                        profile.minima
                            ? classes.enoughCredits
                            : classes.notEnoughCredits)
                    }
                >
                    {plannedOrOngoingModules + passedModules} / {profile.minima}{' '}
                    <Trans>
                        translation:messages.moduleGroupAndProfileStatistics.total
                    </Trans>
                </div>
            </div>
        );
    }
}

export default withTranslation()(
    withStyles(ProfileStatisticsStyle)(ProfileStatistics)
);
