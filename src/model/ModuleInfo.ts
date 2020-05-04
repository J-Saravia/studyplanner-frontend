import Module from './Module';

export default interface ModuleInfo {
    id: string;
    module: Module;
    state: 'failed' | 'blocked' | 'passed' | 'ongoing' | 'planned' | 'none';
    passedRequirements: boolean;
    searchString: string;
    semesters: string[];
}