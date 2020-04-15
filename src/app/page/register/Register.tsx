import * as React from 'react';
import {
    StyledComponentProps,
    withStyles,
    TextField, Typography, Button, Avatar, MenuItem
} from '@material-ui/core';
import {Trans, WithTranslation, withTranslation} from 'react-i18next';
import RegisterStyle from './RegisterStyle';
import {withRouter, RouteComponentProps, Link} from 'react-router-dom';
import {ClassNameMap} from "@material-ui/core/styles/withStyles";
import {StudentServiceProps, withStudentService} from "../../../service/StudentService";
import {AuthServiceProps, withAuthService} from "../../../service/AuthService";
import {DegreeServiceProps, withDegreeService} from "../../../service/DegreeService";
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import Degree from "../../../model/Degree";

interface RegisterProps extends AuthServiceProps, StyledComponentProps, DegreeServiceProps, StudentServiceProps, WithTranslation, RouteComponentProps {
    classes: ClassNameMap;
}

interface RegisterState {
    email?: string;
    password?: string;
    confirm?: string;
    semester?: string;
    degrees?: Degree[];
    degree?: number;
    errorEm?: boolean;
    errorPw?: boolean;
    errorSm?: boolean;
    errorDg?: boolean;
}


class Register extends React.Component<RegisterProps, RegisterState> {


    constructor(props: Readonly<RegisterProps>) {
        super(props);
        this.state = {};
    }

    componentDidMount(): void {
    }


    private handleLoggedIn = () => {
        const {history} = this.props;
        history.push('/');
    }


    private handleFieldChange = <T extends keyof RegisterState>(field: T) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({[field]: event.target.value});
    };

    private handleRegister = (event: React.FormEvent) => {
        const {email, password, confirm, semester, degree} = this.state;
        this.validateEmail(email);
        this.validatePw(password, confirm);
        this.validateSemester(semester);
        this.validateDegree(degree);


        event.preventDefault();

    };

    private validateSemester(semester: string | undefined) {
        if (!semester) { //TODO
            this.setState({errorSm: true});
        } else {
            this.setState({errorSm: false});
        }
    }

    private validateEmail(email: string | undefined) {
        if (!email) {
            this.setState({errorEm: true});
        } else if (email.substring(0, email.indexOf('@')).length > 64
            && email.substring(email.indexOf('@')).length > 253) {
            this.setState({errorEm: true});
        } else if (!(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            this.setState({errorEm: true});
        } else {
            this.setState({errorEm: false});
        }
    }

    private validatePw(pw: string | undefined, pwV: string | undefined) {
        if (!pw || pw.length < 10 || !pwV || pw !== pwV) {
            this.setState({errorPw: true});
        } else {
            this.setState({errorPw: false});
        }
    }

    private validateDegree(degree: number | undefined) {
        if (!degree) {
            this.setState({errorDg: true});
        } else {
            this.setState({errorDg: false});
        }


    }

    public render() {
        const {classes, t} = this.props;
        const {errorEm, errorPw, errorSm, errorDg} = this.state;


        if (this.props.authService.isLoggedIn()) {
            this.handleLoggedIn();
        }

        return (
            <div>
                <div>
                    <Avatar><AccountCircleOutlinedIcon/></Avatar>
                    <Typography variant="h5"><Trans>login:register</Trans></Typography>
                    <form noValidate onSubmit={this.handleRegister}>
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
                                   onChange={this.handleFieldChange('confirm')} error={!!errorPw}
                        />


                        <TextField id="semester" required label="Semester" variant="outlined"
                                   margin="normal" fullWidth name="semester" autoFocus placeholder={'hs17'}
                                   onChange={this.handleFieldChange('semester')} error={!!errorSm}
                                   autoComplete={'off'}
                        />

                        <TextField id="degree" required select label={t('login:degree')} variant="outlined"
                                   margin="normal" fullWidth name="degree"
                                   onChange={this.handleFieldChange('degree')} error={!!errorDg}
                        >
                            <MenuItem value={1}>
                                <Trans>login:science</Trans>
                            </MenuItem>
                        </TextField>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                        >
                            <Trans>login:register</Trans>
                        </Button>
                        <Link to="/">
                            <Trans>login:title</Trans>
                        </Link>
                    </form>
                </div>
            </div>
        );
    }

}

export default withRouter(withDegreeService(withStudentService(withAuthService(withTranslation()(withStyles(RegisterStyle)(Register))))));