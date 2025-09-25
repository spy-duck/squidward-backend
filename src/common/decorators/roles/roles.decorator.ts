import { SetMetadata } from '@nestjs/common';

import { ROLE, TRoleTypes } from '@contract/constants';

export const Roles = (...roles: TRoleTypes[]) => SetMetadata(ROLE, roles);