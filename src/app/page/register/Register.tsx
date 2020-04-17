import * as React from 'react';
import {
    StyledComponentProps,
    withStyles,
    TextField, Typography, Button, Avatar, MenuItem, Container
} from '@material-ui/core';
import {Trans, WithTranslation, withTranslation} from 'react-i18next';
import {withRouter, RouteComponentProps, Link} from 'react-router-dom';
import {ClassNameMap} from "@material-ui/core/styles/withStyles";
import withServices, {WithServicesProps} from "../../../service/WithServices";
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import Degree from "../../../model/Degree";
import {Alert} from "@material-ui/lab";
import RegisterStyle from "./RegisterStyle";

interface RegisterProps extends WithServicesProps, StyledComponentProps, WithTranslation, RouteComponentProps {
    classes: ClassNameMap;
}

interface RegisterState {
    email?: string;
    password?: string;
    confirm?: string;
    semester?: string;
    degrees?: Degree[];
    serviceError?: boolean;
    degree?: string;
    btnDisable?: boolean;
    errorEm?: boolean;
    errorPw?: boolean;
    errorPv?: boolean;
    errorSm?: boolean;
    errorDg?: boolean;
}


class Register extends React.Component<RegisterProps, RegisterState> {


    constructor(props: Readonly<RegisterProps>) {
        super(props);
        this.state = {};
    }

    componentDidMount(): void {
        this.props.degreeService.list().then(list => this.setState({degrees: list || []}));
    }


    private handleLoggedIn = () => {
        const {history} = this.props;
        history.push('/?message=login:registered');
    }


    private handleFieldChange = <T extends keyof RegisterState>(field: T) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({[field]: event.target.value});
    };

    private handleRegister = (event: React.FormEvent) => {
        const {history} = this.props;
        const {email, password, semester, degree, degrees} = this.state;
        const valid = this.validateInput();
        if (email && password && semester && degree && degrees) {
            let putDegree = degrees.find(d => d.id === degree);
            if (valid && putDegree) { //
                this.setState({btnDisable: true});
                this.props.studentService.create({
                    email: email,
                    password: password,
                    semester: semester,
                    degree: putDegree
                }).then(_ => {
                    this.props.degreeService.clearCache() // clear cache so that it can reload all data once authenticated
                        .then(() => history.push('/'));
                }).catch(_ => {
                    this.setState({serviceError: true});
                    this.setState({btnDisable: false});
                });
            }
        }

        event.preventDefault();

    };

    private validateInput() {
        return [
            this.validateEmail(),
            this.validatePw(),
            this.validateSemester(),
            this.validateDegree()
        ].reduce((a, b) => a && b);
    }

    private validateSemester() {
        const {semester} = this.state;
        let isValid = false;

        if (!semester || !(/^(?:fs|hs)[0-9]{1,2}$/.test(semester))) {
            this.setState({errorSm: true});
        } else {
            this.setState({errorSm: false});
            isValid = true;
        }

        return isValid;
    }

    private validateEmail() {
        const {email} = this.state;
        let isValid = false;

        if (!email) {
            this.setState({errorEm: true});
        } else if (email.substring(0, email.indexOf('@')).length > 64
            && email.substring(email.indexOf('@')).length > 253) {
            this.setState({errorEm: true});
        } else if (!(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            this.setState({errorEm: true});
        } else {
            this.setState({errorEm: false});
            isValid = true;
        }

        return isValid;
    }

    private validatePw() {
        const {password, confirm} = this.state;
        let isValid = false;
        if (!password || password.length < 10) {
            this.setState({errorPw: true});
            this.setState({errorPv: true});
        } else {
            this.setState({errorPw: false});
            if (!confirm || password !== confirm) {
                this.setState({errorPv: true});
            } else {
                this.setState({errorPv: false});
                isValid = true;
            }
        }
        return isValid;
    }

    private validateDegree() {
        const {degree} = this.state;
        let isValid = false;
        if (!degree) {
            this.setState({errorDg: true});
        } else {
            this.setState({errorDg: false});
            isValid = true;
        }
        return isValid;
    }

    public render() {
        const {classes, t} = this.props;
        const {errorEm, errorPw, errorPv, errorSm, errorDg, degrees, serviceError, btnDisable} = this.state;

        if (this.props.authService.isLoggedIn()) {
            this.handleLoggedIn();
        }

        return degrees ? (
            <Container component="main" maxWidth="sm">
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <AccountCircleOutlinedIcon/>
                    </Avatar>
                    <Typography variant="h5">
                        <Trans>login:register</Trans>
                    </Typography>
                    <form className={classes.form} noValidate onSubmit={this.handleRegister}>
                        <TextField id="email" required label={t('login:email')} variant="outlined"
                                   margin="normal" fullWidth name="email" autoFocus
                                   onChange={this.handleFieldChange('email')} error={!!errorEm}
                        />
                        <TextField id="password" required label={t('login:password')} type="password"
                                   variant="outlined" margin="normal" fullWidth name="password" autoFocus
                                   helperText={t('login:length')}
                                   onChange={this.handleFieldChange('password')} error={!!errorPw}
                        />

                        <TextField id="confirm" required label={t('login:confirm')} type="password"
                                   variant="outlined" margin="normal" fullWidth name="confirm" autoFocus
                                   onChange={this.handleFieldChange('confirm')} error={!!errorPv}
                        />


                        <TextField className={classes.semester} id="semester" required label="Semester"
                                   variant="outlined"
                                   margin="normal" fullWidth name="semester" autoFocus placeholder={'hs17'}
                                   onChange={this.handleFieldChange('semester')} error={!!errorSm}
                                   autoComplete={'off'}
                        />


                        <TextField id="degree" required select label={t('login:degree')} variant="outlined"
                                   margin="normal" fullWidth name="degree"
                                   onChange={this.handleFieldChange('degree')} error={!!errorDg}
                        >
                            {degrees && degrees.map(d => (
                                <MenuItem value={d.id}>
                                    {d.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        {serviceError &&
                        <Alert severity="error">
                            <Trans>login:registerFail</Trans>
                        </Alert>
                        }
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={btnDisable}
                            className={classes.submit}
                        >
                            <Trans>login:register</Trans>
                        </Button>
                        <Link to="/">
                            <Trans>login:account</Trans>
                        </Link>
                    </form>
                </div>
            </Container>
        ) : (<div>Loading...</div>);
    }

}

export default withRouter(withServices(withTranslation()(withStyles(RegisterStyle)(Register))));