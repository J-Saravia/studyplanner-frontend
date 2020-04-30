import * as React from 'react';
import {
    isWidthDown,
    StyledComponentProps,
    Typography,
    withStyles,
    withWidth,
    WithWidthProps,
} from '@material-ui/core';
import ModuleGroupPreviewStyle from './ModuleGroupPreviewStyle';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import ModuleVisit from '../../model/ModuleVisit';
import {
    ModuleVisitServiceProps,
    withModuleVisitService,
} from '../../service/ModuleVisitService';
import ModuleGroup from '../../model/ModuleGroup';
import ModuleGroupStatistics from './ModuleGroupStatistics';
import SemesterModuleVisit from '../semester/list/SemesterModuleVisit';

interface ModuleGroupPreviewProps
    extends StyledComponentProps,
        WithWidthProps,
        ModuleVisitServiceProps {
    classes: ClassNameMap;
    group: ModuleGroup;
    moduleVisits?: ModuleVisit[];
    width: Breakpoint;
    level: number;
}

interface ModuleGroupPreviewState {
    error?: string;
}

class ModuleGroupPreview extends React.Component<ModuleGroupPreviewProps, ModuleGroupPreviewState> {

    constructor(props: Readonly<ModuleGroupPreviewProps>) {
        super(props);
        this.state = {};
    }

    public render() {
        const { classes, moduleVisits, group, width, level } = this.props;
        const isMobile = isWidthDown('sm', width);

        const levelMargin = isMobile ? 16 * level : 24 * level;

        return (
            <div className={classes.root} style={{ marginLeft: levelMargin }}>
                <div className={classes.header}>
                    {level < 1 ? <Typography variant="h6" className={classes.title}>
                        {group.name}
                    </Typography> : <Typography variant="subtitle2" className={classes.title}>
                        {group.name}
                    </Typography>}
                    <hr className={classes.rule}/>
                </div>

                <div className={classes.content}>
                    <div className={classes.modules}>
                        {moduleVisits &&
                        moduleVisits.map((mv) => (
                            <SemesterModuleVisit
                                classes={{
                                    planned: classes.unclickablePlanned,
                                    ongoing: classes.unclickableOngoing,
                                    passed: classes.unclickablePassed,
                                    failed: classes.unclickableFailed
                                }}
                                key={`ModuleGroupPreview-moduleVisit-${mv.id}`}
                                moduleVisit={mv}
                                isDetailed={false}
                            />
                        ))}
                        {moduleVisits && moduleVisits.length === 0 ? '-' : ''}
                    </div>
                    {!isMobile && (
                        <ModuleGroupStatistics
                            group={group}
                            moduleVisits={moduleVisits}
                        />
                    )}
                </div>
            </div>
        );
    }
}

export default withWidth()(
    withModuleVisitService(
        withStyles(ModuleGroupPreviewStyle)(ModuleGroupPreview)
    )
);
