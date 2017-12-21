const readChunk = require('read-chunk');
const fileType = require('file-type');
const auth = require('../auth');
const Module = require('mongoose').model('Module');
const User = require('mongoose').model('User');

module.exports.create = (req, res, next) => {
    if (!req.body.name || !req.body.description) {
        res.error = {
            status: 400,
            msg: "Requires a name and description"
        };
        return next(new Error(res.error));
    }
    auth.currentUser(req.cookies.token, (err, userID) => {
        if (err || !userID) {
            res.error = {
                status: 403,
                msg: "Not logged in or bad token"
            };
            return next(new Error(res.error));
        }
        user.findById(userID, (err, userDoc) => {
            if (err || !userDoc) {
                res.error = {
                    status: 400,
                    msg: "User DNE"
                }
                return next(new Error(res.error))
            }
            Module.count({ author: userDoc.screenName, published: false }, (err, count) => {
                if (err) {
                    res.error = {
                        status: 500,
                        msg: "Couldn't perform DB lookup count"
                    }
                    return next(new Error(res.error));
                }
                if (count) {
                    res.error = {
                        status: 400,
                        msg: "Can't have more than one draft"
                    }
                    return next(new Error(res.error));
                }
                let tmp = new Module({ name: req.body.name, description: req.body.description, author: userDoc.screenName, published: false, updated: new Date(), comments: [], pages: 0 });
                Module.save(tmp, (err, result) => {
                    if (err) {
                        res.error = {
                            status: 500,
                            msg: "Couldn't perform DB insert"
                        }
                        return next(new Error(res.error));
                    }
                    fs.mkdirSync(path.join(__dirname, "../../public/classes", result._id));
                    fs.mkdirSync(path.join(__dirname, "../../public/classes", result._id, "res"));
                });
            });
        });

    });
}

module.exports.uploadResource = (req, res, next) => {
    let classDest = path.join(__dirname, "../../public/classes", req.params.id, "res");
    if (!fs.existsSync(classDest)) {
        res.error = {
            status: 400,
            msg: "Bad class ID"
        };
        return next(new Error(res.error));
    }
    auth.currentUser(req.cookies.token, (err, userID) => {
        if (err || !userID) {
            res.error = {
                status: 403,
                msg: "Not logged in or bad token"
            };
            return next(new Error(res.error));
        }
        Module.findById(req.params.id, (err, moduleDoc) => {
            if (err) {
                res.error = {
                    status: 400,
                    msg: "Bad class ID"
                };
                return next(new Error(res.error));
            }
            user.findById(userID, (err, userDoc) => {
                if (moduleDoc.author != userDoc.profile.screenName) {
                    res.error = {
                        status: 403,
                        msg: "You are not the author of this module"
                    };
                    return next(new Error(res.error));
                }
                const buffer = readChunk.sync(req.file.path, 0, 4100);
                let type = fileType(buffer).ext;
                //TODO: check if type in a list of known good, otherwise del
                let name = fs.readdirSync(classDest).length.toString();
                fs.rename(req.file.path, path.join(classDest, name + '.' + type), function (err) {
                    if (err) console.log(err);
                });
            });

        });
    })

}

module.exports.read = (req, res, next) => {
    if (!req.params.classid) {
        res.error = {
            status: 400,
            msg: "Class ID required"
        }
        return next(new Error(res.error));
    }
    let pageNum = req.params.page;
    if (page == undefined) {
        pageNum = 0;
    }
    Module.findById(req.params.classid, function (err, doc) {
        if (err) console.log(err);
        res.render('classpage', { classname: doc.name, classid: req.params.classid, page: pageNum, classpages: doc.pages, comments: doc.comments });
    });
}

module.exports.update = (req, res, next) => {
    if (!req.params.classid) {
        res.error = {
            status: 400,
            msg: "Class ID required"
        }
        return next(new Error(res.error));
    }
    Module.findById(classid, (err, moduleDoc) => {
        if (err) {
            res.error = {
                status: 400,
                msg: "Module does not exist"
            }
            return next(new Error(res.error))
        }
        auth.currentUser(req.cookies.token, (err, userId) => {
            User.findById(userId, (err, userDoc) => {
                if (err || !userDoc) {
                    res.error = {
                        status: 500,
                        msg: "User not found"
                    }
                    return next(new Error(res.error))
                }
                if (moduleDoc.author != userDoc.screenName) {
                    res.error = {
                        status: 403,
                        msg: "You are not the author of this module"
                    }
                    return next(new Error(res.error));
                }
                updateFromJSON(moduleDoc._id, req.content);
            });
        });
    });
}

module.exports.destroy = () => {

}