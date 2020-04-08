import * as React from 'react';
import SemesterPreview from './SemesterPreview';
import { StyledComponentProps, withStyles } from '@material-ui/core';
import SemesterListStyle from './SemesterListStyle';
import ModuleVisit from '../../../model/ModuleVisit';
import { StudentServiceProps, withStudentService } from '../../../service/StudentService';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import { ModuleVisitServiceProps, withModuleVisitService } from '../../../service/ModuleVisitService';
import DeleteModuleVisitDialog from '../dialog/DeleteModuleVisitDialog';
import { AuthServiceProps, withAuthService } from '../../../service/AuthService';

interface SemesterListState {
    semesterModuleMap?: { [key: string]: ModuleVisit[] };
    moduleVisitToDelete?: ModuleVisit;
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
        this.props.moduleVisitService.list().then(
            (semesterModuleMap: { [key: string]: ModuleVisit[] }) => this.setState({ semesterModuleMap })
        );
    }

    private handleConfirmDelete = () => {
        const { moduleVisitToDelete, semesterModuleMap } = this.state;
        if (moduleVisitToDelete && semesterModuleMap) {
            this.props.moduleVisitService.delete(moduleVisitToDelete.id as string).then(_ => {
                const list = semesterModuleMap[moduleVisitToDelete.semester];
                const index = list.indexOf(moduleVisitToDelete);
                list.splice(index, 1);
                this.setState({ moduleVisitToDelete: undefined })
            }).catch(_ => this.setState({ moduleVisitToDelete: undefined }));
        }
    };

    private handleCancelDelete = () => {
        this.setState({ moduleVisitToDelete: undefined })
    };

    private handleDeleteModuleVisit = (moduleVisitToDelete: ModuleVisit) => {
        this.setState({ moduleVisitToDelete })
    };

    public render() {
        const { classes } = this.props;
        const { semesterModuleMap } = this.state;
        let totalCredits = 0;
        let currentCredits = 0;
        let currentNegativeCredits = 0;
        let weighedGradeSum = 0;
        let divider = 0;
        if (semesterModuleMap) {
            const keys = Object.keys(semesterModuleMap);
            keys.forEach(key => {
                semesterModuleMap[key].forEach(mv => {
                    const credits = mv.module.credits;
                    totalCredits += credits;
                    if (mv.state === 'passed') {
                        currentCredits += credits;
                        weighedGradeSum += mv.module.credits * mv.grade;
                        divider += mv.module.credits;
                    } else if (mv.state === 'failed') {
                        currentNegativeCredits += credits;
                        weighedGradeSum += mv.module.credits * mv.grade;
                        divider += mv.module.credits;
                    }
                });
            });
        }
        let averageGrade = weighedGradeSum / divider;

        return (
            <div className={classes.root}>
                <div className={classes.list}>
                    {semesterModuleMap && Object.keys(semesterModuleMap).map(key => (
                        <SemesterPreview
                            key={key}
                            semester={key}
                            moduleVisits={semesterModuleMap[key]}
                            onDeleteModuleVisit={this.handleDeleteModuleVisit}
                        />
                    ))}
                </div>
                <div>{currentCredits} / {totalCredits}</div>
                <div>{currentNegativeCredits} / 60</div>
                <div>Grade: {averageGrade}</div>
                <DeleteModuleVisitDialog open={!!this.state.moduleVisitToDelete} onCancel={this.handleCancelDelete}
                                         onConfirm={this.handleConfirmDelete}/>
            </div>
        );
    }

}

export default withAuthService(withStudentService(withModuleVisitService(withStyles(SemesterListStyle)(SemesterList))));