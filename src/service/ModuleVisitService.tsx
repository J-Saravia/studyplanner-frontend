import * as React from 'react';
import * as uuid from 'uuid';
import Module from '../model/Module';
import ModuleVisit from '../model/ModuleVisit';
import StudentService from './StudentService';
import ModuleService from './ModuleService';

export default class ModuleVisitService {

    public static readonly INSTANCE = new ModuleVisitService();

    private readonly moduleVisits: ModuleVisit[] = [];

    private constructor() {
        const students = StudentService.INSTANCE.list();
        const ms = ModuleService.INSTANCE.getModules();
        students.forEach(student => {
            let count = 0;
            let totalCreditCount = 0;
            let totalNegativeCreditCount = 0;
            const studentSkill = Math.random() - 0.5;
            const extraCredits = Math.random() >= 0.9 ? Math.floor(Math.random() * 21) : 0;
            const startSemester = +student.semester;
            const semesterCount = Math.ceil((2020 - startSemester) * 2 + (Math.random() >= 0.5 ? 0 : 1) + (Math.random() >= 0.9 ? 1 : 0));
            const averageCreditsPerSemester = ((180 + extraCredits) / (Math.max(6, semesterCount)));
            let cs = 0;
            for (let i = 0; i < semesterCount; ++i) {
                const semester = `${i % 2 === 0 || i === 0 ? 'hs' : 'fs'}${Math.floor(startSemester + cs)}`;
                const isCurrentSemester = semester === 'fs2020';
                const isFutureSemester = semester === 'hs2020' || (startSemester + cs >= 2021);
                let creditCount = 0;
                const addedModules: Module[] = [];
                while (creditCount <= averageCreditsPerSemester && totalCreditCount < 180 + extraCredits) {
                    let module = ms[Math.floor(Math.random() * ms.length)];
                    while (addedModules.indexOf(module) !== -1 || creditCount + module.credits > 35) {
                        module = ms[Math.floor(Math.random() * ms.length)];
                    }
                    addedModules.push(module);
                    let grade = ((isCurrentSemester && Math.random() < 0.9) || isFutureSemester ? 0 : (1 + (Math.random() * 5)));
                    if (grade > 0 && grade <= 4 && (Math.random() >= studentSkill || module.credits >= 6)) {
                        grade += 2;
                        if (grade <= 4 && module.credits >= 6) {
                            grade += .5;
                        }
                    }
                    if (grade > 0 && grade < 3.75 && totalNegativeCreditCount + module.credits >= 60) {
                        grade = 4;
                    }
                    grade = +grade.toFixed(2);
                    if (grade > 0 && grade < 3.75) {
                        totalNegativeCreditCount += module.credits;
                    }
                    const state = grade > 0 ? grade < 3.75 ? 'failed' : 'passed' : isFutureSemester ? 'planned' : 'ongoing';
                    const visit: ModuleVisit = {
                        id: uuid.v4(),
                        grade,
                        student,
                        module,
                        semester,
                        state,
                        weekday: Math.floor(Math.random() * 7),
                        timeStart: '08:00',
                        timeEnd: '08:01'
                    };
                    this.moduleVisits.push(visit);
                    ++count;
                    creditCount += module.credits;
                    totalCreditCount += module.credits;
                }
                cs += (i + 1) % 2;
            }
            console.log(`Created ${count} modules over ${semesterCount} semesters for ${student.email}`);
        });
    }


    public async list(studentId: string): Promise<{ [key: string]: ModuleVisit[] }> {
        const visits: ModuleVisit[] = (await Promise.resolve(this.moduleVisits).then(value => value)).filter(m => m.student.id === studentId);
        const visitMap: { [key: string]: ModuleVisit[] } = {};
        visits.forEach(v => {
            if (!visitMap[v.semester]) {
                visitMap[v.semester] = [];
            }
            visitMap[v.semester].push(v);
        });
        Object.keys(visitMap).forEach(key => {
            visitMap[key] = visitMap[key].sort((a, b) => ModuleVisitService.compareModuleVisits(a, b));
        });
        return visitMap;
    }

    private static compareModuleVisits(a: ModuleVisit, b: ModuleVisit) {
        let va = ModuleVisitService.stateValue(a) - a.grade;
        let vb = ModuleVisitService.stateValue(b) - b.grade;
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

    public find(id: string) {
        return Promise.resolve(this.moduleVisits.find(s => s.id === id));
    }

    public create(moduleVisit: ModuleVisit) {

    }

    public update(id: string, moduleVisit: ModuleVisit) {

    }

    public delete(id: string) {
        const index = this.moduleVisits.findIndex(mv => mv.id === id);
        if (index >= 0) {
            this.moduleVisits.splice(index, 1);
        }
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