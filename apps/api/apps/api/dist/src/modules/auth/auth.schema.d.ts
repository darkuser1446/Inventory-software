import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
        name: z.ZodString;
        companyName: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        email: string;
        password: string;
        companyName: string;
    }, {
        name: string;
        email: string;
        password: string;
        companyName: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        email: string;
        password: string;
        companyName: string;
    };
}, {
    body: {
        name: string;
        email: string;
        password: string;
        companyName: string;
    };
}>;
export declare const loginSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
        companySlug: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        email: string;
        password: string;
        companySlug?: string | undefined;
    }, {
        email: string;
        password: string;
        companySlug?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        email: string;
        password: string;
        companySlug?: string | undefined;
    };
}, {
    body: {
        email: string;
        password: string;
        companySlug?: string | undefined;
    };
}>;
export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
//# sourceMappingURL=auth.schema.d.ts.map