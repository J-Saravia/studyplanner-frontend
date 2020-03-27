import { AuthServiceProps, withAuthService } from './AuthService';
import { StudentServiceProps, withStudentService } from './StudentService';
import { ModuleServiceProps, withModuleService } from './ModuleService';
import { ModuleVisitServiceProps, withModuleVisitService } from './ModuleVisitService';
import * as React from 'react';

export interface WithServicesProps extends AuthServiceProps, StudentServiceProps, ModuleServiceProps, ModuleVisitServiceProps {}

const withServices = <
    P extends Omit<P, keyof WithServicesProps>
    >(Component: React.ComponentType<WithServicesProps>): React.FC<P> =>
    withAuthService(withStudentService(withModuleService(withModuleVisitService(Component))));

export default withServices;