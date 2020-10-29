const config = require('config');

const dbConfig = config.get('db');

module.exports = {
  type: dbConfig.type,
  host: process.env.DB_HOSTNAME || dbConfig.host,
  port: process.env.DB_PORT || dbConfig.port,
  username: process.env.DB_USERNAME || dbConfig.username,
  password: process.env.DB_PASSWORD || dbConfig.password,
  database: process.env.DB_DB_NAME || dbConfig.database,
  entities: ['dist/**/*.entity{ .ts,.js}'],
  synchronize: process.env.TYPEORM_SYNC || dbConfig.synchronize,
  // logging: true,
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  cli: {
    entitiesDir: __dirname + '/../**/*.entity.{js,ts}',
    migrationsDir: 'src/database/migrations/'
  },
  migrationsTableName: 'migrations_typeorm',
  migrationsRun: true,
}
