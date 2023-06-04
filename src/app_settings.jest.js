const app_settings = {
    seq: {
        server_url: null,
        api_key: null
    },
    database: {
        mongo: {
            connection_string: global.__MONGO_URI__,
            database: 'jcw'
        }
    }
};

export default app_settings;
