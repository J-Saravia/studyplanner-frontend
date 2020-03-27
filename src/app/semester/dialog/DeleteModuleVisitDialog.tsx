import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

interface DeleteModuleVisitDialogProps {
    open: boolean;
    onCancel: () => void;
    onDelete: () => void;
}

export default class DeleteModuleVisitDialog extends React.Component<DeleteModuleVisitDialogProps, any> {

    public render() {
        const { open, onCancel, onDelete } = this.props;
        return (
            <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                maxWidth="xs"
                open={open}
            >
                <DialogTitle>Delete Module Visit</DialogTitle>
                <DialogContent>You are about to delete a module visit, are you sure you want to do this?</DialogContent>
                <DialogActions>
                    <Button onClick={onDelete} color="primary">
                        Delete
                    </Button>
                    <Button autoFocus onClick={onCancel} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

}