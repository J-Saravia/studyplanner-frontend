import * as React from 'react';
import {
    Avatar,
    Button,
    Container,
    Grid,
    StyledComponentProps,
    TextField,
    Typography,
    withStyles
} from '@material-ui/core';
import * as Icons from '@material-ui/icons';
import LoginStyle from './LoginStyle';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { AuthServiceProps, withAuthService } from '../../../service/AuthService';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import { Alert } from '@material-ui/lab';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';

interface LoginProps extends StyledComponentProps, AuthServiceProps, WithTranslation, RouteComponentProps {
    classes: ClassNameMap;
}

interface LoginState {
    error?: string;
    email?: string;
    password?: string;
}

class Login extends React.Component<LoginProps, LoginState> {

    constructor(props: Readonly<LoginProps>) {
        super(props);
        this.state = {};
    }

    private handleLogin = (event: React.FormEvent) => {
        const { email, password } = this.state;
        if (email && password) {
            this.props.authService.login({
                email: email,
                password: password
            }).catch(error => this.setState({ error: error.toString() }));
        }
        event.preventDefault();
    };

    private handleFieldChange = <T extends keyof LoginState>(field: T) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ [field]: event.target.value });
    };

    public render() {
        const { classes, t, location } = this.props;
        const { error } = this.state;

        const message = new URLSearchParams(location.search).get('message');

        return (
            <Container maxWidth="sm">
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <Icons.LockOutlined/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        <Trans>login:title</Trans>
                    </Typography>
                    <form className={classes.form} noValidate onSubmit={this.handleLogin}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label={t('login:email')}
                            name="email"
                            autoComplete="email"
                            onChange={this.handleFieldChange('email')}
                            autoFocus
                            error={!!error}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label={t('login:password')}
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={this.handleFieldChange('password')}
                            error={!!error}
                        />
                        {error &&
                            <Alert severity="error">
                              <Trans>login:error</Trans>
                            </Alert>
                        }
                        {message &&
                            <Alert severity="info">
                              <Trans>{message}</Trans>
                            </Alert>
                        }
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            <Trans>login:signIn</Trans>
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link to="/forgot">
                                    <Trans>login:forgotPassword</Trans>
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link to="/register">
                                    <Trans>login:signUp</Trans>
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Container>
        );
    }
}

export default withRouter(withTranslation()(withAuthService(withStyles(LoginStyle)(Login))));