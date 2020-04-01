import Student from './Student';
import Module from './Module';

export default interface ModuleVisit {
    id?: string;
    grade: number; // default = min = 0; max = 6
    state: 'passed' | 'failed' | 'ongoing' | 'planned';
    student: Student;
    module: Module;
    semester: string; // example: 'fs20'
    weekday: number; // 0 = Monday
    timeStart: string; // example: 08:15; default 00:00
    timeEnd: string; // default: 01:00

}