import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';

interface CreateSemesterDialogProps extends WithTranslation, RouteComponentProps {
    open?: boolean;
    onCancel?: () => void;
}

interface CreateSemesterDialogState {
    semester?: string;
    error?: boolean;
}

class CreateSemesterDialog extends React.Component<CreateSemesterDialogProps, CreateSemesterDialogState> {

    constructor(props: Readonly<CreateSemesterDialogProps>) {
        super(props);
        this.state = {};
    }

    private handleCreate = (event: React.BaseSyntheticEvent) => {
        const { history } = this.props;
        const { semester } = this.state;
        event.preventDefault();
        if (semester && /^(?:fs|hs)[0-9]{1,2}$/.test(semester)) {
            history.push(`/semester/${semester}`);
        } else {
            this.setState({ error: true })
        }
    };

    private handleChange = (event: React.ChangeEvent<{ value?: unknown }>) => {
        this.setState({ semester: event.target.value as string });
    };

    private handleCancel = () => {
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    };

    public render() {
        const { open, t } = this.props;
        const { semester, error } = this.state;
        return (
            <Dialog maxWidth="xs" fullWidth open={!!open} onClose={this.handleCancel}>
                <DialogTitle>
                    <Trans>translation:messages.semester.create</Trans>
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={this.handleCreate}>
                        <TextField
                            value={semester}
                            error={error}
                            label={t('translation:messages.semester.label')}
                            helperText={t('translation:messages.semester.help')}
                            onChange={this.handleChange}
                            fullWidth
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={this.handleCreate}
                    >
                        <Trans>translation:messages.semester.create</Trans>
                    </Button>
                    <Button color="primary" onClick={this.handleCancel}>
                        <Trans>translation:messages.semester.cancel</Trans>
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withRouter(withTranslation()(CreateSemesterDialog));
