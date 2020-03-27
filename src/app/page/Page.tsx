import * as React from 'react';
import Menu from './Menu';
import { Paper, StyledComponentProps, withStyles } from '@material-ui/core';
import PageStyle from './PageStyle';
import SemesterList from '../semester/SemesterList';
import { AuthServiceProps, withAuthService } from '../../service/AuthService';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import Login from './login/Login';
import Student from '../../model/Student';

interface PageProps extends AuthServiceProps, StyledComponentProps{
    classes: ClassNameMap;
}

interface PageState {
    student?: Student;
}

class Page extends React.Component<PageProps, PageState> {


    constructor(props: Readonly<PageProps>) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.props.authService.addStudentListener(student => this.setState({student}));
    }

    public render() {
        const { classes } = this.props;
        const { student } = this.state;
        if (!student) {
            return <Login />;
        }
        return (
            <div className={classes.root}>
                <Menu />
                <Paper className={classes.content}>
                    <div className={classes.toolbar} />
                    <SemesterList />
                </Paper>
            </div>
        );
    }
}

export default withAuthService(withStyles(PageStyle)(Page));