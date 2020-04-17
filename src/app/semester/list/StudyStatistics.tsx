import * as React from 'react';
import {Chip, StyledComponentProps, withStyles} from '@material-ui/core';
import ModuleVisit from '../../../model/ModuleVisit';
import {ClassNameMap} from '@material-ui/core/styles/withStyles';
import StudyStatisticsStyle from "./StudyStatisticsStyle";
import {Trans, WithTranslation, withTranslation} from 'react-i18next';

interface StudyStatisticsProps extends StyledComponentProps, WithTranslation {
    classes: ClassNameMap;
    semesterModuleMap: { [key: string]: ModuleVisit[] };
}

class StudyStatistics extends React.Component<StudyStatisticsProps, any> {


    constructor(props: Readonly<StudyStatisticsProps>) {
        super(props);
        this.state = {};
    }

    private getTotalEtcs() {
        const {semesterModuleMap} = this.props;
        let totalCredits = 0;
        const keys = Object.keys(semesterModuleMap);
        keys.forEach(key => {
            semesterModuleMap[key].forEach(mv => {
                const credits = mv.module.credits;
                totalCredits += credits;
            })
        })
        return totalCredits.toString();
    }

    private getTotalPositive() {
        const {semesterModuleMap} = this.props;
        let currentCredits = 0;
        const keys = Object.keys(semesterModuleMap);
        keys.forEach(key => {
            semesterModuleMap[key].forEach(mv => {
                    const credits = mv.module.credits;
                    if (mv.state === 'passed') {
                        currentCredits += credits;
                    }
                }
            )
        })

        return currentCredits.toString();
    }

    private getTotalNegative() {
        const {semesterModuleMap} = this.props;
        let currentNegativeCredits = 0;
        const keys = Object.keys(semesterModuleMap);
        keys.forEach(key => {
            semesterModuleMap[key].forEach(mv => {
                const credits = mv.module.credits;
                if (mv.state === 'failed') {
                    currentNegativeCredits += credits;
                }
            })
        })
        return currentNegativeCredits.toString() + ' / 60';
    }

    private getAvgGrade() {
        const {semesterModuleMap} = this.props;
        let weightedGradeSum = 0;
        let divider = 0;
        const keys = Object.keys(semesterModuleMap);
        keys.forEach(key => {
            semesterModuleMap[key].forEach(mv => {
                if (mv.state === 'passed') {
                    if (mv.grade) {
                        weightedGradeSum += mv.module.credits * mv.grade;
                        divider += mv.module.credits;
                    }
                } else if (mv.state === 'failed') {
                    weightedGradeSum += mv.module.credits * mv.grade;
                    divider += mv.module.credits;
                }
            })
        })
        if(divider !== 0){
            let averageGrade = (weightedGradeSum / divider)

            if (Number.isInteger(averageGrade)) {
                return averageGrade.toString();
            } else {
                return averageGrade.toFixed(2);
            }
        }
        return 'N/D';
    }

    public render() {
        const {classes} = this.props;

        return (
            <div className={classes.root}>
                <div className={classes.group}>
                    <div className={classes.groupTitle}>ETCS</div>
                    {this.getChip('etcs.total', this.getTotalEtcs())}
                    {this.getChip('etcs.passed', this.getTotalPositive())}
                    {this.getChip('etcs.failed', this.getTotalNegative())}

                </div>
                <div className={classes.group}>
                    <div className={classes.groupTitle}>
                        <Trans>translation:messages.semesterStatistic.grade.title</Trans></div>
                    {this.getChip('grade.avg', this.getAvgGrade())}
                </div>
            </div>
        )
    }

    private getChip(label: string, value: string) {
        const {classes} = this.props;
        return <Chip
            tabIndex={-1}
            label={<div>
                <div className={classes.label}>
                    <Trans>translation:messages.semesterStatistic.{label}</Trans>
                </div>
                <div className={classes.value}>{value}</div>
            </div>}
            color="primary"
            classes={{
                root: classes.elem
            }}
            style={{
                height: '60px'
            }}
        />;
    }
}

export default withTranslation()(withStyles(StudyStatisticsStyle)(StudyStatistics));