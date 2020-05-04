import Student, { StudentDto } from '../model/Student';
import * as React from 'react';
import HttpClient from './HttpClient';
import DegreeService from './DegreeService';

export default class StudentService {

    public static readonly INSTANCE = new StudentService();

    private restClient = new HttpClient('students');

    private constructor() {}

    /**
     * Fetches a single user by id
     * @param id
     */
    public findById(id: string): Promise<Student> {
        return this.restClient.getOne<StudentDto>(id).then(this.convertDto);
    }

    /**
     * Creates (Registeres) a new student
     * Returns a StudentDto since this fits better into our concept
     * @param student
     */
    public create(student: StudentDto): Promise<StudentDto> {
        return this.restClient.post<StudentDto>(student);
    }

    /**
     * Updates the student with the given id
     * This will NOT log out the current authenticated student
     * @param id
     * @param student
     */
    public update(id: string, student: StudentDto): Promise<Student> {
        return this.restClient.put<StudentDto>(id, student).then(this.convertDto);
    }

    /**
     * Deletes the student from the backend
     * This will NOT log out the current authenticated student
     * @param id
     */
    public delete(id: string): Promise<void> {
        return this.restClient.delete(id);
    }

    /**
     * Converts a dto to a model object
     * @param dto
     */
    public async convertDto(dto: StudentDto): Promise<Student> {
        return {
            ...dto,
            degree: await DegreeService.INSTANCE.findById(dto.degree)
        };
    }

    /**
     * Converts a model to a dto
     * @param model
     */
    public convertModel(model: Student): StudentDto {
        return {
            ...model,
            degree: model.degree.id
        };
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