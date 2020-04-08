import Student from '../model/Student';
import * as React from 'react';
import HttpClient from './HttpClient';

export default class StudentService {

    public static readonly INSTANCE = new StudentService();

    private restClient = new HttpClient('students');

    private constructor() {}

    public findById(id: string): Promise<Student> {
        return this.restClient.getOne(id);
    }

    public create(student: Student): Promise<Student> {
        return this.restClient.post(student);
    }

    public update(id: string, student: Student): Promise<Student> {
        return this.restClient.put(id, student);
    }

    public delete(id: string) {
        return this.restClient.delete(id);
    }

}

// https://medium.com/@thehappybug/using-react-context-in-a-typescript-app-c4ef7504c858

const { Provider, Consumer } = React.createContext(StudentService.INSTANCE);

export interface StudentServiceProps {
    studentService: StudentService;
}

export const withStudentService = <P extends StudentServiceProps>(Component: React.ComponentType<P>): React.FC<Omit<P, keyof StudentServiceProps>> =>
    props => (
        <Consumer>
            {value => <Component {...props as P} studentService={value}/>}
        </Consumer>
    );

export const StudentServiceProvider: React.FC<StudentServiceProps> = props => (
    <Provider value={props.studentService}>{props.children}</Provider>
);