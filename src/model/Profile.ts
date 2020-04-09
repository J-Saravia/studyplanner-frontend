import Module from './Module';

export default interface Profile {
    id: string;
    name: string;
    modules: Module[];
    minima: number;
}

export interface ProfileDto extends Omit<Profile, 'modules'>{
    modules: string[];
}