import * as React from 'react';
import {
    Chip,
    isWidthDown,
    StyledComponentProps,
    withStyles,
    withWidth,
    WithWidthProps,
} from '@material-ui/core';
import ProfileModuleStyle from './ProfileModuleStyle';
import clsx from 'clsx';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import Module from '../../../model/Module';

interface ProfileModuleProps extends StyledComponentProps, WithWidthProps {
    moduleOfProfile: Module;
    state?: string;
    width: Breakpoint;
    classes: ClassNameMap;
}

class ProfileModule extends React.Component<ProfileModuleProps, any> {

    constructor(props: Readonly<any>) {
        super(props);
        this.state = {};
    }

    public render() {
        const { state, classes, width, moduleOfProfile } = this.props;

        const isMobile = isWidthDown('sm', width);
        const chipWidth = (isMobile ? 40 : 112) * (moduleOfProfile.credits / 2);

        return (
            <Chip
                tabIndex={-1}
                label={moduleOfProfile.code}
                classes={{
                    root: clsx(classes.root, {
                        [classes.mobile]: isMobile,
                        [classes.ongoing]: state === 'ongoing',
                        [classes.planned]: state === 'planned',
                        [classes.passed]: state === 'passed',
                        [classes.failed]: state === 'failed',
                        [classes.blank]:
                        state !== 'ongoing' &&
                        state !== 'planned' &&
                        state !== 'passed' &&
                        state !== 'failed',
                    }),
                    label: classes.label,
                }}
                style={{
                    width: isMobile ? '' : `${chipWidth}px`,
                    height: !isMobile ? '' : `${chipWidth}px`,
                }}
            />
        );
    }
}

export default withWidth()(withStyles(ProfileModuleStyle)(ProfileModule));
