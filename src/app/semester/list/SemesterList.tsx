import * as React from 'react';
import SemesterPreview from './SemesterPreview';
import { Button, StyledComponentProps, withStyles } from '@material-ui/core';
import SemesterListStyle from './SemesterListStyle';
import ModuleVisit from '../../../model/ModuleVisit';
import { StudentServiceProps, withStudentService } from '../../../service/StudentService';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import { ModuleVisitServiceProps, withModuleVisitService } from '../../../service/ModuleVisitService';
import { AuthServiceProps, withAuthService } from '../../../service/AuthService';
import { Trans } from 'react-i18next';
import CreateSemesterDialog from '../dialog/CreateSemesterDialog';

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
        let totalCredits = 0;
        let currentCredits = 0;
        let currentNegativeCredits = 0;
        let weightedGradeSum = 0;
        let divider = 0;
        if (semesterModuleMap) {
            const keys = Object.keys(semesterModuleMap);
            keys.forEach(key => {
                semesterModuleMap[key].forEach(mv => {
                    const credits = mv.module.credits;
                    totalCredits += credits;
                    if (mv.state === 'passed') {
                        currentCredits += credits;
                        if (mv.grade) {
                            weightedGradeSum += mv.module.credits * mv.grade;
                            divider += mv.module.credits;
                        }
                    } else if (mv.state === 'failed') {
                        currentNegativeCredits += credits;
                        weightedGradeSum += mv.module.credits * mv.grade;
                        divider += mv.module.credits;
                    }
                });
            });
        }
        let averageGrade = (weightedGradeSum / divider).toFixed(2);

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
                </div>
                <div>{currentCredits} / {totalCredits}</div>
                <div>{currentNegativeCredits} / 60</div>
                <div>Grade: {averageGrade}</div>
                <CreateSemesterDialog open={createSemester} onCancel={this.handleCreateSemesterCancel}/>
            </div>
        );
    }

}

export default withAuthService(withStudentService(withModuleVisitService(withStyles(SemesterListStyle)(SemesterList))));