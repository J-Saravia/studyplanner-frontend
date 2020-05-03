import * as React from 'react';
import { StyledComponentProps, Typography, withStyles } from '@material-ui/core';
import ModuleGroupListStyle from './ModuleGroupListStyle';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import ModuleVisit from '../../../model/ModuleVisit';
import ModuleGroup from '../../../model/ModuleGroup';
import ModuleGroupPreview from './ModuleGroupPreview';
import ProfilePreview from '../profile/ProfilePreview';
import { AuthServiceProps } from '../../../service/AuthService';
import { Alert } from '@material-ui/lab';
import { WithTranslation, withTranslation, Trans } from 'react-i18next';
import withServices, { WithServicesProps } from '../../../service/WithServices';
import Profile from '../../../model/Profile';

interface ModuleGroupListState {
    moduleGroups?: ModuleGroup[];
    moduleVisits?: ModuleVisit[];
    profiles?: Profile[];
    error?: string;
}

interface ModuleGroupListProps extends WithServicesProps, StyledComponentProps, WithTranslation, AuthServiceProps {
    classes: ClassNameMap;
}

class ModuleGroupList extends React.Component<ModuleGroupListProps, ModuleGroupListState> {

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
        this.props.profileService
            .getForStudentDegree()
            .then((profilesOfStudent: Profile[]) =>
                this.setState({
                    profiles: profilesOfStudent,
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
        const moduleVisitsForGroup = moduleVisits ?
            moduleVisits.filter((mv) => moduleGroup.modules.includes(mv.module))
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

    getProfileList = () => {
        return (
            this.state.profiles &&
            this.state.profiles.map((p) => {
                const moduleVisitsOfCurrentProfile = this.state.moduleVisits?.filter(
                    (mv) => p.modules.includes(mv.module)
                );
                return (
                    <ProfilePreview
                        key={p.id}
                        profile={p}
                        moduleVisits={moduleVisitsOfCurrentProfile}
                        level={0}
                    />
                );
            })
        );
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

        if (moduleGroups) { //otherwise all module visits can be shown as "Other module visits"
            if (otherModuleVisits && otherModuleVisits.length > 0) {
                moduleGroupResult.push(
                    <ModuleGroupPreview
                        key={0}
                        group={{
                            id: '0',
                            name: t(
                                'translation:messages.moduleGroups.othermodulevisits'
                            ),
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
        }

        const profileElements = this.getProfileList();

        return (
            <div className={classes.root}>
                {!error && moduleGroups && (<div>
                        <div className={classes.list}>
                            <Typography variant="h5" className={classes.title}>
                                <Trans>
                                    translation:messages.moduleGroups.title
                                </Trans>
                            </Typography>
                            {moduleGroupResult}

                        </div>
                        <div className={classes.list}>
                            {profileElements && (
                                <Typography variant="h5" className={classes.title}>
                                    <Trans>
                                        translation:messages.profiles.title
                                    </Trans>
                                </Typography>)}
                            {profileElements}
                        </div>
                    </div>
                )}
                {error && (
                    <Alert color="error">
                        <Trans>
                            translation:messages.moduleGroups.load.error
                        </Trans>
                    </Alert>
                )}
            </div>
        );
    }
}

export default withTranslation()(withServices(withStyles(ModuleGroupListStyle)(ModuleGroupList)));
