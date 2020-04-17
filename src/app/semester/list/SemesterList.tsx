import * as React from 'react';
import SemesterPreview from './SemesterPreview';
import {Button, StyledComponentProps, Typography, withStyles} from '@material-ui/core';
import SemesterListStyle from './SemesterListStyle';
import ModuleVisit from '../../../model/ModuleVisit';
import { StudentServiceProps, withStudentService } from '../../../service/StudentService';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import { ModuleVisitServiceProps, withModuleVisitService } from '../../../service/ModuleVisitService';
import { AuthServiceProps, withAuthService } from '../../../service/AuthService';
import { Trans } from 'react-i18next';
import CreateSemesterDialog from '../dialog/CreateSemesterDialog';
import StudyStatistics from "./StudyStatistics";

interface SemesterListState {
    semesterModuleMap?: { [key: string]: ModuleVisit[] };
    createSemester?: boolean;
}

interface SemesterListProps extends StudentServiceProps, ModuleVisitServiceProps, StyledComponentProps, AuthServiceProps {
    classes: ClassNameMap;
}

class SemesterList extends React.Component<SemesterListProps, SemesterListState> {

    constructor(props: Readonly<SemesterListProps>) {
        super(props);
        this.state = {};
    }

    public componentDidMount() {
        this.props.moduleVisitService.map().then(
            (semesterModuleMap: { [key: string]: ModuleVisit[] }) => this.setState({ semesterModuleMap })
        );
    }

    private handleCreateSemester = () => {
        this.setState({ createSemester: true });
    };

    private handleCreateSemesterCancel = () => {
        this.setState({ createSemester: false });
    };

    public render() {
        const { classes } = this.props;
        const { semesterModuleMap, createSemester } = this.state;

        return (
            <div className={classes.root}>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.addSemesterButton}
                    onClick={this.handleCreateSemester}
                >
                    <Trans>translation:messages.semester.create</Trans>
                </Button>
                <div className={classes.list}>
                    {semesterModuleMap && Object.keys(semesterModuleMap).map(key => (
                        <SemesterPreview
                            key={key}
                            semester={key}
                            moduleVisits={semesterModuleMap[key]}
                        />
                    ))}
                    {this.getStatistic()}
                </div>
                <CreateSemesterDialog open={createSemester} onCancel={this.handleCreateSemesterCancel}/>
            </div>
        );
    }

    private getStatistic() {
        const { classes } = this.props;
        const { semesterModuleMap } = this.state;

        return <>
            <div className={classes.header}>
                <Typography variant="h6" className={classes.title}>
                    <Trans>translation:messages.studyStatistic</Trans></Typography>
                <hr className={classes.rule}/>
            </div>
            <div className={classes.content}>

                <div className={classes.modules}>
                    {semesterModuleMap &&
                    <StudyStatistics
                        semesterModuleMap={semesterModuleMap}>
                    </StudyStatistics>
                    }
                </div>
            </div>
        </>;
    }

}

export default withAuthService(withStudentService(withModuleVisitService(withStyles(SemesterListStyle)(SemesterList))));