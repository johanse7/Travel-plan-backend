const express = require("express");
const cors = require('cors')
const passport = require("passport");
const boom = require("@hapi/boom");
const cookieParser = require("cookie-parser");
const axios = require("axios");
const { config } = require("./config");
const app = express();


app.use(cors({
  origin: config.siteUrl,
  credentials: true
}));
// body parser
app.use(express.json());

app.use(cookieParser());

//  Basic strategy
require("./utils/auth/strategies/basic");

// OAuth strategy
require("./utils/auth/strategies/oauth");
//facebook strategy
require("./utils/auth/strategies/facebook");


app.get("/user-arirlineFligth", async function (req, res, next) {
  try {
    const { token } = req.cookies;
    const { userId } = req.query;
    const { data, status } = await axios({
      url: `${config.apiUrl}/api/user-arirlineFligth/?userId=${userId}`,
      headers: { Authorization: `Bearer ${token}` },
      method: "GET",
    });
    if (status !== 200) {
      return next(boom.badImplementation());
    }
    res.status(201).json(data);

  } catch (error) {
    next(error);
  }

});


app.post("/auth/sign-in", async function (req, res, next) {
  passport.authenticate("basic", function (error, data) {
    try {
      if (error || !data) {
        next(boom.unauthorized());
      }

      req.login(data, { session: false }, async function (error) {
        if (error) {
          next(error);
        }

        const { token, ...user } = data;

        res.cookie("token", token, {
          httpOnly: !config.dev,
          secure: !config.dev
        });

        res.status(200).json(user);
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
});

app.post("/auth/sign-up", async function (req, res, next) {
  const { body: user } = req;

  try {
    const { data } = await axios({
      url: `${config.apiUrl}/api/auth/sign-up`,
      method: "post",
      data: user
    });

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
});


app.post("/user-arirlineFligth", async function (req, res, next) {
  try {
    const { body: userArirlineFligth } = req;
    const { token } = req.cookies;
    const { data, status } = await axios({
      url: `${config.apiUrl}/api/user-arirlineFligth`,
      headers: { Authorization: `Bearer ${token}` },
      method: "post",
      data: userArirlineFligth
    });

    if (status !== 201) {
      return next(boom.badImplementation());
    }

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
});


app.get(
  "/auth/google-oauth",
  passport.authenticate("google-oauth", {
    scope: ["email", "profile", "openid"]
  })
);

app.get(
  "/auth/google-oauth/callback",
  passport.authenticate("google-oauth", { session: false }),
  function (req, res, next) {
    if (!req.user) {
      next(boom.unauthorized());
    }

    const { token, user } = req.user;

    res.cookie("token", token, {
      httpOnly: !config.dev,
      secure: !config.dev
    });
    res.redirect(`${config.siteUrl}?id=${user.id}&name=${user.name}&email=${user.email}`)
    // res.status(200).json(user);
  }
);

app.get("/auth/facebook", passport.authenticate("facebook"));

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    session: false
  }),
  function (req, res, next) {
    if (!req.user) {
      next(boom.unauthorized());
    }

    const { token, user } = req.user;

    res.cookie("token", token, {
      httpOnly: !config.dev,
      secure: !config.dev
    });

    //res.status(200).json(user);
     res.redirect(`${config.siteUrl}?id=${user.id}&name=${user.name}&email=${user.email}`)
  }
);

app.listen(config.port, function () {
  console.log(`Listening http://localhost:${config.port}`);
});
