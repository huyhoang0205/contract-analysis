import { Document, model, Schema } from "mongoose";

const DOCUMENT_NAME = "Users";
const COLLECTION_NAME = "users";
export interface IUser extends Document {
  googleId: string;
  email: string;
  displayName: string;
  profilePicture: string;
  isPremium: boolean;
}

const UserSchema: Schema = new Schema(
  {
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    profilePicture: { type: String },
    isPremium: { type: Boolean, default: false },
  },
  {
    collection: COLLECTION_NAME,
    timestamp: true,
  },
);

export default model<IUser>(DOCUMENT_NAME, UserSchema);
