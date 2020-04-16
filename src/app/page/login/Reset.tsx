import * as React from 'react';
import {
    Avatar,
    Button,
    Container, FormHelperText,
    Grid,
    StyledComponentProps,
    TextField, TextFieldProps,
    Typography,
    withStyles
} from '@material-ui/core';
import * as Icons from '@material-ui/icons';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import withServices, { WithServicesProps } from '../../../service/WithServices';
import ResetStyle from './ResetStyle';
import { Alert } from '@material-ui/lab';

interface ResetProps extends StyledComponentProps, WithTranslation, WithServicesProps, RouteComponentProps {
    classes: ClassNameMap;
}

interface ResetForm {
    email?: string;
    forgotToken?: string;
    password?: string;
    confirmPassword?: string;
}

interface ResetState {
    values: ResetForm,
    error: { [K in keyof ResetForm]?: boolean; };
    submissionError?: string;
    submitting?: boolean;
}

class Reset extends React.Component<ResetProps, ResetState> {


    constructor(props: Readonly<ResetProps>) {
        super(props);
        this.state = {
            values: {
                email: new URLSearchParams(props.location.search).get('email') || undefined
            },
            error: {}
        };
    }

    private validate(): boolean {
        const { error, values } = this.state;
        const { email, forgotToken, password, confirmPassword } = values;

        error.forgotToken = !forgotToken;
        error.password = !password || password.length < 10;
        error.confirmPassword = !confirmPassword || password !== confirmPassword;
        error.email = !email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);

        this.setState({ error });
        return !(error.forgotToken || error.password || error.confirmPassword || error.email)
    }

    private handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const { history } = this.props;
        const { email, forgotToken, password } = this.state.values;
        if (this.validate()) {
            this.setState({ submitting: true });
            this.props.authService
                .resetPassword(email as string, forgotToken as string, password as string)
                .then(() => {
                    history.push('/?message=login:reset.success');
                }).catch(error => this.setState({ submissionError: error.toString(), submitting: false }));
        }
    };

    private inputChangeHandler = (field: keyof ResetForm) => (event: React.ChangeEvent<{ value: unknown, name?: string }>) => {
        const values = { ...this.state.values, [field]: event.target.value as any };
        this.setState({ values });
    };

    private renderInput = (name: keyof ResetForm, extraProps?: TextFieldProps) => {
        const { t } = this.props;
        const { error, values } = this.state;
        return (
            <TextField
                error={error[name]}
                id={`reset-input-${name}`}
                label={t(`login:reset.${name}.title`)}
                helperText={t(`login:reset.${name}.help`)}
                value={values[name] || ''}
                onChange={this.inputChangeHandler(name)}
                fullWidth
                required
                {...extraProps}
            />
        )
    };

    public render() {
        const { classes } = this.props;
        const { submissionError, submitting } = this.state;
        return (
            <Container maxWidth="sm" style={{ alignItems: 'center' }}>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <Icons.LockOutlined/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        <Trans>login:reset.title</Trans>
                    </Typography>
                    <FormHelperText><Trans>login:reset.help</Trans></FormHelperText>
                    <form className={classes.form} noValidate onSubmit={this.handleSubmit} autoComplete="none">
                        {this.renderInput('email')}
                        {this.renderInput('forgotToken')}
                        {this.renderInput('password', { type: 'password' , autoComplete: 'none'})}
                        {this.renderInput('confirmPassword', { type: 'password' })}
                        {submissionError && <Alert color="error"><Trans>login:reset.error</Trans></Alert>}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disabled={submitting}
                        >
                            <Trans>login:reset.submit</Trans>
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link to="/">
                                    <Trans>login:reset.back</Trans>
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Container>
        );
    }

}

export default withServices(withTranslation()(withStyles(ResetStyle)(withRouter(Reset))));
