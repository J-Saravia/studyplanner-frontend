import * as React from 'react';
import {
    StyledComponentProps,
    withStyles,
    Typography, Avatar, Container
} from '@material-ui/core';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import withServices, { WithServicesProps } from "../../../service/WithServices";
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import { Alert } from "@material-ui/lab";
import RegisterStyle from "./RegisterStyle";
import StudentForm from '../../student/StudentForm';
import { StudentDto } from '../../../model/Student';

interface RegisterProps extends WithServicesProps, StyledComponentProps, WithTranslation, RouteComponentProps {
    classes: ClassNameMap;
}

interface RegisterState {
    serviceError?: string;
    submitting?: boolean;
}


class Register extends React.Component<RegisterProps, RegisterState> {

    constructor(props: Readonly<RegisterProps>) {
        super(props);
        this.state = {};
    }

    private handleRegister = (student: StudentDto) => {
        const { history, studentService } = this.props;
        this.setState({ submitting: true });
        studentService.create(student).then(_ => {
            history.push('/?message=login:registered');
        }).catch(error => this.setState({ serviceError: error.toString(), submitting: false }));
    };

    private handleLoggedIn = () => {
        const { history } = this.props;
        history.push('/');
    };

    public render() {
        const { classes } = this.props;
        const { serviceError } = this.state;

        if (this.props.authService.isLoggedIn()) {
            this.handleLoggedIn();
            return null;
        }

        return (
            <Container component="main" maxWidth="sm">
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <AccountCircleOutlinedIcon/>
                    </Avatar>
                    <Typography variant="h5">
                        <Trans>login:register</Trans>
                    </Typography>
                    <StudentForm submitText="login:register" onSubmit={this.handleRegister}/>
                    {serviceError && (
                        <Alert severity="error">
                            <Trans>login:registerFail</Trans>
                        </Alert>
                    )}
                    <Link to="/">
                        <Trans>login:account</Trans>
                    </Link>
                </div>
            </Container>
        );
    }

}

export default withRouter(withServices(withTranslation()(withStyles(RegisterStyle)(Register))));