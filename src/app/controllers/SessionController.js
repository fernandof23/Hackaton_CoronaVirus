import * as Yup from 'yup';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import auth from '../../config/auth';

export default {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    try {
      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validation Fails' });
      }

      const { email, password } = req.body;

      const user = await User.findOne({
        where: { email },
      });

      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      if (!(await user.checkPassword(password))) {
        return res.status(401).json({ error: 'Password is not Correct' });
      }

      const { id, name, city, uf, age } = user;

      return res.json({
        user: {
          id,
          name,
          city,
          uf,
          age,
        },
        token: jwt.sign({ id }, auth.secret, { expiresIn: auth.expireIn }),
      });
    } catch (err) {
      return res.status(500).json({ error: ' Login Failured' });
    }
  },
};
