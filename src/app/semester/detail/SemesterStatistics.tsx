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

    public render() {
        const {classes} = this.props;

        return (
            <div>
                {this.getChip(classes, 'ETCS', this.getTotalEtcs())}
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
                width: '120px',
                height: '80px'
            }}
        />;
    }
}


export default withAuthService(withModuleVisitService(withStyles(SemesterStatisticsStyle)(SemesterStatistics)));