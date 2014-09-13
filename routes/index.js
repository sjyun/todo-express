
exports.index = function(req, res, next){
	if (req.session.name) {
		console.log('success login : ' + req.session.name);
	    res.render('index', {
	      title: 'Todo List',
	      logined: true });
	} else {
		console.log('success logout : ' + req.session.name);
		res.render('index', {
	      title: 'Todo List'});
	}
};

exports.login = function(req, res, next){
	if (req.body.nickname) {
		req.session.name = req.body.nickname;
	}
	res.redirect('/');
};