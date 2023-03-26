import { User } from '../../../db/db';

const { namesSchema } = require('../../../common/validators');

export class Controller {
  async all(req, res) {
    try {
      const users = await User.findAll({
        attributes: ['email', 'firstName', 'lastName'],
      });

      return res.status(200).json({
        users,
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Error retrieving users',
      });
    }
  }

  async update(req, res) {
    const validatedNames = namesSchema.validate(req.body);
    if (validatedNames.error) {
      return res.status(400).json({ error: validatedNames.error });
    }

    const emailToUpdate = req.user.username;
    try {
      await User.update(
        { ...validatedNames.value },
        {
          where: {
            email: emailToUpdate,
          },
        }
      );
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update user' });
    }

    return res.status(200).end();
  }
}

export default new Controller();
