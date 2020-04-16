import * as React from 'react';
import * as Rx from 'rxjs';
import Credentials from '../model/Credentials';
import AuthResponse from '../model/AuthResponse';
import Token from '../model/Token';
import StudentService from './StudentService';
import Student from '../model/Student';
import HttpClient from './HttpClient';

/**
 * This services handles all things related to authentication
 */
export default class AuthService {

    public static readonly INSTANCE = new AuthService();

    private restClient = new HttpClient('auth');

    private token?: Token;
    private refreshToken?: Token;
    private studentSubject = new Rx.Subject<Student>();
    private authStateSubject = new Rx.Subject<boolean>();
    private currentStudent?: Student;

    private constructor() {
    }


    /**
     * Returns true if there is a token set and said token is still valid.
     */
    public isLoggedIn(): boolean {
        return !!this.token && this.token.isValid();
    }

    /**
     * Returns the current student if logged in
     */
    public getCurrentStudent(): Student | undefined {
        return this.currentStudent;
    }

    /**
     * This function tries to load the token from the localStorage and checks if it is still valid.
     * If the token is valid, it will load the current Student object from the backend and return it.
     * If the token is invalid or absent, the function will try to retrieve a new token using the refresh token if available and then returns the current Student object.
     * If all this fails, the function will just return undefined, thus indicating a failed auth from cache.
     * This function will notify all listeners of studentSubject, if and when the login was successful.
     */
    public async tryAuthFromCache(): Promise<Student | undefined> {
        if (!this.isLoggedIn()) {
            const tokenString = localStorage.getItem('tokenString');
            const refreshTokenString = localStorage.getItem('refreshTokenString');
            // We can just skip this if no refresh token is present
            if (refreshTokenString) {
                const refreshToken = new Token(refreshTokenString);
                if (tokenString) {
                    const token = new Token(tokenString);
                    try {
                        if (token.isValid()) {
                            this.token = token;
                            this.refreshToken = refreshToken;
                            const student = await StudentService.INSTANCE.findById(token.sub);
                            this.studentSubject.next(this.currentStudent = student);
                            this.authStateSubject.next(true);
                            return student;
                        }
                    } catch (ignored) {
                        // token seems to be valid, the request for the student failed however.
                        // We will just try to refresh the token if possible
                    }
                }
                if (refreshToken.isValid()) {
                    this.refreshToken = refreshToken;
                    try {
                        await this.refresh();
                        return this.currentStudent;
                    } catch (ignored) {
                        // Refresh failed, logout and remove local auth data
                        this.logout();
                    }
                }
            }
            return undefined;
        } else {
            return this.currentStudent;
        }
    }

    /**
     * Adds a listener for changes to the current Student object
     * @param observer
     */
    public addStudentListener(observer: (value: Student) => void): Rx.Subscription {
        return this.studentSubject.subscribe(observer);
    }

    /**
     * Adds a listener for changes to the current auth state
     * @param observer
     */
    public addAuthStateListener(observer: (value: boolean) => void): Rx.Subscription {
        return this.authStateSubject.subscribe(observer);
    }

    public requestPasswordReset(mail: string): Promise<void> {
        return this.restClient
            .request('post')
            .url('forgot')
            .query({mail})
            .noAuthHeader()
            .fetch();
    }

    public resetPassword(email: string, forgotToken: string, password: string): Promise<void>  {
        return this.restClient
            .request('POST')
            .body({ email, forgotToken, password })
            .url('reset')
            .noAuthHeader()
            .fetch();
    }

    /**
     * Tries to authenticate with the given credentials.
     * This function will notify all listeners of studentSubject, if and when the login was successful.
     * @param credentials
     */
    public async login(credentials: Credentials): Promise<AuthResponse> {
        const authResponse = await this.restClient
            .request('POST')
            .url('login')
            .body(credentials)
            .noAuthHeader()
            .fetch<AuthResponse>();
        this.handleAuthResponse(authResponse);
        return authResponse;
    }

    /**
     * Creates an authorization header based on the current token.
     * This function will try to refresh the current token if it is no longer valid.
     * This function will notify all listeners of studentSubject, if and when the login was successful.
     */
    public async createAuthorizationHeader(): Promise<HeadersInit | undefined> {
        try {
            let isRefreshRequired = !this.token?.isValid() && this.refreshToken?.isValid();
            if (isRefreshRequired) {
                await this.refresh();
            }
            if (!this.isLoggedIn()) {
                this.logout();
                return undefined;
            }
            return { 'Authorization': `Bearer ${this.token?.tokenString}` };
        } catch (e) {
            this.logout();
            throw e;
        }
    }

    private async refresh(): Promise<AuthResponse> {
        const authResponse = await this.restClient
            .request('POST')
            .url('refresh')
            .body({ refreshToken: this.refreshToken?.tokenString })
            .noAuthHeader()
            .fetch<AuthResponse>();
        this.handleAuthResponse(authResponse);
        return authResponse;
    }

    private async handleAuthResponse(response: AuthResponse) {
        try {
            this.token = new Token(response.token);
            this.refreshToken = new Token(response.refreshToken);
            const student = await StudentService.INSTANCE.findById(this.token.sub);
            this.studentSubject.next(this.currentStudent = student);

            localStorage.setItem('tokenString', response.token);
            localStorage.setItem('refreshTokenString', response.refreshToken);
            this.authStateSubject.next(true);
        } catch (e) {
            console.error('An error occurred while trying to handle an auth response.', e);
            this.logout();
        }
    }

    /**
     * Removes the token and refreshToken from the localStorage and clears auth related variables.
     * This will cause a notification of all listeners to studentSubject to be notified with undefined.
     */
    public logout() {
        localStorage.removeItem('tokenString');
        localStorage.removeItem('refreshTokenString');
        this.token = undefined;
        this.refreshToken = undefined;
        this.studentSubject.next(this.currentStudent = undefined);
        this.authStateSubject.next(false);
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