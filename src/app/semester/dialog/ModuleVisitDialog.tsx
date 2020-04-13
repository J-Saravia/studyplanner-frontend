import * as React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, InputLabel,
    MenuItem,
    Select,
    StyledComponentProps,
    TextField,
    TextFieldProps,
    withStyles
} from '@material-ui/core';
import SelectModuleDialog  from './SelectModuleDialog';
import ModuleVisit from '../../../model/ModuleVisit';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import ModuleVisitDialogStyle from './ModuleVisitDialogStyle';
import clsx from 'clsx';
import ModuleInfo from '../../../model/ModuleInfo';
import withServices, { WithServicesProps } from '../../../service/WithServices';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';

interface CreateModuleVisitDialogProps extends StyledComponentProps, WithServicesProps, WithTranslation {
    open?: boolean;
    onCancel?: () => void;
    onFinished?: (moduleVisit: ModuleVisit) => void;
    edit?: ModuleVisit;
    classes: ClassNameMap;
    semester?: string;
}

interface CreateModuleVisitDialogState {
    selectedModuleInfo?: ModuleInfo;
    moduleVisit: ModuleVisit;
    isModuleSelectionOpen?: boolean;
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
            } as ModuleVisit
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
                    grade: 0,
                } as ModuleVisit
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
        this.setState({isModuleSelectionOpen: true});
    };

    private closeSelectionDialog = () => {
        this.setState({isModuleSelectionOpen: false});
    };

    private handleClose = () =>  {
        if(this.props.onCancel) {
            this.props.onCancel();
        }
    };

    private inputChangeHandler = (key: keyof ModuleVisit)  => (event: React.ChangeEvent<{value: unknown, name?: string}>) => {
        const moduleVisit = {...this.state.moduleVisit, [key]: event.target.value};
        this.setState({moduleVisit});
    };

    private renderInput = (name: keyof ModuleVisit, extraProps?: TextFieldProps) => {
        const { t } = this.props;
        return (<div>
            <TextField
                {...extraProps}
                id={`moduleVisit-input-${name}`}
                label={t(`translation:messages.moduleVisit.dialog.field.${name}`)}
                value={this.state.moduleVisit[name]}
                onChange={this.inputChangeHandler(name)}
                fullWidth
            />
        </div>)
    };

    private renderModuleStateIndicator = () => {
        const {classes} = this.props;
        const {state} = this.state.moduleVisit;
        return <div className={clsx(classes.stateIndicator, {
            [classes.statePassed]: state === 'passed',
            [classes.stateFailed]: state === 'failed',
            [classes.stateOngoing]: state === 'ongoing',
            [classes.statePlanned]: state === 'planned'
        })} />;
    };

    private renderModuleSelection = () => {
        const {classes, edit} = this.props;
        const {module} = this.state.moduleVisit;
        const readonly = !!edit;
        return (
            <div className={classes.module} onClick={readonly ? undefined : this.openSelectionDialog}>
                <InputLabel shrink>Module</InputLabel>
                <span className={clsx(classes.module, {[classes.moduleButton]: !readonly})}  >{module ? module.name : 'modül auswählen'}</span>
            </div>
        );
    };

    private handleSubmit = () => {
        const finish = (result: ModuleVisit) => {
            if (this.props.onFinished) {
                this.props.onFinished(result);
            }
        };
        if (this.props.edit) {
            this.props.moduleVisitService.update(this.props.edit.id as string, this.state.moduleVisit).then(finish).catch(error => console.error(error)); // TODO: handle error
        } else {
            this.props.moduleVisitService.create(this.state.moduleVisit).then(finish).catch(error => console.error(error)); // TODO: handle error
        }
    };

    public render() {
        const { classes } = this.props;
        return (
            <>
                <Dialog
                    maxWidth="sm"
                    fullWidth
                    open={!!this.props.open}>
                    <DialogTitle>ModuleVisit Dialog</DialogTitle>
                    <DialogContent className={classes.root}>
                        {this.renderModuleSelection()}
                        {this.renderInput('semester', {disabled: true})}
                        {this.renderInput('grade', {type: 'number'})}
                        <Select onChange={this.inputChangeHandler('weekday')} value={this.state.moduleVisit.weekday}>
                            <MenuItem value={0}>Monday</MenuItem>
                            <MenuItem value={1}>Tuesday</MenuItem>
                            <MenuItem value={2}>Wednesday</MenuItem>
                            <MenuItem value={3}>Thursday</MenuItem>
                            <MenuItem value={4}>Friday</MenuItem>
                            <MenuItem value={5}>Saturday</MenuItem>
                        </Select>
                        {this.renderInput('timeStart')}
                        {this.renderInput('timeEnd')}
                        <div className={classes.stateSelection}>
                            {this.renderModuleStateIndicator()}
                            <Select className={classes.stateSelectionSelect} onChange={this.inputChangeHandler('state')} value={this.state.moduleVisit.state}>
                                <MenuItem value="planned">Planned</MenuItem>
                                <MenuItem value="ongoing">Ongoing</MenuItem>
                                <MenuItem value="passed">Passed</MenuItem>
                                <MenuItem value="failed">Failed</MenuItem>
                            </Select>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={this.handleSubmit}
                        >
                            <Trans>translation:messages.moduleVisit.dialog.save</Trans>
                        </Button>
                        <Button color="primary" onClick={this.handleClose}>
                            <Trans>dialog:selection.cancel</Trans>
                        </Button>
                    </DialogActions>
                </Dialog>
                <SelectModuleDialog
                    open={this.state.isModuleSelectionOpen}
                    onCancel={this.closeSelectionDialog}
                    onSelect={this.handleModuleSelect}
                />
            </>
        );
    }
}

export default withServices(withStyles(ModuleVisitDialogStyle)(withTranslation()(ModuleVisitDialog)));