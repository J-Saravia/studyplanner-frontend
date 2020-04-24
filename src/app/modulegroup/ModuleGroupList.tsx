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
import { WithTranslation, withTranslation } from 'react-i18next';

interface ModuleGroupListState {
  moduleGroups?: ModuleGroup[];
  moduleVisits?: ModuleVisit[];
  error?: string;
}

interface ModuleGroupListProps
  extends StudentServiceProps,
    ModuleGroupServiceProps,
    ModuleVisitServiceProps,
    StyledComponentProps,
    WithTranslation,
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
      .then((moduleGroupsOfDegree) =>
        this.setState({ moduleGroups: moduleGroupsOfDegree })
      )
      .catch((error) => this.setState({ error: error.toString() }));
    this.props.moduleVisitService
      .list()
      .then((moduleVisitsOfStudent: ModuleVisit[]) =>
        this.setState({
          moduleVisits: moduleVisitsOfStudent,
        })
      )
      .catch((error) => this.setState({ error: error.toString() }));
  }

  getModuleGroupElementsHierarchical = (
    level: number,
    moduleGroup: ModuleGroup,
    moduleVisits?: ModuleVisit[]
  ): { usedModuleVisits: ModuleVisit[]; moduleGroupElements: any[] } => {
    let moduleGroupElements: any = [];
    let usedModuleVisits: ModuleVisit[] = [];
    const moduleVisitsForGroup = moduleVisits
      ? moduleVisits.filter((mv) => moduleGroup.modules.includes(mv.module))
      : [];
    moduleGroupElements.push(
      <ModuleGroupPreview
        key={moduleGroup.id}
        group={moduleGroup}
        moduleVisits={moduleVisitsForGroup}
        level={level}
      />
    );
    for (let mv of moduleVisitsForGroup) {
      usedModuleVisits.push(mv);
    }

    for (let group of moduleGroup.children) {
      const res = this.getModuleGroupElementsHierarchical(
        level + 1,
        group,
        moduleVisits
      );
      moduleGroupElements.push(res.moduleGroupElements);
      for (let mv of res.usedModuleVisits) {
        usedModuleVisits.push(mv);
      }
    }

    return { moduleGroupElements, usedModuleVisits };
  };

  public render() {
    const { classes, t } = this.props;
    const { moduleGroups, moduleVisits, error } = this.state;

    const rootModuleGroups =
      moduleGroups && moduleGroups.filter((mg) => !mg.parent);
    let moduleGroupResult: any[] = [];
    let usedModuleVisits: any[] = [];

    if (rootModuleGroups) {
      for (let rootModuleGroup of rootModuleGroups) {
        const res = this.getModuleGroupElementsHierarchical(
          0,
          rootModuleGroup,
          moduleVisits
        );
        moduleGroupResult.push(res.moduleGroupElements);
        for (let mv of res.usedModuleVisits) {
          usedModuleVisits.push(mv);
        }
      }
    } else if (moduleGroups) {
      // fallback: non-hierarchical structure
      moduleGroupResult = moduleGroups.map((g) => {
        const moduleVisitsOfCurrentGroup = moduleVisits?.filter((mv) =>
          g.modules.includes(mv.module)
        );
        if (moduleVisitsOfCurrentGroup) {
          for (let mv of moduleVisitsOfCurrentGroup) {
            usedModuleVisits.push(mv);
          }
        }
        return (
          <ModuleGroupPreview
            key={g.id}
            group={g}
            moduleVisits={moduleVisitsOfCurrentGroup}
            level={0}
          />
        );
      });
    }
    // add another group for module visits of different degrees (accredited ones for example)
    const otherModuleVisits = moduleVisits?.filter(
      (mv) => usedModuleVisits.indexOf(mv) < 0
    );
    if (otherModuleVisits && otherModuleVisits.length > 0) {
      moduleGroupResult.push(
        <ModuleGroupPreview
          key={0}
          group={{
            id: '0',
            name: t('translation:messages.moduleGroups.othermodulevisits'),
            description: '',
            parent: undefined,
            children: [],
            minima: 0,
            modules: [],
          }}
          moduleVisits={otherModuleVisits}
          level={0}
        />
      );
    }

    return (
      <div className={classes.root}>
        <div className={classes.list}>{moduleGroupResult}</div>
        {error && <Alert color="error">Error</Alert>}
      </div>
    );
  }
}

export default withTranslation()(
  withAuthService(
    withStudentService(
      withModuleVisitService(
        withModuleGroupService(
          withStyles(ModuleGroupListStyle)(ModuleGroupList)
        )
      )
    )
  )
);
