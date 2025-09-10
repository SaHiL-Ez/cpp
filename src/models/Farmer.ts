import mongoose, { Schema, models, model } from "mongoose";

const FarmerSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  location: { type: String, required: true },
});

export default models.Farmer || model("Farmer", FarmerSchema);