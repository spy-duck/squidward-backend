declare global {
    declare const process: {
        env: {
            POSTGRES_DB: string;
            POSTGRES_HOST: string;
            POSTGRES_PASSWORD: string;
            POSTGRES_PORT: string;
            POSTGRES_USER: string;
        }
    }
}