import * as React from 'react';
import {
    isWidthDown,
    StyledComponentProps,
    Typography,
    withStyles,
    withWidth,
    WithWidthProps
} from '@material-ui/core';
import ProfilePreviewStyle from './ProfilePreviewStyle';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import ModuleVisit from '../../../model/ModuleVisit';
import {
    ModuleVisitServiceProps,
    withModuleVisitService,
} from '../../../service/ModuleVisitService';
import Profile from '../../../model/Profile';
import ProfileModule from './ProfileModule';
import ProfileStatistics from './ProfileStatistics';

interface ProfilePreviewProps extends StyledComponentProps, WithWidthProps, ModuleVisitServiceProps {
    classes: ClassNameMap;
    profile: Profile;
    moduleVisits?: ModuleVisit[];
    width: Breakpoint;
    level: number;
}

interface ProfilePreviewState {
    error?: string;
}

class ProfilePreview extends React.Component<ProfilePreviewProps, ProfilePreviewState> {

    constructor(props: Readonly<ProfilePreviewProps>) {
        super(props);
        this.state = {};
    }

    public render() {
        const { classes, moduleVisits, profile, width, level } = this.props;
        const isMobile = isWidthDown('sm', width);

        const levelMargin = isMobile ? 10 * level : 20 * level;

        return (
            <div className={classes.root} style={{ marginLeft: levelMargin }}>
                <div className={classes.header}>
                    <Typography variant="h6" className={classes.title}>
                        {profile.name}
                    </Typography>
                    <hr className={classes.rule}/>
                </div>


                <div className={classes.content}>
                    <div className={classes.modules}>
                        {profile.modules &&
                        moduleVisits &&
                        profile.modules.map((m) => (
                            <ProfileModule
                                key={`ProfilePreview-module-${m.id}`}
                                moduleOfProfile={m}
                                state={
                                    moduleVisits.find(
                                        (mv) => mv.module.id === m.id
                                    )?.state
                                }
                            />
                        ))}
                    </div>
                    {!isMobile && (
                        <div className={classes.statistic}>
                            <ProfileStatistics
                                profile={profile}
                                moduleVisits={moduleVisits}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default withWidth()(
    withModuleVisitService(withStyles(ProfilePreviewStyle)(ProfilePreview))
);
