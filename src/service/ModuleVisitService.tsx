import * as React from 'react';
import ModuleVisit, { ModuleVisitDto } from '../model/ModuleVisit';
import HttpClient from './HttpClient';
import StudentService from './StudentService';
import ModuleService from './ModuleService';
import Module from '../model/Module';
import Student from '../model/Student';
import AuthService from './AuthService';

export default class ModuleVisitService {

    public static readonly INSTANCE = new ModuleVisitService();

    private restClient = new HttpClient('modulevisits');

    private constructor() {}


    public async list(): Promise<{ [key: string]: ModuleVisit[] }> {
        const authService = AuthService.INSTANCE;
        if (!authService.isLoggedIn()) {
            throw new Error('Unauthorized');
        }
        const student = authService.getCurrentStudent() as Student;
        const dtos = await this.restClient
            .request()
            .query({student: student.id})
            .fetch<ModuleVisitDto[]>();
        const visitMap: { [key: string]: ModuleVisit[] } = {};
        for (const dto of dtos) {
            const visit = await ModuleVisitService.convertDto(dto, student);
            if (!visitMap[dto.semester]) {
                visitMap[dto.semester] = [];
            }
            visitMap[dto.semester].push(visit);
        }
        Object.keys(visitMap).forEach(key => {
            visitMap[key] = visitMap[key].sort((a, b) => ModuleVisitService.compareModuleVisits(a, b));
        });
        return visitMap;
    }

    public async findById(id: string): Promise<ModuleVisit> {
        return ModuleVisitService.convertDto(await this.restClient.getOne(id));
    }

    public async create(moduleVisit: ModuleVisit): Promise<ModuleVisit> {
        return ModuleVisitService.convertDto(await this.restClient.post(moduleVisit));
    }

    public async update(id: string, moduleVisit: ModuleVisit): Promise<ModuleVisit> {
        return ModuleVisitService.convertDto(await this.restClient.put(id, moduleVisit));
    }

    public async delete(id: string) {
        return await this.restClient.delete(id);
    }

    private static compareModuleVisits(a: ModuleVisit, b: ModuleVisit) {
        const va = ModuleVisitService.stateValue(a) - a.grade;
        const vb = ModuleVisitService.stateValue(b) - b.grade;
        return va - vb;
    }

    private static stateValue(moduleVisit: ModuleVisit) {
        switch (moduleVisit.state) {
            case 'planned':
                return 10;
            case 'ongoing':
                return 20;
            case 'passed':
                return 30;
            case 'failed':
                return 40;
        }
    }

    private static async convertDto(dto: ModuleVisitDto, student?: Student, module?: Module): Promise<ModuleVisit> {
        return {
            ...dto,
            student: student || await StudentService.INSTANCE.findById(dto.student),
            module: module || await ModuleService.INSTANCE.findById(dto.module)
        };
    }
}

// https://medium.com/@thehappybug/using-react-context-in-a-typescript-app-c4ef7504c858

const { Provider, Consumer } = React.createContext(ModuleVisitService.INSTANCE);

export interface ModuleVisitServiceProps {
    moduleVisitService: ModuleVisitService;
}

export const withModuleVisitService = <P extends ModuleVisitServiceProps>(Component: React.ComponentType<P>): React.FC<Omit<P, keyof ModuleVisitServiceProps>> => {
    return props => (
        <Consumer>
            {value => <Component {...props as P} moduleVisitService={value}/>}
        </Consumer>
    );
};

export const ModuleVisitServiceProvider: React.FC<ModuleVisitServiceProps> = props => (
    <Provider value={props.moduleVisitService}>{props.children}</Provider>
);