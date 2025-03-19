import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
  orgLink: String,
  shortLink: String,
});

export const dataLink = mongoose.models.linkModel || mongoose.model("linkModel", linkSchema);