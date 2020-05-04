import jwt_decode from 'jwt-decode';

export default class Token {
    public readonly sub: string;
    public readonly iat: number;
    public readonly exp: number;

    constructor(public readonly tokenString: string) {
        const { sub, iat, exp } = jwt_decode(tokenString);
        this.sub = sub;
        this.iat = iat;
        this.exp = exp;
    }

    public isValid() {
        const now = Date.now() / 1000;
        return (this.exp - 10) > now;
    }


}