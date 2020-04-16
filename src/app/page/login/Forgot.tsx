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
import ForgotStyle from './ForgotStyle';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import withServices, { WithServicesProps } from '../../../service/WithServices';
import { Alert } from '@material-ui/lab';

interface ForgotProps extends StyledComponentProps, WithTranslation, WithServicesProps, RouteComponentProps {
    classes: ClassNameMap;
}

interface ForgotForm {
    email?: string;
}

interface ForgotState {
    values: ForgotForm;
    error: { [K in keyof ForgotForm]?: boolean; };
    submitting?: boolean;
    submissionError?: string;
}

class Forgot extends React.Component<ForgotProps, ForgotState> {

    constructor(props: Readonly<ForgotProps>) {
        super(props);
        this.state = {
            error: {},
            values: {}
        };
    }

    private validate(): boolean {
        const { values , error } = this.state;
        // Regex should cover ~99% of all emails https://www.regular-expressions.info/email.html
        error.email = !values.email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email);
        this.setState({ error });
        return !error.email;
    }

    private handleSubmit = (event: React.FormEvent) => {
        const { email } = this.state.values;
        event.preventDefault();
        this.setState({ submitting: true });
        this.props.authService.requestPasswordReset(email as string)
            .then(() => {
                const { history } = this.props;
                history.push(`/reset?email=${email}`);
            }).catch(error => this.setState({ submissionError: error.toString(), submitting: false }));
    };

    private inputChangeHandler = (field: keyof ForgotForm) => (event: React.ChangeEvent<{ value: unknown, name?: string }>) => {
        const values = { ...this.state.values, [field]: event.target.value as any };
        this.setState({ values });
    };

    private renderInput = (name: keyof ForgotForm, extraProps?: TextFieldProps) => {
        const { t } = this.props;
        const { error, values } = this.state;
        return (
            <TextField
                error={error[name]}
                id={`reset-input-${name}`}
                label={t(`login:forgot.${name}.title`)}
                helperText={t(`login:forgot.${name}.help`)}
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
                        <Trans>login:forgot.title</Trans>
                    </Typography>
                    <FormHelperText><Trans>login:forgot.help</Trans></FormHelperText>
                    <form className={classes.form} noValidate onSubmit={this.handleSubmit}>
                        {this.renderInput('email')}
                        {submissionError && <Alert color="error"><Trans>login:forgot.error</Trans></Alert>}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disabled={submitting}
                        >
                            <Trans>login:forgot.submit</Trans>
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link to="/">
                                    <Trans>login:forgot.back</Trans>
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Container>
        );
    }

}

export default withRouter(withServices(withTranslation()(withStyles(ForgotStyle)(Forgot))));
