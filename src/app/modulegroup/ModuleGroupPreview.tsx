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
}

interface ModuleGroupPreviewState {
  error?: string;
}

class ModuleGroupPreview extends React.Component<
  ModuleGroupPreviewProps,
  ModuleGroupPreviewState
> {
  constructor(props: Readonly<ModuleGroupPreviewProps>) {
    super(props);
    this.state = {};
  }

  public render() {
    const { classes, moduleVisits, group, width } = this.props;
    const isMobile = isWidthDown('sm', width);

    return (
      <div className={classes.root}>
        <Typography variant="h6" className={classes.title}>
          {group.name}
        </Typography>
        <hr className={classes.rule} />

        <div className={classes.content}>
          <div className={classes.modules}>
            {moduleVisits &&
              moduleVisits.map((mv) => (
                <SemesterModuleVisit
                  key={`ModuleGroupPreview-moduleVisit-${mv.id}`}
                  moduleVisit={mv}
                  isDetailed={false}
                />
              ))}
            {moduleVisits && moduleVisits.length === 0 ? '-' : ''}
          </div>
          {!isMobile && (
            <ModuleGroupStatistics group={group} moduleVisits={moduleVisits} />
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
