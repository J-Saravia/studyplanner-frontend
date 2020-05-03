import * as React from 'react';
import { Chip, StyledComponentProps, withStyles } from '@material-ui/core';
import ModuleVisit from '../../../model/ModuleVisit';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';
import Profile from '../../../model/Profile';
import ModuleProfileStatisticsStyle from "../ModuleProfileStatisticsStyle";

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
            <div className={classes.group}>
                <div className={classes.groupTitle}>
                    <Trans>
                        translation:messages.statistic.ectsModules.modules
                    </Trans>
                </div>
                <Chip
                    tabIndex={-1}
                    label={

                        <div>
                            <div
                                className={
                                    classes.total +
                                    ' ' +
                                    (passedModules + plannedOrOngoingModules >= profile.minima
                                        ? classes.enough
                                        : classes.notEnough)
                                }
                            >
                                <Trans>
                                    translation:messages.statistic.ectsModules.total
                                </Trans>
                                {': '}{passedModules + plannedOrOngoingModules} / {profile.minima}

                            </div>
                            <div className={classes.value}>
                                <Trans>
                                    translation:messages.statistic.ectsModules.passed
                                </Trans>
                                {': '}{passedModules}
                            </div>
                            <div className={classes.value}>
                                <Trans>
                                    translation:messages.statistic.ectsModules.pending
                                </Trans>
                                {': '}{plannedOrOngoingModules}
                            </div>
                        </div>
                    }
                    color="primary"
                    classes={{
                        root: classes.elem,
                        label: classes.label
                    }}
                />
            </div>
        );
    }
}

export default withTranslation()(withStyles(ModuleProfileStatisticsStyle)(ProfileStatistics));
