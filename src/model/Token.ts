import jwt_decode from 'jwt-decode';

export default class Token {
    public sub: string;
    public iat: number;

    constructor(public readonly tokenString: string) {
        const { sub, iat } = jwt_decode(tokenString);
        this.sub = sub;
        this.iat = iat;
    }

    public isValid() {
        return true; // TODO: Add actual check
    }


}