import * as React from 'react';
import { CircularProgress, Container, withStyles } from '@material-ui/core';
import LoadingPageStyle from './LoadingPageStyle';
import { Trans } from 'react-i18next';

class LoadingPage extends React.Component<any, any> {

    public render() {
        const { classes } = this.props;

        return (
            <Container maxWidth="xs" className={classes.root}>
                <CircularProgress />
                <Trans>translation:messages.initialising</Trans>
            </Container>
        );
    }

}

export default withStyles(LoadingPageStyle)(LoadingPage);