import ModuleGroup from './ModuleGroup';
import Profile from './Profile';

export default interface Degree {
    id: string;
    name: string;
    groups: ModuleGroup[];
    profiles: Profile[];
}

export interface DegreeDto extends Omit<Degree, 'groups' | 'profiles'> {
    groups: string[];
    profiles: string[];
}