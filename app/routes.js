var User = require('./models/user');
var Module = require('./models/module');
var Chat = require('./models/chat');
var AdmZip = require('adm-zip');
var path = require('path');
var multer = require('multer')
var upload = multer({ dest: path.join(__dirname, 'uploads') })
var fs = require('fs');
module.exports = function (app, passport) {
    // show the home page
    app.get('/', function (req, res) {
        res.render('index');
    });

    //PROFILE STUFF (YOURS AND SOMEONE ELSE'S)
    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile')
    });

    app.get('/profile/json', isLoggedIn, function (req, res) {
        res.json({ email: req.user.local.email, profile: req.user.profile });
    });

    app.get('/users*', function (req, res) {
        res.render('info');
    });

    app.get('/info/json/:username', function (req, res) {
        var uname = req.params.username;
        User.findOne({ "profile.screenName": uname }, function (err, usr) {
            if (err) {
                res.send(404);
                return;
            }
            console.log(usr.profile)
            res.json({ profile: usr.profile });
        });
    })

    app.post('/profile/know/add', isLoggedIn, function (req, res) {
        req.user.profile.knownLanguages.push(req.body.lang);
        req.user.save(function (error) {
            if (error) console.log(error);
        });
    });

    app.post('/profile/learn/add', isLoggedIn, function (req, res) {
        req.user.profile.learningLanguages.push(req.body.lang);
        req.user.save(function (error) {
            if (error) console.log(error);
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    // =============================================================================
    // AUTHENTICATE (FIRST LOGIN) ==================================================
    // =============================================================================
    app.get('/login', function (req, res) {
        res.render('login', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // SIGNUP  AND UNLINK =================================
    // show the signup form
    app.get('/signup', function (req, res) {
        res.render('signup', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    app.get('/unlink', isLoggedIn, function (req, res) {
        var user = req.user;
        user.local.email = undefined;
        user.local.password = undefined;
        user.save(function (err) {
            res.redirect('/profile');
        });
    });


    //CLASS UPLOAD
    app.get('/contribute', function (req, res) {
        res.render('addclass.pug');
    });

    app.post('/classes/add', isLoggedIn, upload.single('classUpload'), function (req, res, next) {
    
    });

    // CLASSES STUFF
    app.get('/classes', function (req, res) {
        Module.find({}).limit(20).exec(function (err, docs) {
            res.render('classes', { classes: docs });
        });
    });

    app.get('/classes/:classid', function (req, res) {
        res.redirect('/classes/' + req.params.classid + '/0');
    })

    app.post('/classes/:classid/rate', isLoggedIn, function (req, res) {
        var newRate = parseInt(req.body.rating);
        Module.findById(req.params.classid, function (err, doc) {
            if (err) {
                console.log(err)
                return;
            }
            doc.rating = newRate;
            Module.findOneAndUpdate({ _id: req.params.classid }, doc, function (err, doc) {
                if (err) console.log(err);
            });
        });
    })

    app.post('/classes/:classid/comment', isLoggedIn, function (req, res) {
        Module.findById(req.params.classid, function (err, doc) {
            if (err) {
                console.log(err)
                return;
            }
            doc.comments.push({ user: req.user.profile.screenName, text: req.body.comment });
            doc.save();
        });
        res.redirect("/classes/" + req.params.classid);
    });

    app.get('/classes/:classid/:page', function (req, res) {
        Module.findById(req.params.classid, function (err, doc) {
            if (err) console.log(err);
            res.render('classpage', { classname: doc.name, classid: req.params.classid, page: req.params.page, classpages: doc.pages, comments: doc.comments });
        });
    });

    //CHAT STUFF
    app.get('/chat', isLoggedIn, function (req, res) {
        res.render('highchat', { chats: req.user.chats });
    });
    app.get('/chat/json', isLoggedIn, function (req, res) {
        res.json(req.user)
        res.json(User.findById(req.user._id).chats)
    });
    app.get('/chat/:sname', function (req, res) {
        User.findOne({ 'profile.screenname': req.params.sname }, function (err, doc) {
            if (err) console.log(err);
            res.render('lowchat', { with: doc.profile })
        });
    });
    app.get('/msg', function (req, res) {
        //Find
        Chat.find({
            'room': req.query.room.toLowerCase()
        }).exec(function (err, msgs) {
            //Send
            res.json(msgs);
        });
    });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}