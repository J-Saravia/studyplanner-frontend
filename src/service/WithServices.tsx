import * as React from 'react';
import { AuthServiceProps, withAuthService } from './AuthService';
import { StudentServiceProps, withStudentService } from './StudentService';
import { ModuleServiceProps, withModuleService } from './ModuleService';
import { ModuleVisitServiceProps, withModuleVisitService } from './ModuleVisitService';
import { ModuleGroupServiceProps, withModuleGroupService } from './ModuleGroupService';
import { DegreeServiceProps, withDegreeService } from './DegreeService';
import { ProfileServiceProps, withProfileService } from './ProfileService';

export interface WithServicesProps extends AuthServiceProps,
    StudentServiceProps,
    ModuleServiceProps,
    ModuleVisitServiceProps,
    ModuleGroupServiceProps,
    DegreeServiceProps,
    ProfileServiceProps
{
}

const withServices = <P extends Omit<P, keyof WithServicesProps>>(Component: React.ComponentType<WithServicesProps>): React.FC<P> =>
    withAuthService(
        withStudentService(
            withModuleService(
                withModuleVisitService(
                    withModuleGroupService(
                        withDegreeService(
                            withProfileService(Component)
                        )
                    )
                )
            )
        )
    );

export default withServices;