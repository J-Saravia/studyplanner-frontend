import * as React from 'react';
import Module, { ModuleDto } from '../model/Module';
import HttpClient from './HttpClient';
import CacheableService from './CacheableService';
import ModuleInfo from '../model/ModuleInfo';
import ModuleVisitService from './ModuleVisitService';

/**
 * Manages the modules
 */
export default class ModuleService extends CacheableService<Module> {

    public static readonly INSTANCE = new ModuleService();

    private restClient = new HttpClient('modules');

    private constructor() {
        super();
    }

    /**
     * Creates a list of ModuleInfos
     * THis will fetch all ModuleVisits for the current student
     */
    public async generateModuleInfoList(): Promise<ModuleInfo[]> {
        const modules = await this.list();
        const visits = await ModuleVisitService.INSTANCE.list();
        const infos: ModuleInfo[] = [];
        for(const module of modules) {
            const info = {
                id: module.id,
                module,
                state: 'none',
                passedRequirements: false,
                searchString: (module.name + module.code).toLowerCase(),
                semesters: []
            } as ModuleInfo;
            for(const visit of visits) {
                if (visit.module.id === module.id) {
                    if (visit.state === info.state) {
                        info.state = 'blocked';
                    } else {
                        info.state = visit.state;
                    }
                    info.semesters.push(visit.semester);
                }
            }
            infos.push(info);
        }
        infos.forEach(info => {
            let passedRequirements = true;

            for (const requirement of info.module.requirements) {
                const requirementInfo = infos.find(i => i.module.id === requirement.id);
                if (requirementInfo) {
                    passedRequirements = passedRequirements && requirementInfo.state === 'passed';
                }
            }

            info.passedRequirements = passedRequirements;
        });
        return infos;
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