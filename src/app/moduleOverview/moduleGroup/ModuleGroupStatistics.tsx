import * as React from 'react';
import { Chip, StyledComponentProps, withStyles } from '@material-ui/core';
import ModuleVisit from '../../../model/ModuleVisit';
import ModuleGroup from '../../../model/ModuleGroup';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import ModuleProfileStatisticsStyle from '../ModuleProfileStatisticsStyle';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';

interface ModuleGroupStatisticsProps extends StyledComponentProps, WithTranslation {
    classes: ClassNameMap;
    moduleVisits?: ModuleVisit[];
    group: ModuleGroup;
}

class ModuleGroupStatistics extends React.Component<ModuleGroupStatisticsProps, any> {

    constructor(props: Readonly<ModuleGroupStatisticsProps>) {
        super(props);
        this.state = {};
    }

    public render() {
        const { classes, moduleVisits, group } = this.props;
        let passedCredits = 0;
        let plannedOrOngoingCredits = 0;
        moduleVisits &&
        moduleVisits.forEach((mv) => {
            const { credits } = mv.module;
            if (mv.state === 'planned' || mv.state === 'ongoing') {
                plannedOrOngoingCredits += credits;
            } else if (mv.state === 'passed') {
                passedCredits += credits;
            }
        });

        return (
            <div className={classes.group}>
                <div className={classes.groupTitle}>ECTS</div>
                <Chip
                    tabIndex={-1}
                    label={
                        <div>
                            <div
                                className={
                                    classes.total +
                                    ' ' +
                                    (passedCredits + plannedOrOngoingCredits >= group.minima
                                        ? classes.enough
                                        : classes.notEnough)
                                }
                            >
                                <Trans>
                                    translation:messages.statistic.ectsModules.total
                                </Trans>
                                {': '}{passedCredits + plannedOrOngoingCredits} / {group.minima}

                            </div>

                            <div className={classes.value}>
                                <Trans>
                                    translation:messages.statistic.ectsModules.passed
                                </Trans>
                                {': '}{passedCredits}
                            </div>
                            <div className={classes.value}>
                                <Trans>
                                    translation:messages.statistic.ectsModules.pending
                                </Trans>
                                {': '}{plannedOrOngoingCredits}
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

export default withTranslation()(withStyles(ModuleProfileStatisticsStyle)(ModuleGroupStatistics));
