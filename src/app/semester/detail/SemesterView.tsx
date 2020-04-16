import * as React from 'react';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { ModuleVisitServiceProps, withModuleVisitService } from '../../../service/ModuleVisitService';
import ModuleVisit from '../../../model/ModuleVisit';
import {
    IconButton,
    StyledComponentProps,
    Typography,
    withStyles
} from "@material-ui/core";
import SemesterViewStyle from './SemesterViewStyle';
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import SemesterModuleVisit from "../list/SemesterModuleVisit";
import { AddCircle } from "@material-ui/icons";
import DeleteModuleVisitDialog from "../dialog/DeleteModuleVisitDialog";
import SemesterStatistics from "./SemesterStatistics";
import { Trans, WithTranslation, withTranslation } from 'react-i18next';
import ModuleVisitDialog from '../dialog/ModuleVisitDialog';

interface SemesterViewProps extends RouteComponentProps<{ id: any }>, StyledComponentProps, ModuleVisitServiceProps, WithTranslation {
    classes: ClassNameMap;
}

interface SemesterViewState {
    moduleList?: ModuleVisit[];
    selectedModuleVisit?: ModuleVisit;
    moduleVisitToDelete?: ModuleVisit;
    createModuleVisit?: boolean;
}

class SemesterView extends React.Component<SemesterViewProps, SemesterViewState> {

    private readonly semester: string;

    constructor(props: Readonly<SemesterViewProps>) {
        super(props);
        this.state = {};
        this.semester = props.match.params.id;
    }

    componentDidMount() {
        if (/^(?:fs|hs)[0-9]{1,2}$/.test(this.semester)) {
            this.props.moduleVisitService
                .map()
                .then(map => this.setState({ moduleList: map[this.semester] || [] }));
        }
    }

    private moduleVisitClickHandler = (selectedModuleVisit: ModuleVisit) => () => {
        this.setState({ selectedModuleVisit });
    };

    private moduleVisitDeleteHandler = (moduleVisitToDelete: ModuleVisit) => () => {
        this.setState({ moduleVisitToDelete })
    };

    private handleConfirmDelete = () => {
        const { moduleVisitToDelete } = this.state;
        if (moduleVisitToDelete) {
            const id = moduleVisitToDelete.id as string;
            this.props.moduleVisitService.delete(id).then(_ => {
                this.removeModule(id);
                this.setState({ moduleVisitToDelete: undefined });
            }).catch(error => {
                this.setState({ moduleVisitToDelete: undefined });
                console.log(error);
            });
        }
    };

    private removeModule = (id: string) => {
        const moduleList = this.state.moduleList;
        if (moduleList) {
            const index = moduleList.findIndex(visit => visit.id === id);
            moduleList.splice(index, 1);
            this.setState({ moduleList });
        }
    };

    private handleDeleted = (id: string) => {
        this.removeModule(id);
        this.handleCancelModuleVisitDialog();
    };

    private handleCancelDelete = () => {
        this.setState({ moduleVisitToDelete: undefined })
    };


    private handleAddButtonClick = () => {
        this.setState({ createModuleVisit: true });
    };

    private handleFinishCreateModuleVisit = (visit: ModuleVisit) => {
        const { moduleList, createModuleVisit } = this.state;
        if (!moduleList) return;
        if (createModuleVisit) {
            moduleList.push(visit);
            this.setState({
                createModuleVisit: false,
                moduleList: this.props.moduleVisitService.sortList(moduleList)
            });
        } else {
            const index = moduleList.findIndex(v => v.id === visit.id);
            moduleList.splice(index, 1, visit);
            this.setState({
                selectedModuleVisit: undefined,
                moduleList: this.props.moduleVisitService.sortList(moduleList)
            });
        }
    };

    private handleCancelModuleVisitDialog = () => {
        this.setState({ createModuleVisit: false, selectedModuleVisit: undefined });
    };

    public render() {
        const { classes } = this.props;

        if (!/^(?:fs|hs)[0-9]{1,2}$/.test(this.semester)) {
            return (
                <div>
                    <div><Trans>translation:messages.semester.invalid</Trans></div>
                    <div><Link to="/"><Trans>translation:messages.semester.backToList</Trans></Link></div>
                </div>
            );
        }

        return (
            <div className={classes.root}>
                {this.getOverview()}
                {this.getStatistic()}
            </div>
        );

    }

    private getStatistic() {
        const { classes } = this.props;
        const { moduleList } = this.state;

        return <>
            <div className={classes.header}>
                <Typography variant="h6" className={classes.title}>
                    <Trans>translation:messages.semesterStatistic.title</Trans></Typography>
                <hr className={classes.rule}/>
            </div>
            <div className={classes.content}>

                <div className={classes.modules}>
                    {moduleList &&
                    <SemesterStatistics
                        moduleVisits={moduleList}>
                    </SemesterStatistics>
                    }
                </div>
            </div>
            <div>
                <br/>
            </div>

        </>;
    }

    private getOverview() {
        const { classes } = this.props;
        const { moduleList } = this.state;

        return <>
            <div className={classes.header}>
                <Typography variant="h6" className={classes.title}>{this.semester}</Typography>
                <hr className={classes.rule}/>
            </div>
            <div className={classes.content}>
                <div className={classes.modules}>
                    {moduleList && moduleList.map(mv => (
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
            <DeleteModuleVisitDialog
                open={!!this.state.moduleVisitToDelete}
                onCancel={this.handleCancelDelete}
                onConfirm={this.handleConfirmDelete}
            />
            <ModuleVisitDialog
                semester={this.semester}
                open={this.state.createModuleVisit || !!this.state.selectedModuleVisit}
                edit={this.state.selectedModuleVisit}
                onFinished={this.handleFinishCreateModuleVisit}
                onCancel={this.handleCancelModuleVisitDialog}
                onDeleted={this.handleDeleted}
            />
        </>;
    }
}

export default withRouter(withTranslation()(withModuleVisitService(withStyles(SemesterViewStyle)(SemesterView))));