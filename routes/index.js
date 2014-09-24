
/*
 * GET home page.
 */

exports.index = function(req, res, next){
  req.db.tasks.find({completed: false}).toArray(function(error, tasks){
    if (error) return next(error);
    res.render('index', {
      logined : req.session.nickname ||false ,
      title: 'Todo List',
      tasks: tasks || []
    });
  });
};