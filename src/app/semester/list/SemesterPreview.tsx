import * as React from 'react';
import {
    IconButton, isWidthDown, Link,
    StyledComponentProps,
    Typography,
    withStyles,
    withWidth,
    WithWidthProps
} from '@material-ui/core';
import SemesterPreviewStyle from './SemesterPreviewStyle';
import { AddCircle } from '@material-ui/icons';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import { ModuleVisitServiceProps, withModuleVisitService } from '../../../service/ModuleVisitService';
import ModuleVisit from '../../../model/ModuleVisit';
import { StudentServiceProps, withStudentService } from '../../../service/StudentService';
import SemesterModuleVisit from './SemesterModuleVisit';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import { RouteComponentProps, withRouter } from 'react-router-dom';


interface SemesterPreviewProps extends ModuleVisitServiceProps, StyledComponentProps, StudentServiceProps, WithWidthProps, RouteComponentProps {
    classes: ClassNameMap;
    semester: string;
    moduleVisits: ModuleVisit[];
    width: Breakpoint;
    onDeleteModuleVisit?: (moduleVisit: ModuleVisit) => void;
}

interface SemesterPreviewState {
    selectedModuleVisit?: ModuleVisit;
    deletingModuleVisit?: ModuleVisit;
}

class SemesterPreview extends React.Component<SemesterPreviewProps, SemesterPreviewState> {

    constructor(props: Readonly<any>) {
        super(props);
        this.state = {};
    }

    private moduleVisitClickHandler = (selectedModuleVisit: ModuleVisit) => () => {
        this.setState({ selectedModuleVisit });
    };

    private moduleVisitDeleteHandler = (deletingModuleVisit: ModuleVisit) => () => {
        if (this.props.onDeleteModuleVisit) {
            this.props.onDeleteModuleVisit(deletingModuleVisit);
        }
    };

    private handleAddButtonClick = () => {
        // TODO: implement this
    };

    private handleSelected = () => {
        this.props.history.push(`/semester/${this.props.semester}`);
    };

    public render() {
        const { classes, moduleVisits, semester, width } = this.props;
        const isMobile = isWidthDown('sm', width);
        let maxCredits = 0;
        let currentCredits = 0;
        moduleVisits.forEach(mv => {
            const { credits } = mv.module;
            maxCredits += credits;
            if (mv.state === 'passed') {
                currentCredits += credits;
            }
        });

        return (
            <div className={classes.root}>
                <Link href={`/semester/${semester}`} onClick={this.handleSelected} className={classes.header}>
                    <Typography variant="h6" className={classes.title}>{semester}</Typography>
                    <hr className={classes.rule}/>
                </Link>
                <div className={classes.content}>
                    <div className={classes.modules}>
                        {moduleVisits && moduleVisits.map(mv => (
                            <SemesterModuleVisit
                                key={mv.id}
                                moduleVisit={mv}
                                onClick={this.moduleVisitClickHandler(mv)}
                                onDelete={this.moduleVisitDeleteHandler(mv)}
                                isDetailed={false}
                            />
                        ))}
                    </div>
                    <IconButton color="primary" size="medium" onClick={this.handleAddButtonClick}>
                        <AddCircle
                            className={classes.button}
                        />
                    </IconButton>
                    {!isMobile && <div className={classes.summary}>
                        {currentCredits} / {maxCredits}
                    </div>}
                </div>
                selected: {this.state.selectedModuleVisit?.module.code}
            </div>
        );
    }
}

export default withRouter(withWidth()(withStudentService(withModuleVisitService(withStyles(SemesterPreviewStyle)(SemesterPreview)))));
