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

    /**
     * Fetches a flat list of the ModuleVisits for the current student from the backend
     */
    public async list(): Promise<ModuleVisit[]> {
        const authService = AuthService.INSTANCE;
        if (!await authService.tryEnsureLoggedIn()) {
            throw new Error('Unauthorized');
        }
        const student = authService.getCurrentStudent() as Student;
        const dtos = await this.restClient
            .request()
            .query({student: student.id})
            .fetch<ModuleVisitDto[]>();
        const visits = [];
        for(const dto of dtos) {
            visits.push(await ModuleVisitService.convertToModel(dto, student));
        }
        return visits;
    }

    /**
     * Fetches all ModuleVisits for the current student from the backend and maps them with the semester as key
     */
    public async map(): Promise<{ [key: string]: ModuleVisit[] }> {
        const authService = AuthService.INSTANCE;
        if (!await authService.tryEnsureLoggedIn()) {
            throw new Error('Unauthorized');
        }
        const student = authService.getCurrentStudent() as Student;
        const dtos = await this.restClient
            .request()
            .query({student: student.id})
            .fetch<ModuleVisitDto[]>();
        const visitMap: { [key: string]: ModuleVisit[] } = {};
        for (const dto of dtos) {
            const visit = await ModuleVisitService.convertToModel(dto, student);
            if (!visitMap[dto.semester]) {
                visitMap[dto.semester] = [];
            }
            visitMap[dto.semester].push(visit);
        }
        Object.keys(visitMap).forEach(key => {
            visitMap[key] = this.sortList(visitMap[key]);
        });
        return visitMap;
    }

    /**
     * Sorts a list of ModuleVisits based on state and grade
     * @param list
     */
    public sortList(list: ModuleVisit[]) {
        return list.sort((a, b) => ModuleVisitService.compareModuleVisits(a, b));
    }

    /**
     * Fetches a ModuleVisit with a specific id
     * @param id
     */
    public async findById(id: string): Promise<ModuleVisit> {
        return ModuleVisitService.convertToModel(await this.restClient.getOne(id));
    }

    /**
     * Creates a new ModuleVisit
     * @param moduleVisit
     */
    public async create(moduleVisit: ModuleVisit): Promise<ModuleVisit> {
        const dto = await ModuleVisitService.convertToDto(moduleVisit);
        return ModuleVisitService.convertToModel(await this.restClient.post(dto), moduleVisit.student, moduleVisit.module);
    }

    /**
     * Updates the ModuleVisit with the given id
     * @param id
     * @param moduleVisit
     */
    public async update(id: string, moduleVisit: ModuleVisit): Promise<ModuleVisit> {
        const dto = await ModuleVisitService.convertToDto(moduleVisit);
        return ModuleVisitService.convertToModel(await this.restClient.put(id, dto), moduleVisit.student, moduleVisit.module);
    }

    /**
     * Deletes the ModuleVisit with the given id
     * @param id
     */
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

    private static async convertToModel(dto: ModuleVisitDto, student?: Student, module?: Module): Promise<ModuleVisit> {
        return {
            ...dto,
            student: student || await StudentService.INSTANCE.findById(dto.student),
            module: module || await ModuleService.INSTANCE.findById(dto.module)
        };
    }

    private static async convertToDto(model: ModuleVisit): Promise<ModuleVisitDto> {
        return {
            ...model,
            grade: +model.grade,
            student: model.student.id as string,
            module: model.module.id as string
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