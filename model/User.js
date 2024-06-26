const mongoose = require("mongoose");
const express = require("express");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: Buffer, required: true },
    role: { type: String, required: true, default: "user" },
    addresses: { type: [Schema.Types.Mixed] },
    // for addresses, we can make a separate Schema like orders. but in this case we are fine
    name: { type: String },
    salt: Buffer,
    resetPasswordToken: { type: String, default: "" },
  },
  { timestamps: true }
);
const virtual = userSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, res) {
    delete res._id;
  },
});

module.exports = mongoose.model("User", userSchema);
