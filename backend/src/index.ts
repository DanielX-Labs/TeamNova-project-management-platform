import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import { config } from "./config/app.config";
import connectDatabase from "./config/database.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { HTTPSTATUS } from "./config/http.config";

import "./config/passport.config";
import passport from "passport";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import isAuthenticated from "./middlewares/isAuthenticated.middleware";
import workspaceRoutes from "./routes/workspace.route";
import memberRoutes from "./routes/member.route";
import projectRoutes from "./routes/project.route";
import taskRoutes from "./routes/task.route";
import { ensureRoles } from "./services/role.service";
import { logger } from "./utils/logger";

const app = express();
const BASE_PATH = config.BASE_PATH;
const isProduction = config.NODE_ENV === "production";
const allowedOrigins = config.FRONTEND_ORIGIN.split(",").map((origin) =>
  origin.trim()
);
const durationUnits: Record<string, number> = {
  s: 1_000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
};
const durationMatch = config.SESSION_EXPIRES_IN.match(/^(\d+)([smhd])$/i);
const sessionMaxAge = durationMatch
  ? Number(durationMatch[1]) * durationUnits[durationMatch[2].toLowerCase()]
  : 86_400_000;

app.set("trust proxy", 1);

app.use((req: Request, res: Response, next: NextFunction) => {
  if (!req.originalUrl.startsWith(BASE_PATH)) {
    return next();
  }

  const startedAt = performance.now();
  res.on("finish", () => {
    const duration = Math.round(performance.now() - startedAt);
    logger.api(req.method, req.path, res.statusCode, duration);
  });

  next();
});

app.use(express.json({ limit: "2mb" }));

app.use(express.urlencoded({ extended: true, limit: "2mb" }));

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true,
  })
);

app.get("/health", (_req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;
  res.status(databaseReady ? HTTPSTATUS.OK : HTTPSTATUS.SERVICE_UNAVAILABLE).json({
    status: databaseReady ? "ok" : "unavailable",
    database: databaseReady ? "connected" : "disconnected",
  });
});

app.use(
  session({
    name: "session",
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: isProduction,
    store: MongoStore.create({
      mongoUrl: config.MONGO_URI,
      collectionName: "sessions",
      ttl: Math.ceil(sessionMaxAge / 1_000),
      autoRemove: "native",
    }),
    cookie: {
      maxAge: sessionMaxAge,
      secure: isProduction,
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get(`/`, (_req, res) => {
  res.status(HTTPSTATUS.OK).json({ message: "TeamNova API" });
});

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, isAuthenticated, userRoutes);
app.use(`${BASE_PATH}/workspace`, isAuthenticated, workspaceRoutes);
app.use(`${BASE_PATH}/member`, isAuthenticated, memberRoutes);
app.use(`${BASE_PATH}/project`, isAuthenticated, projectRoutes);
app.use(`${BASE_PATH}/task`, isAuthenticated, taskRoutes);

app.use((req, res) => {
  res.status(HTTPSTATUS.NOT_FOUND).json({
    message: `Route ${req.method} ${req.path} was not found`,
  });
});

app.use(errorHandler);

const startServer = async () => {
  await connectDatabase();
  await ensureRoles();
  logger.info("Roles are ready");

  const server = app.listen(Number(config.PORT), "0.0.0.0", () => {
    logger.info(
      `Server listening on port ${config.PORT} in ${config.NODE_ENV}`
    );
  });

  const shutdown = (signal: string) => {
    logger.info(`${signal} received; shutting down gracefully`);
    server.close(() => {
      void mongoose.connection.close().finally(() => process.exit(0));
    });
  };

  process.once("SIGTERM", () => shutdown("SIGTERM"));
  process.once("SIGINT", () => shutdown("SIGINT"));
};

void startServer().catch((error) => {
  const message = error instanceof Error ? error.message : "Unknown error";
  console.error(`Failed to start server: ${message}`);
  process.exitCode = 1;
});
