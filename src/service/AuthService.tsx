import * as React from 'react';
import * as Rx from 'rxjs';
import Credentials from '../model/Credentials';
import AuthResponse from '../model/AuthResponse';
import Token from '../model/Token';
import StudentService from './StudentService';
import Student from '../model/Student';

export default class AuthService {

    public static readonly INSTANCE = new AuthService();

    private token?: Token;
    private refreshToken?: Token;
    private studentSubject = new Rx.Subject<Student>();
    private currentStudent?: Student;

    private constructor() {
        this.currentStudent = StudentService.INSTANCE.list()[0];
    }

    public isLoggedIn() {
        return !!this.token;
    }

    public getCurrentStudent() {
        return this.currentStudent;
    }

    public addStudentListener(observer: (value: Student) => void): Rx.Subscription {
        return this.studentSubject.subscribe(observer);
    }

    public async login(credentials: Credentials): Promise<AuthResponse> {
        const student = StudentService.INSTANCE
            .list()
            .find(s => s.email.toLowerCase() === credentials.email.toLowerCase()
                && s.password === credentials.password);
        if (!student) {
            return Promise.reject('invalid credentials');
        }
        const response = await Promise.resolve({ token: '', refreshToken: '' }); // TODO: Add actual implementation once backend is available
        this.studentSubject.next(this.currentStudent = student);
        return response;
    }

    public async createAuthorizationHeader() {
        // TODO: create header from token and refresh if needed
        let expired = false;
        if (expired) {
            await this.refresh();
        }
        return { 'Authorization': `Bearer ${this.token?.tokenString}` };
    }

    public refresh(): Promise<AuthResponse> {
        return Promise.resolve({ token: '', refreshToken: '' }); // TODO: send refresh token to server and update local values accordingly
    }

    public logout() {
        // TODO: delete token from browser storage and clear variables
        this.studentSubject.next(this.currentStudent = undefined);
    }

    public test() {
        return 'TEST';
    }
}

// https://medium.com/@thehappybug/using-react-context-in-a-typescript-app-c4ef7504c858

const { Provider, Consumer } = React.createContext(AuthService.INSTANCE);

export interface AuthServiceProps {
    authService: AuthService;
}

export const withAuthService = <P extends AuthServiceProps>(Component: React.ComponentType<P>): React.FC<Omit<P, keyof AuthServiceProps>> =>
    props => (
        <Consumer>
            {value => <Component {...props as P} authService={value}/>}
        </Consumer>
    );

export interface AuthProviderProps {
    authService?: AuthService;
}

export const AuthProvider = Provider;