import * as React from 'react';
import {Chip, StyledComponentProps, withStyles} from '@material-ui/core';
import ModuleVisit from '../../../model/ModuleVisit';
import {ClassNameMap} from '@material-ui/core/styles/withStyles';
import {ModuleVisitServiceProps, withModuleVisitService} from '../../../service/ModuleVisitService';
import {AuthServiceProps, withAuthService} from '../../../service/AuthService';
import clsx from "clsx";
import SemesterStatisticsStyle from "./SemesterStatisticsStyle";
interface SemesterStatisticsProps extends ModuleVisitServiceProps, StyledComponentProps, AuthServiceProps {
    classes: ClassNameMap;
    moduleVisits: ModuleVisit[];
}

class SemesterStatistics extends React.Component<SemesterStatisticsProps, any> {


    constructor(props: Readonly<SemesterStatisticsProps>) {
        super(props);
        this.state = {};
    }

    private getTotalEtcs() {
        const {moduleVisits} = this.props;
        let total =  moduleVisits.map(m => m.module.credits).reduce(function(a, b){ return a + b; });
        return total.toString();
    }

    private getTotalMsps() {
        const {moduleVisits} = this.props;
        let total =  moduleVisits.map(m => m.module.msp).filter(ms => ms !== 'NONE').length;
        return total.toString();
    }

    private getTotalGrade() {
        const {moduleVisits} = this.props;
        let weighedGradeSum = 0;
        let totalEtc = 0;
        let gradedModules =  moduleVisits.filter(m => m.state !== 'planned' && m.state !== 'ongoing');
        gradedModules.forEach(m => {
            const etc = m.module.credits;
            totalEtc += etc;
            weighedGradeSum += (etc * m.grade);
        })
        let total = weighedGradeSum / totalEtc;
        return total.toString();
    }

    private getTotalPositive() {
        const {moduleVisits} = this.props;
        let total =  moduleVisits.filter(m => m.state === 'passed').map(m => m.module.credits).reduce(function(a, b){ return a + b; });
        return total.toString();
    }

    private getTotalNegative() {
        const {moduleVisits} = this.props;
        let total =  moduleVisits.filter(m => m.state === 'failed').map(m => m.module.credits).reduce(function(a, b){ return a + b; });
        return total.toString();
    }

    public render() {
        const {classes} = this.props;

        return (
            <div>
                {this.getChip(classes, 'Gesamt', this.getTotalEtcs())}
                {this.getChip(classes, 'Bestanden', this.getTotalPositive())}
                {this.getChip(classes, 'Ungenügend', this.getTotalNegative())}
                {this.getChip(classes, 'MSPs', this.getTotalMsps())}
                {this.getChip(classes, 'Ø Grade', this.getTotalGrade())}

            </div>
        )
    }

    private getChip(classes: ClassNameMap, title: string, value: string) {
        return <Chip
            tabIndex={-1}
            label={<div>
                <div className={classes.label}>{title}</div>
                <div className={classes.label}>{value}</div>
            </div>}
            color="primary"
            classes={{
                root: clsx(classes.root),
                label: classes.label
            }}
            style={{
                width: '100px',
                height: '60px'
            }}
        />;
    }
}


export default withAuthService(withModuleVisitService(withStyles(SemesterStatisticsStyle)(SemesterStatistics)));