import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  userId: String,
  userName: String,
});

const LedgerSchema = new Schema({
  type: String,
  category: String,
  title: String,
  place: String,
  amount: Number,
  date: Date,
  use: String,
  user: UserSchema,
});

const Ledger = mongoose.model('ledger', LedgerSchema);

export default Ledger;
