import Student from '../model/Student';
import * as React from 'react';
import * as uuid from 'uuid';

export default class StudentService {

    public static readonly INSTANCE = new StudentService();

    private readonly students: Student[] = [];
    private names = ['Jan', 'Peter', 'Hans', 'Ives', 'Mario', 'Marina', 'Phine', 'Kim', 'Gina', 'Elisabeth', 'Li', 'Timothy'];
    private surnames = ['Müller', 'Meier', 'Hauser', 'Spengler', 'Smith', 'Ali' ,'Metzger', 'Schweizer'];
    private mailEndings = ['bluewin.ch', 'gmail.com', 'gmx.net', 'hotmail.com', 'fhnw.ch', 'students.fhnw.ch'];

    private constructor() {
        this.create({
            email: `caligos@trivetia.org`,
            degree: 'Computer Science', // will be id
            password: 'nhlarcm8z',
            semester: '2017'
        });
        const random = (b: number) => Math.floor(Math.random() * b);
        for(let i = 0; i < 10; ++i) {
            const name = this.names[random(this.names.length)];
            const surname = this.surnames[random(this.surnames.length)];
            const mailEnding = this.mailEndings[random(this.mailEndings.length)];
            const email = `${name}.${surname}@${mailEnding}`.toLowerCase();
            const semester = `${2020 - (1 + Math.random() * 5)}`;
            const degree = 'Computer Science';  // will be id
            const password = 'Passw0rd1234';
            this.create({email, semester, degree, password});
        }
        console.log(this.students);
    }

    /**
     * @deprecated Will not be usable in the final version, only for testing
     */
    public list() {
        return this.students;
    }

    public find(id: string) {
        return Promise.resolve(this.students.find(s => s.id === id));
    }

    public create(student: Student) {
        student.id = uuid.v4();
        this.students.push(student);
        return Promise.resolve(student);
    }

    public update(id: string, student: Student) {
        let index = this.students.findIndex(s => s.id === id);
        if (index === -1) return Promise.reject("Not found");
        student.id = id;
        this.students.splice(index, 1, student);
        return Promise.resolve(student);
    }

    public delete(id: string) {
        let index = this.students.findIndex(s => s.id === id);
        if (index === -1) return Promise.reject("Not found");
        this.students.splice(index, 1);
        return Promise.resolve();
    }

}

// https://medium.com/@thehappybug/using-react-context-in-a-typescript-app-c4ef7504c858

const {Provider, Consumer} = React.createContext(StudentService.INSTANCE);

export interface StudentServiceProps {
    studentService: StudentService;
}

export const withStudentService = <
    P extends StudentServiceProps
    >(Component: React.ComponentType<P>): React.FC<Omit<P, keyof StudentServiceProps>> =>
    props => (
        <Consumer>
            {value => <Component {...props as P} studentService={value}/>}
        </Consumer>
    );

export const StudentServiceProvider : React.FC<StudentServiceProps> = props => (
    <Provider value={props.studentService}>{props.children}</Provider>
);