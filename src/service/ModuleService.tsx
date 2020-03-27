import * as React from 'react';
import * as uuid from 'uuid';
import Module from '../model/Module';

export default class ModuleService {

    public static readonly INSTANCE = new ModuleService();

    private readonly modules: Module[] = [];

    private constructor() {
        let randomCode = () => {
            let length = Math.floor(Math.random() * 3) + 3;
            let code = '';
            for (let i = 0; i < length; ++i) {
                code += String.fromCharCode(Math.floor(Math.random() * 26) + 65);
            }
            return code;
        };
        let randomModuleFor = (module: Module) => {
            let random: null | Module = null;
            while (random === null) {
                const m = this.modules[Math.floor(Math.random() * this.modules.length)];
                if (m !== module || !module.requirements.find(s => s.id === m?.id)) {
                    random = m;
                }
            }
            return random;
        };
        for(let i = 0; i < 1000; ++i) {
            let credits = 3;
            let cRandom = Math.random();
            if (cRandom > 0.5 && cRandom < 0.8) {
                credits = 2;
            } else if (cRandom >= 0.8 && cRandom < 0.95) {
                credits = 6;
            } else  if (cRandom >= 0.95) {
                credits = 12;
            }
            let hs = Math.random() >= 0.5;
            let fs = Math.random() >= 0.5;
            this.modules.push({
                id: uuid.v4(),
                code: randomCode(),
                description: 'module description',
                credits,
                hs,
                fs,
                requirements: [],
            });
        }
        this.modules.forEach(m => {
            let depCount = Math.floor(Math.random() * 6);
            for(let i = 0; i < depCount; ++i) {
                m.requirements.push(randomModuleFor(m));
            }
        })
    }

    /**
     * @deprecated Will not be usable in the final version, only for testing
     */
    public getModules(): Module[] {
        return this.modules;
    }

    public list(): Promise<Module[]> {
        return Promise.resolve().then(_ => this.modules);
    }

    public find(id: string) {
        return Promise.resolve(this.modules.find(s => s.id === id));
    }
}

// https://medium.com/@thehappybug/using-react-context-in-a-typescript-app-c4ef7504c858

const {Provider, Consumer} = React.createContext(ModuleService.INSTANCE);

export interface ModuleServiceProps {
    moduleService: ModuleService;
}

export const withModuleService = <
    P extends ModuleServiceProps
    >(Component: React.ComponentType<P>): React.FC<Omit<P, keyof ModuleServiceProps>> => {
    return props => (
        <Consumer>
            {value => <Component {...props as P} moduleService={value}/>}
        </Consumer>
    );
};

export const ModuleServiceProvider : React.FC<ModuleServiceProps> = props => (
    <Provider value={props.moduleService}>{props.children}</Provider>
);