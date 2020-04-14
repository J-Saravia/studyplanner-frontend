import ModuleGroup from './ModuleGroup';

export default interface Module {
    id: string;
    code: string;
    name: string;
    description: string;
    credits: number;
    hs: boolean;
    fs: boolean;
    msp: 'NONE' | 'WRITTEN' | 'ORAL';
    requirements: Module[];
    group?: ModuleGroup;
}

export interface ModuleDto extends Omit<Module, 'requirements' | 'group'> {
    requirements: string[];
}