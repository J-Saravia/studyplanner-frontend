import Module from './Module';

export default interface ModuleGroup {
    id: string;
    description: string;
    parent: ModuleGroup;
    modules: Module[];
}