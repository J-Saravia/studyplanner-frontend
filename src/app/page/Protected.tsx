import * as React from 'react';
import * as Rx from 'rxjs';
import { AuthServiceProps, withAuthService } from '../../service/AuthService';
import { Trans } from 'react-i18next';

interface ProtectedProps extends AuthServiceProps{
    fallback?: React.ReactNode;
    showMessage?: boolean;
    redirectToLogin?: boolean;
}

interface ProtectedState {
    isLoggedIn?: boolean;
}

/**
 * This component renders it's children only if the current user is logged in.
 * It will display a message or fallback ReactNode if not declared as silent.
 */
class Protected extends React.Component<ProtectedProps, ProtectedState> {

    private subscription?: Rx.Subscription;

    constructor(props: Readonly<ProtectedProps>) {
        super(props);
        this.state = {
            isLoggedIn: props.authService.isLoggedIn()
        };
    }

    public componentDidMount() {
        this.subscription = this.props.authService
            .addAuthStateListener(isLoggedIn => this.setState({isLoggedIn}));
    }

    public componentWillUnmount() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    public render() {
        const { showMessage, fallback, children } = this.props;
        const { isLoggedIn } = this.state;
        if (isLoggedIn) {
            return children;
        } else if (showMessage) {
            return fallback || (<Trans>translation:messages.unauthorized</Trans>);
        }
        return null;
    }

}

export default withAuthService(Protected);