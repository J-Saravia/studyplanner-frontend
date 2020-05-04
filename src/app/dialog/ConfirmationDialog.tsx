import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';

interface ConfirmationDialogProps extends WithTranslation {
    title?: string;
    content?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    open?: boolean;
    onCancel?: () => void;
    onConfirm?: () => void;
    exclusive?: boolean;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

class ConfirmationDialog extends React.Component<ConfirmationDialogProps, any> {

    public render() {
        const { open, onCancel, onConfirm, title, content, confirmLabel, cancelLabel, exclusive, maxWidth } = this.props;
        return (
            <Dialog
                disableBackdropClick={exclusive}
                disableEscapeKeyDown={exclusive}
                maxWidth={maxWidth === undefined ? 'xs' : maxWidth}
                open={!!open}
                onClose={onCancel}
            >
                <DialogTitle><Trans>{title || 'dialog:confirmation.title'}</Trans></DialogTitle>
                <DialogContent><Trans>{content || 'dialog:confirmation.content'}</Trans></DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={onConfirm} color="primary" variant="contained">
                        <Trans>{confirmLabel || 'dialog:confirmation.confirm'}</Trans>
                    </Button>
                    <Button onClick={onCancel} color="primary">
                        <Trans>{cancelLabel || 'dialog:confirmation.cancel'}</Trans>
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withTranslation('dialog')(ConfirmationDialog);
