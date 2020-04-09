export default interface Module {
    id?: string;
    code: string;
    name: string;
    description: string;
    credits: number;
    hs: boolean;
    fs: boolean;
    msp: 'NONE' | 'WRITTEN' | 'ORAL';
    requirements: Module[];
}

export interface ModuleDto extends Omit<Module, 'requirements'>{
    requirements: string[];
}