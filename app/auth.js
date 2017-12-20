let hash = require('./hash');

const mongoose = require('mongoose');
const User = mongoose.model('User');
let randomBytes = require('crypto').randomBytes;
let redisClient = require('redis').createClient();

const authError = {
    code: 403,
    msg: 'Invalid authorization credentials'
};

redisClient.on("error", function (err) {
    console.log("Error " + err);
});

const isAdmin = (id, callback) => {
    if (!id) { //catch falsy values like null or empty string
        return callback(null, false);
    }
    User.findById(id, (err, result) => {
        if (!err && result.role == "Admin") {
            return callback(err, true);
        }
        callback(err, false);
    });
}

const currentUser = (tok, callback) => {
    if (!tok) { //catch falsy values like null, empty string
        return callback(null, null);
    }
    redisClient.get(tok, function(err, reply){
        callback(err, reply)
    });
}

module.exports.idMatchesOrAdmin = (req, res, next) => {
    if (!req.cookies || !req.cookies.token) {
        res.error = {
            status: 403,
            msg: 'Missing token'
        }
        return next(new Error(res.error));
    }
    let token = req.cookies["token"];
    module.exports.currentUser(token, (err, curr) => {
        if (err) {
            res.error = {
                status: 403,
                msg: 'Not authorized or redis error'
            };
            return next(new Error(res.error));
        }
        module.exports.isAdmin(curr, (err, state) => {
            if (err) {
                res.error = {
                    status: 403,
                    msg: 'Not authorized or redis error'
                };
                return next(new Error(res.error));
            }
            if (curr == null || (curr != req.id && !state)) {
                res.error = {
                    status: 403,
                    msg: 'Not authorized'
                };
                return next(new Error(res.error));
            }
            return next();
        });
    });
}

module.exports.checkAdmin = (req, res, next) => {
    if (!req.cookies || !req.cookies.token) {
        res.error = {
            status: 403,
            msg: 'Missing token'
        }
        return next(new Error(res.error));
    }
    let token = req.cookies["token"];
    currentUser(token, (err, curr) => {
        if (err) {
            res.error = {
                status: 403,
                msg: 'Not authorized or redis error'
            };
            return next(new Error(res.error));
        }
        isAdmin(curr, (err, state) => {
            if (err) {
                res.error = {
                    status: 403,
                    msg: 'Not authorized or redis error'
                };
                return next(new Error(res.error));
            }
            if (!state) {
                res.error = {
                    status: 403,
                    msg: 'Not authorized (must be admin)'
                };
                return next(new Error(res.error));
            }
            return next();
        });
    });
}

module.exports.idMatches = (req, res, next) => {
    if (!req.cookies || !req.cookies.token) {
        res.error = {
            status: 403,
            msg: 'Missing token'
        }
        return next(new Error(res.error));
    }
    let token = req.cookies["token"];
    module.exports.currentUser(token, (err, curr) => {
        if (err || curr == null || curr != req.params.id) {
            res.error = {
                status: 403,
                msg: 'Not authorized'
            };
            return next(new Error(res.error));
        }
        return next();
    });
}

module.exports.login = (data, callback) => {
    hash.checkAgainst(data, function(err, usr) {
        if (err) {
            console.error(err);
            return callback(err, null);
        }
        if (usr !== null) {
            let tok = randomBytes(64).toString("hex");
            redisClient.set(tok, usr._id);
            redisClient.expireat(tok, parseInt((+new Date)/1000) + 86400);
            return callback(err, Object.assign({}, usr, {"token": tok}));
        }
        return callback(err, usr);
    });
}


module.exports.currentUser = currentUser;
module.exports.isAdmin = isAdmin;