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

interface PageProps extends AuthServiceProps, StyledComponentProps {
    classes: ClassNameMap;
}

interface PageState {
    isInitialising?: boolean;
}

class Page extends React.Component<PageProps, PageState> {


    constructor(props: Readonly<PageProps>) {
        super(props);
        this.state = {
            isInitialising: true
        };
    }

    componentDidMount() {
        this.props.authService.tryAuthFromCache()
            .then(_ => this.setState({isInitialising: false}))
            .catch(_ => this.setState({isInitialising: false}));
    }

    public render() {
        const { classes } = this.props;
        const { isInitialising } = this.state;
        if (isInitialising) {
            return 'loading...';
        }
        return (
            <div className={classes.root}>
                <Menu/>
                <Paper className={classes.content}>
                    <div className={classes.toolbar}/>
                    <Switch>
                        <Protected fallback={<Login />}>
                            <Route path="/semester/:id">
                                <SemesterView/>
                            </Route>
                            <Route>
                                <SemesterList/>
                            </Route>
                        </Protected>
                    </Switch>
                </Paper>
            </div>
        );
    }
}

export default withAuthService(withStyles(PageStyle)(Page));