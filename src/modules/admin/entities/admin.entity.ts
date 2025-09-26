import { TRoleTypes } from '@contract/constants';

export class AdminEntity {
    public uuid: string;
    public username: string;
    public passwordHash: string;
    public role: TRoleTypes;
    public isInitialPasswordChanged: boolean;
    
    public createdAt: Date;
    public updatedAt: Date;
    
    constructor(admin: Partial<AdminEntity>) {
        Object.assign(this, admin);
        return this;
    }
}