import Degree from './Degree';

export default interface Student {
    id?: string;
    email: string; // minLength = 6; maxLength = 320
    password?: string;
    semester: string;
    degree: Degree;
}

export interface StudentDto extends Omit<Student, 'degree'> {
    degree: string;
}