export default interface Student {
    id?: string;
    email: string; // minLength = 6; maxLength = 320
    password?: string;
    semester: string;
    degree: string;
}