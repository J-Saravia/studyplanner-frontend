import * as React from 'react';
import {
    IconButton, isWidthDown,
    StyledComponentProps,
    Typography,
    withStyles,
    withWidth,
    WithWidthProps
} from '@material-ui/core';
import SemesterPreviewStyle from './SemesterPreviewStyle';
import { AddCircle } from '@material-ui/icons';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import SemesterModuleVisit from './SemesterModuleVisit';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import ModuleVisit from '../../../model/ModuleVisit';
import { Link } from 'react-router-dom';
import ModuleVisitDialog from '../dialog/ModuleVisitDialog';
import DeleteModuleVisitDialog from '../dialog/DeleteModuleVisitDialog';
import { ModuleVisitServiceProps, withModuleVisitService } from '../../../service/ModuleVisitService';
import { Alert } from '@material-ui/lab';
import { Trans } from 'react-i18next';


interface SemesterPreviewProps extends StyledComponentProps, WithWidthProps, ModuleVisitServiceProps {
    classes: ClassNameMap;
    semester: string;
    moduleVisits: ModuleVisit[];
    width: Breakpoint;
    onChange: (moduleVisits: ModuleVisit[]) => void;
}

interface SemesterPreviewState {
    selectedModuleVisit?: ModuleVisit;
    moduleVisitToDelete?: ModuleVisit;
    createModuleVisit?: boolean;
    moduleVisits: ModuleVisit[];
    error?: string;
}

class SemesterPreview extends React.Component<SemesterPreviewProps, SemesterPreviewState> {

    constructor(props: Readonly<SemesterPreviewProps>) {
        super(props);
        this.state = {
            moduleVisits: props.moduleVisits
        };
    }

    private moduleVisitClickHandler = (selectedModuleVisit: ModuleVisit) => () => {
        this.setState({ selectedModuleVisit });
    };

    private moduleVisitDeleteHandler = (moduleVisitToDelete: ModuleVisit) => () => {
        this.setState({ moduleVisitToDelete });
    };


    private handleConfirmDelete = () => {
        const { moduleVisitToDelete } = this.state;
        if (moduleVisitToDelete) {
            const id = moduleVisitToDelete.id as string;
            this.props.moduleVisitService.delete(id).then(_ => {
                this.removeModule(id);
                this.setState({ moduleVisitToDelete: undefined, error: undefined });
            }).catch(error => {
                this.setState({ moduleVisitToDelete: undefined, error: error.toString() });
            });
        }
    };

    private removeModule = (id: string) => {
        const moduleVisits = this.state.moduleVisits;
        if (moduleVisits) {
            const index = moduleVisits.findIndex(visit => visit.id === id);
            moduleVisits.splice(index, 1);
            this.setState({ moduleVisits });
            this.props.onChange(moduleVisits);
        }
    };

    private handleDeleted = (id: string) => {
        this.removeModule(id);
        this.handleCancelModuleVisitDialog();
    };

    private handleAddButtonClick = () => {
        this.setState({ createModuleVisit: true });
    };

    private handleFinishModuleVisit = (visit: ModuleVisit) => {
        const { moduleVisits, createModuleVisit } = this.state;
        if (createModuleVisit) {
            moduleVisits.push(visit);
            this.setState({
                createModuleVisit: false,
                moduleVisits: this.props.moduleVisitService.sortList(moduleVisits)
            });
            this.props.onChange(moduleVisits);
        } else {
            const index = moduleVisits.findIndex(v => v.id === visit.id);
            moduleVisits.splice(index, 1, visit);
            this.setState({
                selectedModuleVisit: undefined,
                moduleVisits: this.props.moduleVisitService.sortList(moduleVisits)
            });
            this.props.onChange(moduleVisits);
        }
    };

    private handleCancelModuleVisitDialog = () => {
        this.setState({ createModuleVisit: false, selectedModuleVisit: undefined });
    };

    private handleCancelDelete = () => {
        this.setState({ moduleVisitToDelete: undefined });
    };

    public render() {
        const { classes, moduleVisits, semester, width } = this.props;
        const { error, createModuleVisit, selectedModuleVisit } = this.state;
        const isMobile = isWidthDown('sm', width);
        const showModuleVisitDialog = createModuleVisit || selectedModuleVisit;

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
                <Link to={`/semester/${semester}`} className={classes.header}>
                    <Typography variant="h6" className={classes.title}>{semester}</Typography>
                    <hr className={classes.rule}/>
                </Link>
                <div className={classes.content}>
                    <div className={classes.modules}>
                        {moduleVisits && moduleVisits.map(mv => (
                            <SemesterModuleVisit
                                key={`semesterPreview-moduleVisit-${mv.id}`}
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
                {error && <Alert color="error"><Trans>translation:semester.delete.error</Trans></Alert>}
                <DeleteModuleVisitDialog
                    open={!!this.state.moduleVisitToDelete}
                    onCancel={this.handleCancelDelete}
                    onConfirm={this.handleConfirmDelete}
                />
                {showModuleVisitDialog && (
                    <ModuleVisitDialog
                        semester={semester}
                        open={this.state.createModuleVisit || !!this.state.selectedModuleVisit}
                        edit={this.state.selectedModuleVisit}
                        onFinished={this.handleFinishModuleVisit}
                        onCancel={this.handleCancelModuleVisitDialog}
                        onDeleted={this.handleDeleted}
                    />)
                }
            </div>
        );
    }
}

export default withWidth()(withModuleVisitService(withStyles(SemesterPreviewStyle)(SemesterPreview)));