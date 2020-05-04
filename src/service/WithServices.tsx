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

const withServices = <P extends WithServicesProps>(Component: React.ComponentType<P>): React.FC<Omit<P, keyof WithServicesProps>> =>
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
    ) as React.FC<Omit<P, keyof WithServicesProps>>;

export default withServices;