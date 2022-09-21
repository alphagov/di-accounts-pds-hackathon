import express, { RequestHandler, ErrorRequestHandler } from "express";
import createError from "http-errors";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import http from "http";
import cookieSession from "cookie-session";
import i18next from "i18next";
import i18nextMiddleware from "i18next-http-middleware";
import Backend from "i18next-fs-backend";
import nunjucks, { Environment } from "nunjucks";

import { getPort, getSessionKeys } from "./config";

import indexRouter from "./routes/index";
import accountRouter from "./routes/account";
import emailsRouter from "./routes/emails";
import vouchRouter from "./routes/vouch";
import loginRouter from "./routes/login";

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
    keys: getSessionKeys(),
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

// ============================
// Mount Routefiles for the App
// ============================

app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/account", accountRouter);
app.use("/vouch", vouchRouter);
app.use("/emails", emailsRouter);

// ============================
// Configure Localisation
// ============================
i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    debug: true,
    fallbackLng: "en",
    // lng: "en",
    preload: ["en", "cy"],
    supportedLngs: ["en", "cy"],
    backend: {
      loadPath: path.join(__dirname, "locales/{{lng}}/{{ns}}.json"),
    },
    detection: {
      lookupCookie: "lng",
      lookupQuerystring: "lng",
      order: ["querystring", "header", "cookie"],
      caches: ["cookie"],
      ignoreCase: true,
      cookieSecure: true,
    },
  });

app.use(i18nextMiddleware.handle(i18next));

function configureNunjucks(expressApp: express.Application): Environment {
  const nunjucksEnv: nunjucks.Environment = nunjucks.configure(
    ["dist/views", "node_modules/govuk-frontend/"],
    {
      autoescape: true,
      express: expressApp,
    }
  );
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  nunjucksEnv.addFilter("translate", (key: string, options?: any) => {
    const translate = i18next.getFixedT("en");
    return translate(key, options);
  });

  return nunjucksEnv;
}

// ============================
// Configure Nunjucks
// ============================

configureNunjucks(app);
app.set("view engine", "njk");

// ============================
// Configure Assets
// ============================

app.use(
  "/assets",
  express.static(path.resolve("node_modules/govuk-frontend/govuk/assets"))
);

// ============================
// Set up 404
// ============================

const notFoundHandler: RequestHandler = (req, res, next) => {
  next(createError(404));
};
app.use(notFoundHandler);

// ============================
// Set up Error Handler
// ============================
const errorHandler: ErrorRequestHandler = (err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
};
app.use(errorHandler);

// ============================
// Ports
// ============================

const port = getPort();
app.set("port", port);

const server = http.createServer(app);
server.listen(port);
