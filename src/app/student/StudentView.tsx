import * as React from 'react';
import withServices, { WithServicesProps } from '../../service/WithServices';
import StudentForm from './StudentForm';
import { StudentDto } from '../../model/Student';
import { Alert } from '@material-ui/lab';
import { Trans } from 'react-i18next';
import { Button, Container } from '@material-ui/core';
import ConfirmationDialog from '../dialog/ConfirmationDialog';

interface StudentProps extends WithServicesProps {

}

interface StudentState {
    submitting?: boolean;
    submissionError?: string;
    submissionSuccessful?: boolean;
    deleteUser?: boolean;
}

class StudentView extends React.Component<StudentProps, StudentState> {

    constructor(props: Readonly<StudentProps>) {
        super(props);
        this.state = {};
    }

    private handleSubmit = (student: StudentDto) => {
        const { studentService, authService } = this.props;
        this.setState({ submitting: true });
        studentService.update(student.id as string, student).then(result => {
            authService.updateCurrentUser(result);
            this.setState({ submissionSuccessful: true, submissionError: undefined, submitting: false });
        }).catch(this.handleError);
    };

    private handleError = (error: any) => {
        this.setState({ submissionSuccessful: false, submissionError: error.toString(), submitting: false });
    };

    private handleDelete = () => {
        this.setState({ deleteUser: true });
    };

    private handleDeleteConfirmation = () => {
        const { authService, studentService } = this.props;
        const id = authService.getCurrentStudent()?.id;
        this.setState({ submitting: true });
        studentService.delete(id as string)
            .then(() => authService.logout())
            .catch(this.handleError);
    };

    private handleDeleteCancellation = () => {
        this.setState({ deleteUser: false });
    };

    public render() {
        const { submitting, submissionError, submissionSuccessful, deleteUser } = this.state;
        return (
            <Container maxWidth="sm">
                <StudentForm onSubmit={this.handleSubmit} edit disabled={submitting}/>
                <Button color="secondary" disabled={submitting} variant="contained" onClick={this.handleDelete}>
                    <Trans>translation:messages.student.delete.title</Trans>
                </Button>
                {submissionError && (
                    <Alert color="error"><Trans>translation:messages.student.error</Trans></Alert>
                )}
                {submissionSuccessful && (
                    <Alert><Trans>translation:messages.student.successful</Trans></Alert>
                )}
                <ConfirmationDialog
                    open={deleteUser}
                    onCancel={this.handleDeleteCancellation}
                    onConfirm={this.handleDeleteConfirmation}
                    title="translation:messages.student.delete.title"
                    content="translation:messages.student.delete.confirmation"
                />
            </Container>
        );
    }

}

export default withServices(StudentView);
