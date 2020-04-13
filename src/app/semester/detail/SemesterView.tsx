import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { ModuleVisitServiceProps, withModuleVisitService } from '../../../service/ModuleVisitService';
import { AuthServiceProps, withAuthService } from '../../../service/AuthService';
import ModuleVisit from '../../../model/ModuleVisit';

interface SemesterViewProps extends RouteComponentProps<{id: any}>, ModuleVisitServiceProps, AuthServiceProps {}

class SemesterView extends React.Component<SemesterViewProps, any> {

    constructor(props: Readonly<SemesterViewProps>) {
        super(props);
        this.state = {};
    }

    componentDidMount(): void {
        this.props.moduleVisitService.map().then(map => this.setState({visits: map[this.props.match.params.id]}));
    }

    public render() {
        return this.state.visits ? this.state.visits.map((m: ModuleVisit) => <div>{m.module.code}</div>) : 'loading';
    }

}

export default withRouter(withAuthService(withModuleVisitService(SemesterView)));