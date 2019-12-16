/* eslint-disable require-atomic-updates */
import Joi from 'joi';
import User from '../../models/user';

export const register = async ctx => {
  const schema = Joi.object().keys({
    userId: Joi.string().required(),
    userName: Joi.string().required(),
    password: Joi.string().required(),
  });

  const result = Joi.validate(ctx.request.body, schema);
  if (result.error) {
    console.error('스키마 값이 유효하지 않음');
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { userName, userId, password } = ctx.request.body;
  try {
    const exists = await User.findByUserId(userId);
    if (exists) {
      console.error('해당 아이디 존재');
      ctx.status = 409;
      return;
    }

    const user = new User({
      userName,
      userId,
    });
    await user.setPassword(password);
    await user.save();

    ctx.body = user.serialize();
    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const login = async ctx => {
  const { userId, password } = ctx.request.body;
  console.log('받아온 parameter: ', userId, password);

  if (!userId || !password) {
    console.error('아이디 혹은 비밀번호 입력 오류');
    ctx.status = 401;
    return;
  }
  try {
    const user = await User.findByUserId(userId);
    if (!user) {
      console.error('해당 아이디 없음');
      ctx.status = 401;
      return;
    }
    const result = await user.checkPassword(password);
    if (!result) {
      console.error('비밀번호 불일치');
      ctx.status = 401;
      return;
    }
    ctx.body = user.serialize();

    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const check = async ctx => {
  console.log('ctx: ', ctx.state);
  const { user } = ctx.state;
  if (!user) {
    console.error('권한 없음');
    ctx.status = 401;
    return;
  }
  ctx.body = user;
};

export const logout = async ctx => {
  console.log('쿠키: ', ctx.cookies);
  ctx.cookies.set('access_token');
  ctx.status = 201;
};
