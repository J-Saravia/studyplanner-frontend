export default interface Module {
    id?: string;
    code: string;
    description: string;
    credits: number;
    hs: boolean;
    fs: boolean;
    requirements: Module[];
}