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
import { Alert } from '@material-ui/lab';

interface SemesterListState {
    semesterModuleMapReadonly?: { [key: string]: ModuleVisit[] };
    semesterModuleMap?: { [key: string]: ModuleVisit[] };
    createSemester?: boolean;
    error?: string;
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
            (semesterModuleMap: { [key: string]: ModuleVisit[] }) => this.setState({ semesterModuleMap, semesterModuleMapReadonly: semesterModuleMap })
        ).catch(error => this.setState({error: error.toString()}));
    }

    private handleCreateSemester = () => {
        this.setState({ createSemester: true });
    };

    private handleCreateSemesterCancel = () => {
        this.setState({ createSemester: false });
    };

    private changeHandler = (semester: string) => (moduleVisits: ModuleVisit[]) => {
        const { semesterModuleMap } = this.state;
        if (!semesterModuleMap) return;
        semesterModuleMap[semester] = moduleVisits;
        this.setState({semesterModuleMap});
    };

    private sortKeys() {
        const {semesterModuleMapReadonly} = this.state;
        let result;
        if (semesterModuleMapReadonly) {
            result = Object.keys(semesterModuleMapReadonly);
            result = result.sort((a, b) => parseInt((b.substr(2))) - (parseInt(a.substr(2))));
            result = result.sort((c, d) => {
                if (c.substr(2) === d.substr(2)) {
                    return d.localeCompare(c);
                }
                return 0;
            });
        }
        return result;
    }


    public render() {
        const {classes} = this.props;
        const {semesterModuleMapReadonly, createSemester, error} = this.state;

        let sortedKeys = this.sortKeys();

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
                    {semesterModuleMapReadonly && sortedKeys && sortedKeys.map(key => (
                        <SemesterPreview
                            key={key}
                            semester={key}
                            moduleVisits={semesterModuleMapReadonly[key]}
                            onChange={this.changeHandler(key)}
                        />
                    ))}

                </div>
                {!error && this.getStatistic()}
                {error && <Alert color="error"><Trans>translation:messages.semester.load.error</Trans></Alert>}
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