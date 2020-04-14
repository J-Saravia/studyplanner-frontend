import * as React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputAdornment, StyledComponentProps,
    TextField, withStyles
} from '@material-ui/core';
import Module from '../../../model/Module';
import HiddenJs from '@material-ui/core/Hidden/HiddenJs';
import { Search } from '@material-ui/icons';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';
import SelectModuleDialogStyle from './SelectModuleDialogStyle';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import clsx from 'clsx';
import withServices, { WithServicesProps } from '../../../service/WithServices';
import ModuleInfo from '../../../model/ModuleInfo';

interface SelectModuleDialogProps extends WithServicesProps, StyledComponentProps, WithTranslation {
    open?: boolean;
    onSelect?: (selected: ModuleInfo) => void;
    onCancel?: () => void;
    classes: ClassNameMap;
    defaultSelected?: ModuleInfo | Module;
}

interface SelectModuleDialogState {
    infos?: ModuleInfo[];
    selected?: ModuleInfo;
    filter?: string;
}

class SelectModuleDialog extends React.Component<SelectModuleDialogProps, SelectModuleDialogState> {

    constructor(props: Readonly<SelectModuleDialogProps>) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.loadModuleInfoList();
    }

    componentDidUpdate(prevProps: Readonly<SelectModuleDialogProps>, prevState: Readonly<SelectModuleDialogState>, snapshot?: any): void {
        if (!prevProps.open && this.props.open) {
            this.setState({infos: undefined, selected: undefined, filter: undefined});
            this.loadModuleInfoList();
        }
    }

    private loadModuleInfoList = () => {
        this.props.moduleService.generateModuleInfoList().then(infos => {
            infos = infos.sort((a, b) => this.getInfoValue(a) - this.getInfoValue(b));
            const selected = this.props.defaultSelected
                && infos.find(info => info.id === this.props.defaultSelected?.id);
            this.setState({infos, selected});
        });
    };

    private getInfoValue(info: ModuleInfo) {
        let value = 0;
        if (info.state === 'failed') {
            value -= 100;
        }else if (info.state === 'passed' || info.state === 'blocked') {
            value += 100;
        }
        return value;
    }

    private renderInfo() {
        const { classes } = this.props;
        const { selected } = this.state;
        if (!selected) {
            return <Trans>translation:messages.module.selection.select</Trans>;
        }
        const module = selected.module;
        const semesterAvailability = module.hs ? module.fs ? 'HS/FS' : 'HS' : 'FS';
        return (
            <>
                <div className={classes.infoTitle}>{module.name}</div>
                <div><Trans>translation:messages.module.selection.code</Trans>: {module.code}</div>
                <div><Trans>translation:messages.module.selection.credits</Trans>: {module.credits}</div>
                <div><Trans>translation:messages.module.selection.semester</Trans>: {semesterAvailability}</div>
                <Trans>translation:messages.module.selection.requirements.title</Trans>: {module.requirements.length ? module.requirements.map(module => (
                    <div key={`requirement-${module.id}`} className={classes.requirement}>
                        - {module.name}
                    </div>
                )) : <Trans>translation:messages.module.selection.requirements.none</Trans>}
            </>
        );
    }

    private renderStateMessage(state: string) {
        const { classes } = this.props;
        return (
            <span
                className={clsx({
                    [classes.plannedState]: state === 'planned',
                    [classes.ongoingState]: state === 'ongoing',
                    [classes.passedState]: state === 'passed',
                    [classes.failedState]: state === 'failed',
                    [classes.blockedState]: state === 'blocked',
                })}
            >
                <Trans>translation:messages.module.selection.state.{state}</Trans>
            </span>
        );
    }

    private renderModules() {
        const { classes } = this.props;
        const { infos, selected, filter } = this.state;
        if (!infos) return <Trans>translation:messages.module.selection.loading</Trans>;
        const filteredInfos = filter ? infos.filter(info => info.searchString.includes(filter.toLowerCase())) : infos;
        if (!filteredInfos.length) return <Trans>translation:messages.module.selection.empty</Trans>;
        return filteredInfos.map(info => {
            const { module, state } = info;
            return (
                <div
                    className={clsx(classes.module, {
                        [classes.selected]: selected === info,
                        [classes.unselectable]: state === 'passed',
                    })}
                    key={module.id}
                    onClick={_ => this.setState({selected: info})}
                >
                    <div className={classes.moduleTitle}>{module.name}</div>
                    <div className={classes.row} >
                        <div><Trans>translation:messages.module.selection.code</Trans>: {module.code}</div>
                        <div><Trans>translation:messages.module.selection.credits</Trans>: {module.credits}</div>
                    </div>
                    <div className={classes.row}>
                        <div>MSP: <Trans>translation:messages.module.selection.msp.{module.msp.toLowerCase()}</Trans></div>
                        {this.renderStateMessage(state)}
                    </div>
                    <div className={classes.row}>
                        <div>
                            <Trans>translation:messages.module.selection.requirements.fulfilled</Trans>:&nbsp;
                            <Trans>translation:messages.{info.passedRequirements ? 'yes' : 'no'}</Trans>
                        </div>
                    </div>
                </div>
            );
        });
    }

    private handleSelect = () => {
        if (this.props.onSelect && this.state.selected) {
            this.props.onSelect(this.state.selected);
        }
    };

    private handleClose = () => {
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    };

    public render() {
        const { classes, t } = this.props;
        const { selected } = this.state;
        return (
            <Dialog
                classes={{paperFullWidth: clsx(classes.fullHeight)}}
                maxWidth={false}
                fullWidth
                open={!!this.props.open}
                onClose={this.handleClose}
            >
                <DialogTitle><Trans>translation:messages.module.selection.select</Trans></DialogTitle>
                <DialogContent className={classes.root}>
                    <HiddenJs smDown>
                        <div className={classes.info}>
                            {this.renderInfo()}
                        </div>
                    </HiddenJs>
                    <div className={classes.content}>
                        <TextField
                            autoFocus
                            onChange={event => this.setState({filter: event.currentTarget.value})}
                            className={classes.search}
                            InputProps={{endAdornment: <InputAdornment position="end"><Search /></InputAdornment>}}
                            placeholder={t('translation:messages.module.selection.search')}
                            fullWidth />
                        <div className={classes.modules}>
                            {this.renderModules()}
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        variant="contained"
                        disabled={!selected}
                        onClick={this.handleSelect}
                    >
                        <Trans>dialog:selection.select</Trans>
                    </Button>
                    <Button color="primary" onClick={this.handleClose}>
                        <Trans>dialog:selection.cancel</Trans>
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

}

export default withTranslation()(withServices(withStyles(SelectModuleDialogStyle)(SelectModuleDialog)));