import * as React from 'react';
import HttpClient from './HttpClient';
import Degree, { DegreeDto } from '../model/Degree';
import CacheableService from './CacheableService';
import ProfileService from './ProfileService';
import ModuleGroupService from './ModuleGroupService';

export default class DegreeService extends CacheableService<Degree>{

    public static readonly INSTANCE = new DegreeService();

    private restClient = new HttpClient('degrees');


    private constructor() {
        super();
    }

    protected async loadData(): Promise<Degree[]> {
        const data = [];
        const dtos = (await this.restClient.getList<DegreeDto>());
        for(const dto of dtos) {
            const groups = [];
            for(const id of dto.groups) {
                groups.push(await ModuleGroupService.INSTANCE.findById(id));
            }
            const profile = [];
            for(const id of dto.profile) {
                profile.push(await ProfileService.INSTANCE.findById(id));
            }
            data.push({
                ...dto,
                groups,
                profile,
            });
        }
        return data;
    }
}

// https://medium.com/@thehappybug/using-react-context-in-a-typescript-app-c4ef7504c858

const { Provider, Consumer } = React.createContext(DegreeService.INSTANCE);

export interface DegreeServiceProps {
    degreeService: DegreeService;
}

export const withDegreeService = <P extends DegreeServiceProps>(Component: React.ComponentType<P>): React.FC<Omit<P, keyof DegreeServiceProps>> =>
    props => (
        <Consumer>
            {value => <Component {...props as P} degreeService={value}/>}
        </Consumer>
    );

export const DegreeServiceProvider: React.FC<DegreeServiceProps> = props => (
    <Provider value={props.degreeService}>{props.children}</Provider>
);