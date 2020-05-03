import * as React from 'react';
import Menu from './Menu';
import { Paper, StyledComponentProps, withStyles } from '@material-ui/core';
import PageStyle from './PageStyle';
import SemesterList from '../semester/list/SemesterList';
import { AuthServiceProps, withAuthService } from '../../service/AuthService';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import Login from './login/Login';
import { Switch, Route } from 'react-router-dom';
import SemesterView from '../semester/detail/SemesterView';
import Protected from './Protected';
import Register from './register/Register';
import { WithTranslation, withTranslation } from 'react-i18next';
import Forgot from './login/Forgot';
import Reset from './login/Reset';
import LoadingPage from './LoadingPage';
import Student from '../student/StudentView';
import ModuleGroupList from '../moduleOverview/modulegroup/ModuleGroupList';

interface PageProps extends AuthServiceProps, StyledComponentProps, WithTranslation {
    classes: ClassNameMap;
}

interface PageState {
    isInitialising?: boolean;
}

class Page extends React.Component<PageProps, PageState> {
    constructor(props: Readonly<PageProps>) {
        super(props);
        this.state = {
            isInitialising: true,
        };
    }

    componentDidMount() {
        this.props.authService
            .tryAuthFromCache()
            .then((_) => this.setState({ isInitialising: false }))
            .catch((_) => this.setState({ isInitialising: false }));
    }

    public render() {
        const { classes } = this.props;
        const { isInitialising } = this.state;
        if (isInitialising) {
            return <LoadingPage/>;
        }
        return (
            <div className={classes.root}>
                <Menu/>
                <Paper className={classes.content}>
                    <div className={classes.toolbar}/>
                    <Switch>
                        <Route path="/register">
                            <Register/>
                        </Route>
                        <Route path="/reset">
                            <Reset/>
                        </Route>
                        <Route path="/forgot">
                            <Forgot/>
                        </Route>
                        <Route path="/student">
                            <Protected fallback={<Login/>} showMessage>
                                <Student/>
                            </Protected>
                        </Route>
                        <Route path="/semester/:id">
                            <Protected fallback={<Login/>} showMessage>
                                <SemesterView/>
                            </Protected>
                        </Route>
                        <Route path="/groups">
                            <Protected fallback={<Login/>} showMessage>
                                <ModuleGroupList/>
                            </Protected>
                        </Route>
                        <Route>
                            <Protected fallback={<Login/>} showMessage>
                                <SemesterList/>
                            </Protected>
                        </Route>
                    </Switch>
                </Paper>
            </div>
        );
    }
}

export default withTranslation()(withAuthService(withStyles(PageStyle)(Page)));
