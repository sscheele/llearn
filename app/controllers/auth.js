const auth = require('../auth');

module.exports.login = (req, res, next) => {
	if (!req.body.email) {
		res.error = {
			status: 400,
			msg: 'An email is required'
		};
		return next(new Error(res.error));
	}

	if (!req.body.password) {
		res.error = {
			status: 400,
			msg: 'A password is required'
		};
		return next(new Error(res.error));
	}

	auth.login({
		email: req.body.email,
		password: req.body.password
	}, (error, user) => {
		if (error) {
			res.error = {
				status: 403,
				msg: error
			};
			return next(new Error(res.error));
		}
		if (user) {
            res.cookie("token", token, {"maxAge": 86400000})
            return next();
		} else {
			res.error = {
				status: 403,
				msg: 'Your email or password is incorrect.'
			};
			return next(new Error(res.error));
		}
	})
}
