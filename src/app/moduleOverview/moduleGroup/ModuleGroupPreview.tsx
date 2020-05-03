import * as React from 'react';
import {
    isWidthDown,
    StyledComponentProps,
    Typography,
    withStyles,
    withWidth,
    WithWidthProps
} from '@material-ui/core';
import ModuleGroupPreviewStyle from './ModuleGroupPreviewStyle';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import ModuleVisit from '../../../model/ModuleVisit';
import {
    ModuleVisitServiceProps,
    withModuleVisitService,
} from '../../../service/ModuleVisitService';
import ModuleGroup from '../../../model/ModuleGroup';
import ModuleGroupStatistics from './ModuleGroupStatistics';
import SemesterModuleVisit from '../../semester/list/SemesterModuleVisit';
import ParentGroupStatistics from "./ParentGroupStatistics";

interface ModuleGroupPreviewProps extends StyledComponentProps, WithWidthProps, ModuleVisitServiceProps {
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
        const topGroup = level < 1;
        const parentGroup = group.children.length > 0;

        return (
            <div className={classes.root} style={{ marginLeft: levelMargin }}>
                <div className={classes.header}>
                    {topGroup ? <Typography variant="h6" className={classes.title}>
                        {group.name}
                    </Typography> : <Typography variant="subtitle2" className={classes.title}>
                        {group.name}
                    </Typography>}
                    <hr className={classes.rule}/>
                </div>

                {!parentGroup ? <div className={classes.content}>
                        <div className={classes.modules}>
                            {moduleVisits &&
                            moduleVisits.map((mv) => (
                                <SemesterModuleVisit
                                    classes={{
                                        planned: classes.unclickablePlanned,
                                        ongoing: classes.unclickableOngoing,
                                        passed: classes.unclickablePassed,
                                        failed: classes.unclickableFailed,
                                        label: classes.labelCursor
                                    }}
                                    key={`ModuleGroupPreview-moduleVisit-${mv.id}`}
                                    moduleVisit={mv}
                                    isDetailed={false}
                                />
                            ))}
                            {moduleVisits && moduleVisits.length === 0 ? '-' : ''}
                        </div>
                        {!isMobile && (
                            <div className={classes.statistic}>
                                <ModuleGroupStatistics
                                    group={group}
                                    moduleVisits={moduleVisits}
                                />
                            </div>
                        )}

                    </div>
                    :
                    <div className={classes.content}
                         style={{
                             justifyContent: 'center'
                         }}>
                        <ParentGroupStatistics
                            group={group}
                            moduleVisits={moduleVisits}
                        />
                    </div>
                }
            </div>
        );
    }
}

export default withWidth()(withModuleVisitService(withStyles(ModuleGroupPreviewStyle)(ModuleGroupPreview)));