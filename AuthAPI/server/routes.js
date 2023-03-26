import usersRouter from './api/controllers/users/router';
import signupRouter from './api/controllers/signup/router';
import loginRouter from './api/controllers/login/router';
import { authenticateRequest } from './api/middleware/auth';

export default function routes(app) {
  app.use('/users', authenticateRequest, usersRouter);
  app.use('/signup', signupRouter);
  app.use('/login', loginRouter);
}
