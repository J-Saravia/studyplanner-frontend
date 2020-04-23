import * as React from 'react';
import { StyledComponentProps, withStyles } from '@material-ui/core';
import ModuleGroupListStyle from './ModuleGroupListStyle';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import ModuleVisit from '../../model/ModuleVisit';
import ModuleGroup from '../../model/ModuleGroup';
import ModuleGroupPreview from './ModuleGroupPreview';
import {
  StudentServiceProps,
  withStudentService,
} from '../../service/StudentService';
import {
  withModuleGroupService,
  ModuleGroupServiceProps,
} from '../../service/ModuleGroupService';
import {
  ModuleVisitServiceProps,
  withModuleVisitService,
} from '../../service/ModuleVisitService';
import { AuthServiceProps, withAuthService } from '../../service/AuthService';
import { Alert } from '@material-ui/lab';

interface ModuleGroupListState {
  moduleGroupMapReadonly?: ModuleGroup[];
  moduleVisitMapReadonly?: ModuleVisit[];
  error?: string;
}

interface ModuleGroupListProps
  extends StudentServiceProps,
    ModuleGroupServiceProps,
    ModuleVisitServiceProps,
    StyledComponentProps,
    AuthServiceProps {
  classes: ClassNameMap;
}

class ModuleGroupList extends React.Component<
  ModuleGroupListProps,
  ModuleGroupListState
> {
  constructor(props: Readonly<ModuleGroupListProps>) {
    super(props);
    this.state = {};
  }

  public componentDidMount() {
    this.props.moduleGroupService
      .getForStudentDegree()
      .then((moduleGroups) =>
        this.setState({ moduleGroupMapReadonly: moduleGroups })
      )
      .catch((error) => this.setState({ error: error.toString() }));
    this.props.moduleVisitService
      .list()
      .then((moduleVisitsOfStudent: ModuleVisit[]) =>
        this.setState({
          moduleVisitMapReadonly: moduleVisitsOfStudent,
        })
      )
      .catch((error) => this.setState({ error: error.toString() }));
  }

  public render() {
    const { classes } = this.props;
    const {
      moduleGroupMapReadonly: moduleGroups,
      moduleVisitMapReadonly: moduleVisits,
      error,
    } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.list}>
          {moduleGroups &&
            moduleGroups.map((g) => (
              <ModuleGroupPreview
                key={g.id}
                group={g}
                moduleVisits={moduleVisits?.filter((mv) =>
                  g.modules.includes(mv.module)
                )}
              />
            ))}
        </div>
        {error && <Alert color="error">Error</Alert>}
      </div>
    );
  }
}

export default withAuthService(
  withStudentService(
    withModuleVisitService(
      withModuleGroupService(withStyles(ModuleGroupListStyle)(ModuleGroupList))
    )
  )
);
