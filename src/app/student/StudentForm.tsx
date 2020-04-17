import * as React from 'react';
import withServices, { WithServicesProps } from '../../service/WithServices';
import { StudentDto } from '../../model/Student';
import Degree from '../../model/Degree';
import {
    Button,
    MenuItem,
    StyledComponentProps,
    TextField,
    TextFieldProps,
    withStyles
} from '@material-ui/core';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';
import StudentFormStyle from './StudentFormStyle';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import { Alert } from '@material-ui/lab';

interface StudentFormProps extends WithServicesProps, WithTranslation, StyledComponentProps {
    classes: ClassNameMap;
    onSubmit: (student: StudentDto) => void;
    disabled?: boolean;
    edit?: boolean;
    submitText?: string;
}

interface FormValues extends StudentDto {
    confirmPassword: string;
}

interface StudentFormState {
    degrees?: Degree[];
    finishedLoadingDegrees?: boolean;
    finishedLoadingStudent?: boolean;
    values: FormValues;
    error: { [K in keyof FormValues]?: boolean }
    serviceError?: string;
}

class StudentForm extends React.Component<StudentFormProps, StudentFormState> {

    constructor(props: Readonly<StudentFormProps>) {
        super(props);
        this.state = {
            values: {} as FormValues,
            finishedLoadingStudent: !props.edit,
            error: {}
        };
    }

    private handleServiceError = (error: any) => {
        this.setState({
            serviceError: error.toString(),
            finishedLoadingDegrees: true,
            finishedLoadingStudent: true
        });
    };

    private validateInput() {
        const validEmail = this.validateEmail();
        const validPassword = this.validatePassword();
        const validSemester = this.validateSemester();
        const validDegree = this.validateDegree();
        return validEmail && validPassword && validSemester && validDegree;
    }

    private validateSemester() {
        const { error, values } = this.state;
        const { semester } = values;

        const isValid = !(error.semester = !semester || !/^(?:fs|hs)[0-9]{1,2}$/.test(semester));
        this.setState({ error });
        return isValid;
    }

    private validateEmail() {
        const { error, values } = this.state;
        const { email } = values;
        let isValid = true;

        if (!email) {
            isValid = false;
        } else if (email.substring(0, email.indexOf('@')).length > 64 && email.substring(email.indexOf('@')).length > 253) {
            isValid = false;
        } else if (!(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            isValid = false;
        }

        error.email = !isValid;
        this.setState({ error });
        return isValid;
    }

    private validatePassword() {
        if (this.props.edit) return true;
        const { error, values } = this.state;
        const { password, confirmPassword } = values;
        let isValid = !(error.password = !password || password.length < 10);
            isValid = !(error.confirmPassword = !confirmPassword || password !== confirmPassword) && isValid;
        this.setState({ error });
        return isValid;
    }

    private validateDegree() {
        const { error, values } = this.state;
        const { degree } = values;
        let isValid = !(error.degree = !degree);
        this.setState({ error });
        return isValid;
    }

    componentDidMount() {
        const { degreeService, studentService, authService, edit } = this.props;
        degreeService.list()
            .then(degrees => this.setState({ degrees, finishedLoadingDegrees: true }))
            .catch(this.handleServiceError);
        if (edit) {
            const id = authService.getCurrentStudent()?.id;
            studentService.findById(id as string)
                .then(student => this.setState({
                    values: {
                        ...student,
                        degree: student.degree.id
                    } as FormValues,
                    finishedLoadingStudent: true }))
                .catch(this.handleServiceError);
        }
    }

    private inputChangeHandler = (key: keyof FormValues) => (event: React.ChangeEvent<{ value: unknown, name?: string }>) => {
        const values = { ...this.state.values, [key]: event.target.value };
        this.setState({ values });
    };

    private renderInput = <P extends TextFieldProps>(name: keyof FormValues, extraProps?: P) => {
        const { t } = this.props;
        const { error, values } = this.state;
        return (
            <TextField
                error={error[name]}
                id={`studentForm-input-${name}`}
                label={t(`translation:messages.student.form.field.${name}.title`)}
                helperText={t(`translation:messages.student.form.field.${name}.help`)}
                value={values[name] || ''}
                onChange={this.inputChangeHandler(name)}
                fullWidth
                required
                variant="outlined"
                margin="normal"
                autoComplete="new-password"
                {...extraProps}
            />
        )
    };

    private handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (this.validateInput()) {
            this.props.onSubmit(this.state.values as StudentDto);
        }
    };

    public render() {
        const { disabled, classes, edit, submitText } = this.props;
        const { degrees, serviceError, finishedLoadingDegrees, finishedLoadingStudent } = this.state;
        if (!finishedLoadingStudent || !finishedLoadingDegrees) {
            return 'loading';
        }
        const selection = degrees?.map(degree => (
            <MenuItem value={degree.id} key={`studentForm-degree-${degree.id}`} selected>
                {degree.name}
            </MenuItem>
        ));
        return (
            <form className={classes.form} noValidate onSubmit={this.handleSubmit}>
                {edit && this.renderInput('id', { disabled: true })}
                {this.renderInput('email', { autoComplete: 'email' })}
                {!edit && this.renderInput('password', { type: 'password' })}
                {!edit && this.renderInput('confirmPassword', { type: 'password' })}
                {this.renderInput('semester', { autoComplete: 'off', placeholder: 'hs17' })}
                {this.renderInput('degree', { select: true, children: selection })}
                {serviceError && (
                    <Alert severity="error">
                        <Trans>translation:messages.student.form.error</Trans>
                    </Alert>
                )}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={disabled}
                    className={classes.submit}
                >
                    <Trans>{submitText || 'translation:messages.student.form.submit'}</Trans>
                </Button>
            </form>
        );
    }

}

export default withTranslation()(withServices(withStyles(StudentFormStyle)(StudentForm)));