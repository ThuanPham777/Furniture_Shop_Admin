const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const adminSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    avatarUrl: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    phoneNumber: { type: String },
    address: { type: String },
    province: { type: String },
    city: { type: String },
    country: { type: String },
    birthday: { type: Date },
  },
  {
    timestamps: true,
  }
);

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.passwordConfirm = undefined; // Không lưu trường này
  next();
});

module.exports = mongoose.model('Admin', adminSchema);
