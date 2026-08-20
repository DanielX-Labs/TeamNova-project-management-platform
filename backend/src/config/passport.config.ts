import passport from "passport";
import { Request } from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";

import { config } from "./app.config";
import { NotFoundException } from "../utils/appError";
import { ProviderEnum } from "../enums/account-provider.enum";
import {
  loginOrCreateAccountService,
  verifyUserService,
} from "../services/auth.service";
import UserModel from "../models/user.model";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
      passReqToCallback: true,
    },
    async (req: Request, accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id || profile._json.sub;
        const email = profile.emails?.[0]?.value || profile._json.email;
        const picture = profile.photos?.[0]?.value || profile._json.picture;
        const state = typeof req.query.state === "string" ? req.query.state : "";
        const inviteCode = state.match(
          /^\/invite\/workspace\/([a-zA-Z0-9]{8})\/join$/
        )?.[1];
        if (!googleId) {
          throw new NotFoundException("Google ID (sub) is missing");
        }

        const { user } = await loginOrCreateAccountService({
          provider: ProviderEnum.GOOGLE,
          displayName: profile.displayName,
          providerId: googleId,
          picture: picture,
          email: email,
          inviteCode,
        });
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: true,
    },
    async (email, password, done) => {
      try {
        const user = await verifyUserService({ email, password });
        return done(null, user);
      } catch (error: any) {
        return done(error, false, { message: error?.message });
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user._id.toString()));

passport.deserializeUser(async (userId: string, done) => {
  try {
    const user = await UserModel.findById(userId);
    done(null, user || false);
  } catch (error) {
    done(error);
  }
});
