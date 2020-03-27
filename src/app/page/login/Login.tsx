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
import { Link } from 'react-router-dom';
import { AuthServiceProps, withAuthService } from '../../../service/AuthService';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import { Alert } from '@material-ui/lab';

interface LoginProps extends StyledComponentProps, AuthServiceProps{
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
            }).catch(error => this.setState({ error }));
        }
        event.preventDefault();
    };

    private handleFieldChange = <T extends keyof LoginState>(field: T) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({[field]: event.target.value});
    };

    public render() {
        const { classes } = this.props;
        const { error } = this.state;
        return (
            <Container component="main" maxWidth="xs">
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <Icons.LockOutlined />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <form className={classes.form} noValidate onSubmit={this.handleLogin}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
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
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={this.handleFieldChange('password')}
                            error={!!error}
                        />
                        {error &&
                        <Alert severity="error" >
                            {error}
                        </Alert>
                        }
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link to="#">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link to="#">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Container>
        );
    }
}

export default withAuthService(withStyles(LoginStyle)(Login));