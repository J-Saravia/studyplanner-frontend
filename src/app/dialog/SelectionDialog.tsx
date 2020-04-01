import * as React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControl, InputLabel,
    Select, StyledComponentProps, withStyles
} from '@material-ui/core';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';
import SelectionDialogStyle from './SelectionDialogStyle';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import { Alert } from '@material-ui/lab';

interface SelectionDialogProps extends WithTranslation, StyledComponentProps {
    title?: string;
    label?: string;
    selectLabel?: string;
    cancelLabel?: string;
    open?: boolean;
    onCancel?: () => void;
    onSelect?: (value: unknown) => void;
    onChange?: (value: unknown) => void;
    children: JSX.Element[];
    error?: string;
    status?: React.ReactNode;
    defaultValue?: string;
    classes: ClassNameMap;
    exclusive?: boolean;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

interface SelectionDialogState {
    value: unknown;
}

class SelectionDialog extends React.Component<SelectionDialogProps, SelectionDialogState> {

    constructor(props: Readonly<SelectionDialogProps>) {
        super(props);
        this.state = {
            value: props.defaultValue || props.children[0].props.value
        };
    }

    private handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        const { value } = event.target;
        this.setState({ value });
        if (this.props.onChange) {
            this.props.onChange(value);
        }
    };

    private handleSelect = () => {
        if (this.props.onSelect) {
            this.props.onSelect(this.state.value);
        }
    };

    public render() {
        const { open, onCancel, label, title, classes, selectLabel, cancelLabel, children, exclusive, maxWidth, error, status } = this.props;
        const { value } = this.state;
        return (
            <Dialog
                disableBackdropClick={exclusive}
                disableEscapeKeyDown={exclusive}
                fullWidth
                classes={{
                    paper: classes.root
                }}
                open={!!open}
                maxWidth={maxWidth === undefined ? 'xs' : maxWidth}
                onClose={onCancel}
            >
                <DialogTitle><Trans>{title || 'dialog:selection.title'}</Trans></DialogTitle>
                <DialogContent className={classes.content}>
                    <FormControl className={classes.formControl}>
                        <InputLabel
                            id="selection-dialog-label"><Trans>{label || 'dialog:selection.select'}</Trans></InputLabel>
                        <Select
                            onChange={this.handleChange}
                            value={value}
                        >
                            {children}
                        </Select>
                    </FormControl>
                    {error &&
                        <Alert severity="error">
                            {error}
                        </Alert>
                    }
                    {status}
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={this.handleSelect} color="primary" variant="contained">
                        <Trans>{selectLabel || 'dialog:selection.select'}</Trans>
                    </Button>
                    <Button onClick={onCancel} color="primary">
                        <Trans>{cancelLabel || 'dialog:selection.cancel'}</Trans>
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withTranslation()(withStyles(SelectionDialogStyle)(SelectionDialog));
