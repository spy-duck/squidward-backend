import { SetMetadata } from '@nestjs/common';

export const SKIP_ROLES_GUARD = 'SKIP_ROLES_GUARD';

export const SkipRolesGuard = () => SetMetadata(SKIP_ROLES_GUARD, true);