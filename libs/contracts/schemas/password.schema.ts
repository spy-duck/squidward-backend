import { z } from 'zod';

export const passwordSchema = z.string().trim().superRefine((password, ctx) => {
    if (password.length < 8) {
        ctx.addIssue('Password must be at least 8 characters long');
        return;
    }
    
    // Uppercase letter check
    if (!/[A-Z]/.test(password)) {
        ctx.addIssue('Password must contain at least one uppercase letter');
        return;
    }
    
    // Lowercase letter check
    if (!/[a-z]/.test(password)) {
        ctx.addIssue('Password must contain at least one lowercase letter');
        return;
    }
    
    // Number check
    if (!/[0-9]/.test(password)) {
        ctx.addIssue('Password must contain at least one number');
        return;
    }
    
    // Special character check
    if (!/[!@#$%^&*()_+=\-[\]{};':"\\|,.<>\/?]/.test(password)) {
        ctx.addIssue('Password must contain at least one special character');
    }
});