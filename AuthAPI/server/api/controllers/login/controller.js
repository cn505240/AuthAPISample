import { generatePasswordHash } from '../../../common/utils';
import { User } from '../../../db/db';
import { generateAccessToken } from '../../middleware/auth';

const { loginSchema } = require('../../../common/validators');

export class Controller {
  async login(req, res) {
    const validatedLogin = loginSchema.validate(req.body);

    if (validatedLogin.error) {
      return res.status(400).json({ error: validatedLogin.error });
    }

    const loginCreds = validatedLogin.value;
    const passwordHash = await generatePasswordHash(loginCreds.password);

    const user = await User.findOne({
      where: {
        email: loginCreds.email,
        passwordHash,
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const token = generateAccessToken(user.email);
    return res.status(200).json({ token });
  }
}

export default new Controller();
