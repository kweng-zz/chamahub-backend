declare const _default: () => {
    port: number;
    database: {
        host: string;
        port: number;
        username: string | undefined;
        password: string | undefined;
        database: string | undefined;
        logging: boolean;
        ssl: boolean;
    };
    clerk: {
        secretKey: string | undefined;
        publishableKey: string | undefined;
    };
    cors: {
        origins: string[];
    };
};
export default _default;
