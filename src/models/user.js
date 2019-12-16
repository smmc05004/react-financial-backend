import mongoose, { Schema } from 'mongoose';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserSchema = new Schema({
  userName: String,
  userId: String,
  hashedPassword: String,
});

UserSchema.methods.setPassword = async function(password) {
  const hashedPw = await bcryptjs.hash(password, 10);
  this.hashedPassword = hashedPw;
};

UserSchema.methods.checkPassword = async function(password) {
  const result = await bcryptjs.compare(password, this.hashedPassword);
  return result;
};

UserSchema.statics.findByUserId = function(userId) {
  return this.findOne({ userId });
};

UserSchema.methods.serialize = function() {
  const data = this.toJSON();
  delete data.hashedPassword;
  return data;
};

UserSchema.methods.generateToken = function() {
  const token = jwt.sign(
    {
      _id: this.id,
      userName: this.userName,
      userId: this.userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d',
    },
  );
  return token;
};
const User = mongoose.model('User', UserSchema);

export default User;
