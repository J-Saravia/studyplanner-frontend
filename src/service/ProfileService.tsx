import * as React from 'react';
import HttpClient from './HttpClient';
import Profile, { ProfileDto } from '../model/Profile';
import CacheableService from './CacheableService';
import ModuleService from './ModuleService';
import AuthService from './AuthService';
import Student from '../model/Student';

export default class ProfileService extends CacheableService<Profile> {
    public static readonly INSTANCE = new ProfileService();

    private restClient = new HttpClient('profiles');

    private constructor() {
        super();
    }

    protected async loadData(): Promise<Profile[]> {
        const dtos = await this.restClient.getList<ProfileDto>();
        return ProfileService.convertToModel(dtos);
    }

    public async getForStudentDegree(): Promise<Profile[]> {
        const authService = AuthService.INSTANCE;
        if (!await authService.tryEnsureLoggedIn()) {
            throw new Error('Unauthorized');
        }
        const student = authService.getCurrentStudent() as Student;
        const dtos = await this.restClient
            .request()
            .query({ degree: student.degree.id })
            .fetch<ProfileDto[]>();
        return ProfileService.convertToModel(dtos);
    }

    private static async convertToModel(
        dtos: ProfileDto[]
    ): Promise<Profile[]> {
        let data = [];
        for (const dto of dtos) {
            const modules = [];
            for (const id of dto.modules) {
                modules.push(await ModuleService.INSTANCE.findById(id));
            }
            data.push({
                ...dto,
                modules,
            });
        }
        return data;
    }
}

// https://medium.com/@thehappybug/using-react-context-in-a-typescript-app-c4ef7504c858

const { Provider, Consumer } = React.createContext(ProfileService.INSTANCE);

export interface ProfileServiceProps {
    profileService: ProfileService;
}

export const withProfileService = <P extends ProfileServiceProps>(
    Component: React.ComponentType<P>
): React.FC<Omit<P, keyof ProfileServiceProps>> => (props) => (
    <Consumer>
        {(value) => <Component {...(props as P)} profileService={value} />}
    </Consumer>
);

export const ProfileServiceProvider: React.FC<ProfileServiceProps> = (
    props
) => <Provider value={props.profileService}>{props.children}</Provider>;
