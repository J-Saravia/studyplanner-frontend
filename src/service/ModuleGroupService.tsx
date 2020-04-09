import * as React from 'react';
import HttpClient from './HttpClient';
import ModuleGroup, { ModuleGroupDto } from '../model/ModuleGroup';
import CacheableService from './CacheableService';
import ModuleService from './ModuleService';

export default class ModuleGroupService extends CacheableService<ModuleGroup>{

    public static readonly INSTANCE = new ModuleGroupService();

    private restClient = new HttpClient('modulegroups');

    private constructor() {
        super();
    }

    protected async loadData(): Promise<ModuleGroup[]> {
        const data = (await this.restClient.getList<ModuleGroupDto>())
            .map(dto => ({
                dto,
                group: {
                    ...dto,
                    modules: [],
                    children: [],
                    parent: undefined
                } as ModuleGroup
            }));
        for(const obj of data) {
            const { group, dto } = obj;
            const parent = data.find(s => s.group.id === dto.parent)?.group;
            if (parent) {
                obj.group.parent = parent;
                parent.children.push(group);
            }
            for(const id of obj.dto.modules) {
                group.modules.push(await ModuleService.INSTANCE.findById(id));
            }
        }
        return data.map(d => d.group);
    }
}

// https://medium.com/@thehappybug/using-react-context-in-a-typescript-app-c4ef7504c858

const { Provider, Consumer } = React.createContext(ModuleGroupService.INSTANCE);

export interface ModuleGroupServiceProps {
    moduleGroupService: ModuleGroupService;
}

export const withModuleGroupService = <P extends ModuleGroupServiceProps>(Component: React.ComponentType<P>): React.FC<Omit<P, keyof ModuleGroupServiceProps>> =>
    props => (
        <Consumer>
            {value => <Component {...props as P} moduleGroupService={value}/>}
        </Consumer>
    );

export const ModuleGroupServiceProvider: React.FC<ModuleGroupServiceProps> = props => (
    <Provider value={props.moduleGroupService}>{props.children}</Provider>
);