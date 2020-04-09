import ModuleGroup from './ModuleGroup';
import Profile from './Profile';

export default interface Degree {
    id: string;
    name: string;
    groups: ModuleGroup[];
    profile: Profile[];
}

export interface DegreeDto extends Omit<Degree, 'groups' | 'profile'> {
    groups: string[];
    profile: string[];
}