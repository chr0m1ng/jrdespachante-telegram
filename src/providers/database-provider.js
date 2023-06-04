import { MongoClient, ServerApiVersion } from 'mongodb';
import TimeHelpers from '../helpers/time-helpers.js';
import config from '../app-settings.js';

const MAX_CONNECTION_RETRIES = 10;
const RETRY_DELAY = 1000;

class DatabaseProvider {
    constructor() {
        this.connection_retries = 0;
    }

    _setupDatabaseAsync = async () => {
        if (this.connection_retries > MAX_CONNECTION_RETRIES) {
            throw new Error('Database max connection retries');
        }
        const client = new MongoClient(
            config.database.mongo.connection_string,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverApi: ServerApiVersion.v1
            }
        );
        this.client = client;
        try {
            await client.connect();
            this.database = client.db(config.database.mongo.database);
        } catch (err) {
            await TimeHelpers.delayAsync(RETRY_DELAY);
            this.connection_retries += 1;
            await this._setupDatabaseAsync();
        }
    };

    getDatabaseAsync = async () => {
        if (!this.database) {
            await this._setupDatabaseAsync();
        }
        return this.database;
    };

    closeDatabaseAsync = async () => {
        await this.client.close();
    };
}

export default DatabaseProvider;
