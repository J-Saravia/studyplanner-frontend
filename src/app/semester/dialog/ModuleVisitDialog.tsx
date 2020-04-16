import * as React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    StyledComponentProps,
    TextField,
    TextFieldProps,
    withStyles
} from '@material-ui/core';
import SelectModuleDialog from './SelectModuleDialog';
import ModuleVisit from '../../../model/ModuleVisit';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import ModuleVisitDialogStyle from './ModuleVisitDialogStyle';
import clsx from 'clsx';
import ModuleInfo from '../../../model/ModuleInfo';
import withServices, { WithServicesProps } from '../../../service/WithServices';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';
import { Close } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import DeleteModuleVisitDialog from './DeleteModuleVisitDialog';

interface CreateModuleVisitDialogProps extends StyledComponentProps, WithServicesProps, WithTranslation {
    open?: boolean;
    onCancel?: () => void;
    onFinished?: (moduleVisit: ModuleVisit) => void;
    onDeleted?: (id: string) => void;
    edit?: ModuleVisit;
    classes: ClassNameMap;
    semester: string;
}

interface CreateModuleVisitDialogState {
    selectedModuleInfo?: ModuleInfo;
    moduleVisit: ModuleVisit;
    isModuleSelectionOpen?: boolean;
    error: { [K in keyof ModuleVisit]?: any }
    submitting?: boolean;
    submissionError?: string;
    deleteVisit?: boolean;
}

class ModuleVisitDialog extends React.Component<CreateModuleVisitDialogProps, CreateModuleVisitDialogState> {

    constructor(props: Readonly<CreateModuleVisitDialogProps>) {
        super(props);
        this.state = {
            moduleVisit: props.edit || {
                state: 'planned',
                student: props.authService.getCurrentStudent(),
                weekday: 0,
                timeStart: '08:15',
                timeEnd: '11:00',
                semester: props.semester,
                grade: 0,
            } as ModuleVisit,
            error: { module: false },
        };
    }

    componentDidUpdate(prevProps: Readonly<CreateModuleVisitDialogProps>, prevState: Readonly<CreateModuleVisitDialogState>, snapshot?: any): void {
        if (!prevProps.open && this.props.open) {
            this.setState({
                moduleVisit: this.props.edit || {
                    state: 'planned',
                    student: this.props.authService.getCurrentStudent(),
                    weekday: 0,
                    timeStart: '08:15',
                    timeEnd: '11:00',
                    semester: this.props.semester,
                    grade: 0
                } as ModuleVisit,
                error: { module: false }
            });
        }
    }

    private handleModuleSelect = (selected: ModuleInfo) => {
        const moduleVisit = this.state.moduleVisit;
        moduleVisit.module = selected.module;
        this.setState({ selectedModuleInfo: selected, moduleVisit });
        this.closeSelectionDialog();
    };

    private openSelectionDialog = () => {
        this.setState({ isModuleSelectionOpen: true });
    };

    private closeSelectionDialog = () => {
        this.setState({ isModuleSelectionOpen: false });
    };

    private handleClose = () => {
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    };

    private inputChangeHandler = (key: keyof ModuleVisit) => (event: React.ChangeEvent<{ value: unknown, name?: string }>) => {
        const moduleVisit = { ...this.state.moduleVisit, [key]: event.target.value };
        this.setState({ moduleVisit });
    };

    private renderInput = (name: keyof ModuleVisit, extraProps?: TextFieldProps) => {
        const { t } = this.props;
        const { error } = this.state;
        return (
            <TextField
                error={error[name]}
                id={`moduleVisit-input-${name}`}
                label={t(`translation:messages.moduleVisit.dialog.field.${name}.title`)}
                helperText={t(`translation:messages.moduleVisit.dialog.field.${name}.help`)}
                value={this.state.moduleVisit[name]}
                onChange={this.inputChangeHandler(name)}
                fullWidth
                required
                {...extraProps}
            />
        )
    };

    private renderModuleStateIndicator = () => {
        const { classes } = this.props;
        const { state } = this.state.moduleVisit;
        return <div className={clsx(classes.stateIndicator, {
            [classes.statePassed]: state === 'passed',
            [classes.stateFailed]: state === 'failed',
            [classes.stateOngoing]: state === 'ongoing',
            [classes.statePlanned]: state === 'planned'
        })}/>;
    };

    private renderModuleSelection = () => {
        const { classes, edit } = this.props;
        const { error, moduleVisit } = this.state;
        const { module } = moduleVisit;
        const readonly = !!edit;
        return (
            <FormControl
                error={!!error.module}
                className={classes.module}
                onClick={readonly ? undefined : this.openSelectionDialog}
                required
            >
                <InputLabel shrink>
                    <Trans>translation:messages.moduleVisit.dialog.field.module.title</Trans>
                </InputLabel>
                <span className={clsx({ [classes.moduleButton]: !readonly })}>
                    {module ? module.name : <Trans>translation:messages.moduleVisit.dialog.field.module.select</Trans>}
                </span>
                <FormHelperText error>{error.module}</FormHelperText>
            </FormControl>
        );
    };

    private validate = () => {
        const { error, moduleVisit, selectedModuleInfo } = this.state;
        const { semester } = this.props;
        let hasErrors = false;

        if (!moduleVisit.module) {
            hasErrors = !!(error.module =
                <Trans>translation:messages.moduleVisit.dialog.field.module.error.empty</Trans>);
        } else if (selectedModuleInfo) {
            if (selectedModuleInfo.state === 'passed') {
                hasErrors = !!(error.module =
                    <Trans>translation:messages.moduleVisit.dialog.field.module.error.passed</Trans>);
            } else if (selectedModuleInfo.state === 'blocked') {
                hasErrors = !!(error.module =
                    <Trans>translation:messages.moduleVisit.dialog.field.module.error.blocked</Trans>);
            } else if (selectedModuleInfo.semesters.indexOf(semester) >= 0) {
                hasErrors = !!(error.module =
                    <Trans>translation:messages.moduleVisit.dialog.field.module.error.alreadyInSemester</Trans>);
            }
        }

        if (!moduleVisit.grade && moduleVisit.grade !== 0) {
            hasErrors = error.grade = true;
        } else if (moduleVisit.grade < 0 || moduleVisit.grade > 6) {
            hasErrors = error.grade = true;
        }

        if (!moduleVisit.timeStart) {
            hasErrors = error.timeStart = true;
        } else if (!/^(?:[0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(moduleVisit.timeStart)) {
            hasErrors = error.timeStart = true;
        }

        if (!moduleVisit.timeEnd) {
            hasErrors = error.timeStart = true;
        } else if (!/^(?:[0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(moduleVisit.timeEnd)) {
            hasErrors = error.timeEnd = true;
        }

        this.setState({ error });
        return !hasErrors;
    };

    private handleFinish = (result: ModuleVisit) => {
        if (this.props.onFinished) {
            this.props.onFinished(result);
        }
        this.setState({ submitting: false });
    };

    private handleDelete = () => {
        this.setState({ deleteVisit: true });
    };

    private handleDeleteCancel = () => {
        this.setState({ deleteVisit: false });
    };

    private handleDeleteConfirm = () => {
        const id = this.props.edit?.id as string;
        this.setState({ deleteVisit: undefined, submitting: true }, () => {
            this.props.moduleVisitService.delete(id).then(() => {
                if (this.props.onDeleted) {
                    this.props.onDeleted(id);
                }
                this.setState({ submitting: false });
            }).catch(error => {
                this.setState({ submitting: false });
                this.handleSubmissionFailure(error);
            });

        });
    };

    private handleSubmissionFailure = (error: any) => {
        this.setState({ submissionError: error.toString(), submitting: false });
    };

    private handleSubmit = (event: React.BaseSyntheticEvent) => {
        event.preventDefault();
        if (this.validate()) {
            this.setState({ submitting: true });
            if (this.props.edit) {
                this.props.moduleVisitService
                    .update(this.props.edit.id as string, this.state.moduleVisit)
                    .then(this.handleFinish)
                    .catch(this.handleSubmissionFailure);
            } else {
                this.props.moduleVisitService
                    .create(this.state.moduleVisit)
                    .then(this.handleFinish)
                    .catch(this.handleSubmissionFailure);
            }
        }
    };

    public render() {
        const { classes, edit } = this.props;
        const { submissionError, submitting, isModuleSelectionOpen, moduleVisit, deleteVisit } = this.state;
        return (
            <>
                <Dialog
                    maxWidth="sm"
                    fullWidth
                    open={!!this.props.open}
                    onClose={this.handleClose}
                >
                    <DialogTitle>
                        <div className={classes.title}>
                            <Trans>translation:messages.moduleVisit.dialog.title</Trans>
                            <div className={classes.grow}/>
                            <IconButton onClick={this.handleClose}>
                                <Close/>
                            </IconButton>
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <form onSubmit={this.handleSubmit} className={classes.root}>
                            {this.renderModuleSelection()}
                            {this.renderInput('semester', { disabled: true })}
                            {this.renderInput('grade', { type: 'number' })}
                            <FormControl required>
                                <InputLabel
                                    shrink><Trans>translation:messages.moduleVisit.dialog.field.weekday.title</Trans></InputLabel>
                                <Select
                                    onChange={this.inputChangeHandler('weekday')}
                                    value={moduleVisit.weekday}
                                >
                                    <MenuItem value={0}>
                                        <Trans>translation:messages.moduleVisit.dialog.field.weekday.0</Trans>
                                    </MenuItem>
                                    <MenuItem value={1}>
                                        <Trans>translation:messages.moduleVisit.dialog.field.weekday.1</Trans>
                                    </MenuItem>
                                    <MenuItem value={2}>
                                        <Trans>translation:messages.moduleVisit.dialog.field.weekday.2</Trans>
                                    </MenuItem>
                                    <MenuItem value={3}>
                                        <Trans>translation:messages.moduleVisit.dialog.field.weekday.3</Trans>
                                    </MenuItem>
                                    <MenuItem value={4}>
                                        <Trans>translation:messages.moduleVisit.dialog.field.weekday.4</Trans>
                                    </MenuItem>
                                    <MenuItem value={5}>
                                        <Trans>translation:messages.moduleVisit.dialog.field.weekday.5</Trans>
                                    </MenuItem>
                                </Select>
                            </FormControl>
                            {this.renderInput('timeStart')}
                            {this.renderInput('timeEnd')}

                            <FormControl required className={classes.stateControl}>
                                <InputLabel
                                    shrink><Trans>translation:messages.moduleVisit.dialog.field.state.title</Trans></InputLabel>
                                <div className={classes.stateSelection}>
                                    {this.renderModuleStateIndicator()}
                                    <Select className={classes.stateSelectionSelect}
                                            onChange={this.inputChangeHandler('state')}
                                            value={moduleVisit.state}>
                                        <MenuItem value="planned">
                                            <Trans>translation:messages.moduleVisit.dialog.field.state.planned</Trans>
                                        </MenuItem>
                                        <MenuItem value="ongoing">
                                            <Trans>translation:messages.moduleVisit.dialog.field.state.ongoing</Trans>
                                        </MenuItem>
                                        <MenuItem value="passed">
                                            <Trans>translation:messages.moduleVisit.dialog.field.state.passed</Trans>
                                        </MenuItem>
                                        <MenuItem value="failed">
                                            <Trans>translation:messages.moduleVisit.dialog.field.state.failed</Trans>
                                        </MenuItem>
                                    </Select>
                                </div>
                            </FormControl>
                            {submissionError &&
                            <Alert color="error"><Trans>translation:messages.moduleVisit.dialog.error</Trans></Alert>
                            }
                            <input type="submit" hidden/>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        {edit &&
                        <Button
                            color="secondary"
                            variant="contained"
                            onClick={this.handleDelete}
                            disabled={submitting}
                        >
                          <Trans>translation:messages.moduleVisit.dialog.delete</Trans>
                        </Button>
                        }
                        <div className={classes.grow}/>
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={this.handleSubmit}
                            disabled={submitting}
                        >
                            <Trans>translation:messages.moduleVisit.dialog.save</Trans>
                        </Button>
                    </DialogActions>
                </Dialog>
                <SelectModuleDialog
                    open={isModuleSelectionOpen}
                    onCancel={this.closeSelectionDialog}
                    onSelect={this.handleModuleSelect}
                />
                <DeleteModuleVisitDialog open={!!deleteVisit} onCancel={this.handleDeleteCancel}
                                         onConfirm={this.handleDeleteConfirm}/>
            </>
        );
    }
}

export default withServices(withStyles(ModuleVisitDialogStyle)(withTranslation()(ModuleVisitDialog)));
