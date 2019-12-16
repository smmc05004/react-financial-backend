import jwt from 'jsonwebtoken';

const jwtMiddleware = (ctx, next) => {
  const token = ctx.cookies.get('access_token');
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ctx.state.user = {
      _id: decoded._id,
      userName: decoded.userName,
      userId: decoded.userId,
    };
    console.log('미들웨어 디코드 결과: ', decoded);
    return next();
  } catch (e) {
    return next();
  }
};

export default jwtMiddleware;
