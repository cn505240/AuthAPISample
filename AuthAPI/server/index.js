import './common/env';
import Server from './common/server';
import routes from './routes';

const server = new Server();

server.router(routes);

server.initDb();

export default server.listen(process.env.PORT);
