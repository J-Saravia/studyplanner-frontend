import * as React from 'react';
import ConfirmationDialog from '../../dialog/ConfirmationDialog';

interface DeleteModuleVisitDialogProps {
    open: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

export default class DeleteModuleVisitDialog extends React.Component<DeleteModuleVisitDialogProps, any> {

    public render() {
        return (
            <ConfirmationDialog
                title="translation:messages.moduleVisit.delete.title"
                content="translation:messages.moduleVisit.delete.text"
                confirmLabel="translation:messages.moduleVisit.delete.confirm"
                {...this.props}
            />
        );
    }
}