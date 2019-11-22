const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const ApiKeysService = require('../services/apiKeys');
const { config } = require('../config');
const UserService = require('../services/users');
const validationHandler = require('../utils/middleware/validationHandler');
const { createUserSchema, createPrividerUserSchema } = require('../utils/schemas/users');

//basic strategy

require('../utils/auth/strategies/basic');

function authApi(app) {
    const router = express.Router();
    app.use('/api/auth', router);

    const apiKeyService = new ApiKeysService();
    const userService = new UserService();

    router.post('/sign-in', async (req, res, next) => {

        const { apiKeyToken } = req.body;
        console.log(apiKeyToken);
        if (!apiKeyToken)
            next(boom.unauthorized('api token is required'));

        passport.authenticate('basic', (error, user) => {
            try {
                console.log(user)
                if (error || !user) {
                    next(boom.unauthorized());
                }

                req.login(user, { session: false }, async (error) => {
                    if (error) {
                        next(error);
                    }
                    const apiKey = await apiKeyService.getApiKey({ token: apiKeyToken });

                    if (!apiKey)
                        next(boom.unauthorized());
              
                    const { _id : id, name, email } = user;
                    const payload = {
                        sub: id,
                        name,
                        email,
                        scopes: apiKey.scopes
                    };
                    const token = jwt.sign(payload, config.authJwtSecret, {
                        expiresIn: '15m'
                    });

                    res.status(200).json({ token, user: { id, name, email } });
                });
            } catch (error) {
                next(error);
            }

        })(req, res, next);
    });

    router.post('/sign-up', async (req, res, next) => {
        const { body: user } = req;

        try {

            const createdUserId = await userService.createUser({ user });
            res.status(200).json({
                data: createdUserId,
                messagge: "user created"
            });
        } catch (error) {
            next(error);
        }
    });

    router.post('/sign-provider',
        //validationHandler(createPrividerUserSchema),
        async (req, res, next) => {
            const { body } = req;

            const { apiKeyToken, ...user } = body;

            if (!apiKeyToken)
                next(boom.unauthorized('apiKeyToken is required'));

            try {
                const queryUser = await userService.getOrCreateUser({ user });
                const apiToken = await apiKeyService.getApiKey({ token: apiKeyToken });

                if (!apiToken)
                    next(boom.unauthorized());

                const { _id: id, name, email } = queryUser;
                const payload = {
                    sub: id,
                    name, 
                    email,
                    scopes: apiToken.scopes
                }
                const token = jwt.sign(payload, config.authJwtSecret, {
                    expiresIn: '15m'
                });

                res.status(200).json({ token, user: { id, name, email } });

            } catch (error) {
                next(error)
            }
        });
};


module.exports = authApi;