import * as React from 'react';
import { Chip, StyledComponentProps, withStyles } from '@material-ui/core';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';
import ModuleVisit from "../../../model/ModuleVisit";
import ModuleGroup from "../../../model/ModuleGroup";
import StatisticsStyle from "../../semester/StatisticsStyle";

interface ParentGroupStatisticsProps extends StyledComponentProps, WithTranslation {
    classes: ClassNameMap;
    moduleVisits?: ModuleVisit[];
    group: ModuleGroup;
}

class ParentGroupStatistics extends React.Component<ParentGroupStatisticsProps, any> {
    constructor(props: Readonly<ParentGroupStatisticsProps>) {
        super(props);
        this.state = {};
    }

    private getPositiveEcts() {
        const { moduleVisits } = this.props;
        let result = 0;
        moduleVisits &&
        moduleVisits.forEach((mv) => {
            const { credits } = mv.module;
            if (mv.state === 'passed') {
                result += credits;
            }
        });
        return result;
    }

    private getPendingEcts() {
        const { moduleVisits } = this.props;
        let result = 0;
        moduleVisits &&
        moduleVisits.forEach((mv) => {
            const { credits } = mv.module;
            if (mv.state === 'planned' || mv.state === 'ongoing') {
                result += credits;
            }
        });
        return result;
    }


    public render() {
        const { classes, group } = this.props;
        let passedCredits = this.getPositiveEcts();
        let openCredits = this.getPendingEcts();
        let total = passedCredits + openCredits;

        return (
            <div className={classes.root}>
                <div className={classes.group}>
                    <div className={classes.groupTitle}>ECTS</div>
                    {this.getChip('total', total + ' / ' + group.minima)}
                    {this.getChip('passed', passedCredits.toString())}
                    {this.getChip('pending', openCredits.toString())}
                </div>
            </div>
        );
    }

    private getChip(label: string, value: string) {
        const { classes } = this.props;
        return (
            <Chip
                tabIndex={-1}
                label={
                    <div>
                        <div className={classes.label}>
                            <Trans>
                                translation:messages.statistic.ectsModules.{label}
                            </Trans>
                        </div>
                        <div className={classes.value}>{value}</div>
                    </div>
                }
                color="primary"
                classes={{
                    root: classes.elem,
                }}
            />
        );
    }
}

export default withTranslation()(withStyles(StatisticsStyle)(ParentGroupStatistics));
