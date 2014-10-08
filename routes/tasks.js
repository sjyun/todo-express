
/*
 * GET users listing.
 */

exports.list = function(req, res, next){
  req.db.tasks.find({completed: false}).toArray(function(error, tasks){
    if (error) return next(error);
    res.render('tasks', {
      tasks: tasks || []
    });
  });
};

exports.add = function(req, res, next){
  if (!req.body || !req.body.name) return next(new Error('No data provided.'));
  console.info(req.body.name);
  req.db.tasks.save({
    name: req.body.name,
    contents:req.body.contents,
    completed: false
  }, function(error, task){
    if (error) return next(error);
    if (!task) return next(new Error('Failed to save.'));
    console.info('Added %s with id=%s', task.name, task._id);
    next();
    res.render('task', {
      task: task
    });
  })
};

exports.findById = function(req, res, next){
  res.status(200).send(req.task);
};

exports.markAllCompleted = function(req, res, next) {
  if (!req.body.all_done || req.body.all_done !== 'true') return next();
  req.db.tasks.update({
    completed: false
  }, {$set: {
    completed: true
  }}, {multi: true}, function(error, count){
    if (error) return next(error);
    console.info('Marked %s task(s) completed.', count);
    next();
    res.status(200).send();
  })
};

exports.markCompleted = function(req, res, next) {
  if (!req.body.completed) return next(new Error('Param is missing'));
  req.db.tasks.updateById(req.task._id, {$set: {completed: req.body.completed === 'true'}}, function(error, count) {
    if (error) return next(error);
    if (count !==1) return next(new Error('Something went wrong.'));
    console.info('Marked task %s with id=%s completed.', req.task.name, req.task._id);
    next();
    res.status(200).send();
  })
};

exports.del = function(req, res, next) {
  req.db.tasks.removeById(req.task._id, function(error, count) {
    if (error) return next(error);
    if (count !==1) return next(new Error('Something went wrong.'));
    console.info('Deleted task %s with id=%s completed.', req.task.name, req.task._id);
    next();
    res.status(200).send();
  });
};


exports.updateTask = function(req, res, next) {
  req.db.tasks.updateById(req.task._id, {$set: {contents: req.body.contents , name:req.body.name }}, function(error, count) {
    if (error) return next(error);
    if (count !==1) return next(new Error('Something went wrong.'));
    console.info('Updated Task : task %s with id=%s completed.', req.task.name, req.task._id);
    next();
    res.status(200).send();
  })
};

exports.login = function(req, res, next) {
    req.session.nickname=req.param('nickname');
    req.redisClient.lpush("loginedUsers", req.param('nickname'),req.redis.print);
    res.redirect('/')
};
