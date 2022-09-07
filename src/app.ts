import express, { RequestHandler, ErrorRequestHandler } from "express";
import createError from "http-errors";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import http from "http";
import nunjucks from "nunjucks";
import cookieSession from "cookie-session";

import indexRouter from "./routes/index";

const app: express.Application = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Use cookie-session to store session in a client side cookie
app.use(
  cookieSession({
    name: "session",
    // These keys are required by cookie-session to sign the cookies.
    keys: [
      "Required, but value not relevant for this demo - key1",
      "Required, but value not relevant for this demo - key2",
    ],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

app.use("/", indexRouter);

nunjucks.configure(["dist/views", "node_modules/govuk-frontend/"], {
  autoescape: true,
  express: app,
});
app.set("view engine", "njk");

app.use(
  "/assets",
  express.static(
    path.join(__dirname, "/node_modules/govuk-frontend/govuk/assets")
  )
);

// Set up server

// catch 404 and forward to error handler
const notFoundHandler: RequestHandler = (req, res, next) => {
  next(createError(404));
};
app.use(notFoundHandler);

// error handler
const errorHandler: ErrorRequestHandler = (err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
};
app.use(errorHandler);

const port = process.env.PORT || "3000";
app.set("port", port);

const server = http.createServer(app);
server.listen(port);
