import * as React from 'react';
import { StyledComponentProps, withStyles } from '@material-ui/core';
import ModuleVisit from '../../model/ModuleVisit';
import ModuleGroup from '../../model/ModuleGroup';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import ModuleGroupStatisticsStyle from './ModuleGroupStatisticsStyle';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';

interface ModuleGroupStatisticsProps
    extends StyledComponentProps,
        WithTranslation {
    classes: ClassNameMap;
    moduleVisits?: ModuleVisit[];
    group: ModuleGroup;
}

class ModuleGroupStatistics extends React.Component<
    ModuleGroupStatisticsProps,
    any
> {
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
                if (mv.state === 'passed') {
                    passedCredits += credits;
                }
                if (mv.state === 'planned' || mv.state === 'ongoing') {
                    plannedOrOngoingCredits += credits;
                }
            });

        return (
            <div>
                <div>
                    {plannedOrOngoingCredits} / {group.minima}{' '}
                    <Trans>
                        translation:messages.moduleGroupStatistics.plannedOrOngoing
                    </Trans>
                </div>
                <div>
                    {passedCredits} / {group.minima}{' '}
                    <Trans>
                        translation:messages.moduleGroupStatistics.passed
                    </Trans>
                </div>
                <div
                    className={
                        classes.total +
                        ' ' +
                        (passedCredits + plannedOrOngoingCredits >= group.minima
                            ? classes.enoughCredits
                            : classes.notEnoughCredits)
                    }
                >
                    {passedCredits + plannedOrOngoingCredits} / {group.minima}{' '}
                    <Trans>
                        translation:messages.moduleGroupStatistics.total
                    </Trans>
                </div>
            </div>
        );
    }
}

export default withTranslation()(
    withStyles(ModuleGroupStatisticsStyle)(ModuleGroupStatistics)
);
