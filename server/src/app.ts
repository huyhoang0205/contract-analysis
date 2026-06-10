import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import session from "express-session";

import mongoose from "mongoose";
import passport from "passport";
import "./config/passport";
import MongoStore from "connect-mongo";

// import routes
import authRoute from "./routes/auth";
import contractRoute from "./routes/contract";

const app = express();

// db
mongoose
  .connect(process.env.MONGO_URL!)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB", err));

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL! }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1day
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoute);
app.use("/contract", contractRoute);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
