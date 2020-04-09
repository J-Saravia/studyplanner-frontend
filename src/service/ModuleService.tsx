import * as React from 'react';
import Module, { ModuleDto } from '../model/Module';
import HttpClient from './HttpClient';
import CacheableService from './CacheableService';

export default class ModuleService extends CacheableService<Module> {

    public static readonly INSTANCE = new ModuleService();

    private restClient = new HttpClient('modules');

    private constructor() {
        super();
    }

    protected async loadData(): Promise<Module[]> {
        const dtos = await this.restClient.getList<ModuleDto>();
        const data: Module[] = [];
        dtos.forEach(dto => data.push({ ...dto, requirements: [] }));
        for(const module of data) {
            const requirements = dtos.find(dto => dto.id === module.id)?.requirements || [];
            for(const id of requirements) {
                const requiredModule = data.find(m => m.id === id);
                if (requiredModule) {
                    module.requirements.push(requiredModule);
                }
            }
        }
        return data;
    }
}

// https://medium.com/@thehappybug/using-react-context-in-a-typescript-app-c4ef7504c858

const { Provider, Consumer } = React.createContext(ModuleService.INSTANCE);

export interface ModuleServiceProps {
    moduleService: ModuleService;
}

export const withModuleService = <P extends ModuleServiceProps>(Component: React.ComponentType<P>): React.FC<Omit<P, keyof ModuleServiceProps>> => {
    return props => (
        <Consumer>
            {value => <Component {...props as P} moduleService={value}/>}
        </Consumer>
    );
};

export const ModuleServiceProvider: React.FC<ModuleServiceProps> = props => (
    <Provider value={props.moduleService}>{props.children}</Provider>
);