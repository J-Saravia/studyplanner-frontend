import Module from './Module';

export default interface ModuleGroup {
    id: string;
    name: string;
    description: string;
    parent?: ModuleGroup;
    children: ModuleGroup[];
    modules: Module[];
    minima: number;
}

export interface ModuleGroupDto extends Omit<ModuleGroup, 'parent' | 'modules' | 'children'> {
    parent?: string;
    modules: string[];
}