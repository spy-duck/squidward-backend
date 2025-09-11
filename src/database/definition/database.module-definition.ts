import { ConfigurableModuleBuilder } from '@nestjs/common';


export interface DatabaseOptions {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
}

export const {
    ConfigurableModuleClass: ConfigurableDatabaseModule,
    MODULE_OPTIONS_TOKEN: DATABASE_OPTIONS,
} = new ConfigurableModuleBuilder<DatabaseOptions>()
    .setClassMethodName('forRoot')
    .build();