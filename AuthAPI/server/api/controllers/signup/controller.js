import { generatePasswordHash } from '../../../common/utils';
import { User } from '../../../db/db';
import { generateAccessToken } from '../../middleware/auth';

const { userSchema } = require('../../../common/validators');

export class Controller {
  async signup(req, res) {
    const validatedUser = userSchema.validate(req.body);

    if (validatedUser.error) {
      return res.status(400).json({ error: validatedUser.error });
    }

    const passwordHash = await generatePasswordHash(
      validatedUser.value.password
    );

    let user, token;
    try {
      user = await User.create({ ...req.body, passwordHash });
    } catch (error) {
      return res.status(500).json({ error: 'Error creating user' });
    }

    try {
      token = generateAccessToken(user.username);
    } catch (error) {
      // failed to generate token - clean up the user
      await user.destroy();

      return res.status(500).json({ error: 'Error generating access token' });
    }

    return res.status(200).json({ token });
  }
}

export default new Controller();
