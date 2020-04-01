import ModuleGroup from './ModuleGroup';

export default interface Degree {
    id: string;
    name: string;
    groups: ModuleGroup[];
    profile: [string];
}