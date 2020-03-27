import Module from './Module';

export default interface Profile {
    id: string;
    name: string;
    modules: Module[];
    minima: number;
}