import * as React from 'react';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import {ModuleVisitServiceProps, withModuleVisitService} from '../../../service/ModuleVisitService';
import ModuleVisit from '../../../model/ModuleVisit';
import {
    IconButton,
    StyledComponentProps,
    Typography,
    withStyles
} from "@material-ui/core";
import SemesterViewStyle from './SemesterViewStyle';
import {ClassNameMap} from "@material-ui/core/styles/withStyles";
import SemesterModuleVisit from "../list/SemesterModuleVisit";
import {AddCircle} from "@material-ui/icons";
import DeleteModuleVisitDialog from "../dialog/DeleteModuleVisitDialog";
import SemesterStatistics from "./SemesterStatistics";
import {Trans, WithTranslation, withTranslation} from 'react-i18next';

interface SemesterViewProps extends RouteComponentProps<{ id: any }>, StyledComponentProps, ModuleVisitServiceProps, WithTranslation {
    classes: ClassNameMap;
}

interface SemesterViewState {
    semesterMap?: ModuleVisit[];
    semester: string;
    selectedModuleVisit?: ModuleVisit;
    deletingModuleVisit?: ModuleVisit;
}

class SemesterView extends React.Component<SemesterViewProps, SemesterViewState> {

    constructor(props: Readonly<SemesterViewProps>) {
        super(props);
        this.state = {semester: this.props.match.params.id};
    }

    componentDidMount(): void {
        this.props.moduleVisitService.list().then(map => this.setState({semesterMap: map[this.state.semester] || []}));
    }

    private moduleVisitClickHandler = (selectedModuleVisit: ModuleVisit) => () => {
        // TODO: implement this
    }

    private moduleVisitDeleteHandler = (deletingModuleVisit: ModuleVisit) => () => {
        this.setState({deletingModuleVisit})
    }

    private handleConfirmDelete = () => {
        const {deletingModuleVisit} = this.state;
        let {semesterMap} = this.state;
        if (deletingModuleVisit && semesterMap) {
            this.props.moduleVisitService.delete(deletingModuleVisit.id as string);
            semesterMap = semesterMap.filter(mv => (mv.id !== deletingModuleVisit.id));
            this.setState({semesterMap, deletingModuleVisit: undefined});
        }
    }

    private handleCancelDelete = () => {
        this.setState({deletingModuleVisit: undefined})
    }


    private handleAddButtonClick = () => {
        // TODO: implement this
    }

    public render() {
        const {classes} = this.props;
        const {semester, semesterMap} = this.state;

        return (
            <div className={classes.root}>
                {this.getOverview(classes, semester, semesterMap)}
                {SemesterView.getStatistic(classes, semesterMap)}
            </div>
        );

    }

    private static getStatistic(classes: ClassNameMap, semesterMap: ModuleVisit[] | undefined) {
        return <>
            <div className={classes.header}>
                <Typography variant="h6" className={classes.title}>
                    <Trans>translation:messages.semesterStatistic.title</Trans></Typography>
                <hr className={classes.rule}/>
            </div>
            <div className={classes.content}>

                <div className={classes.modules}>
                    {semesterMap &&
                    <SemesterStatistics
                        moduleVisits={semesterMap}>
                    </SemesterStatistics>
                    }
                </div>
            </div>
            <div>
                <br/>
            </div>

        </>;
    }

    private getOverview(classes: ClassNameMap, semester: string, semesterMap: ModuleVisit[] | undefined) {
        return <>
            <div className={classes.header}>
                <Typography variant="h6" className={classes.title}>{semester}</Typography>
                <hr className={classes.rule}/>
            </div>
            <div className={classes.content}>
                <div className={classes.modules}>
                    {semesterMap && semesterMap.map(mv => (
                        <SemesterModuleVisit
                            key={mv.id}
                            moduleVisit={mv}
                            onClick={this.moduleVisitClickHandler(mv)}
                            onDelete={this.moduleVisitDeleteHandler(mv)}
                            isDetailed={true}
                        />
                    ))}
                </div>
                <div className={classes.buttonSpace}>
                    <IconButton color="primary" size="medium" onClick={this.handleAddButtonClick}>
                        <AddCircle
                            className={classes.button}
                        />
                    </IconButton>
                </div>
            </div>
            <DeleteModuleVisitDialog open={!!this.state.deletingModuleVisit} onCancel={this.handleCancelDelete}
                                     onConfirm={this.handleConfirmDelete}/>
        </>;
    }
}

export default withRouter(withTranslation()(withModuleVisitService(withStyles(SemesterViewStyle)(SemesterView))));