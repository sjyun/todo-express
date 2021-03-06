var express = require('express');
var routes = require('./routes');
var tasks = require('./routes/tasks');
var http = require('http');
var path = require('path');
var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://localhost:27017/todo?auto_reconnect', {safe:true});
var app = express();
var socket = require('socket.io')
var redis = require('redis')
var client = redis.createClient();

client.on("error", function (err) {
    console.log("error event - " + client.host + ":" + client.port + " - " + err);
});

var favicon = require('serve-favicon'),
  logger = require('morgan'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  csrf = require('csurf'),
  errorHandler = require('errorhandler');

app.use(function(req, res, next) {
  req.db = {};
  req.db.tasks = db.collection('tasks');
  req.redis = redis;
  req.redisClient = client;
  req.loginedUsers=[];
  req.redisClient.lrange("loginedUsers",0,-1,function(err,obj){
        if (err) {
        }else {
            req.loginedUsers = obj;
            console.log(req.loginedUsers)

        }
    })
  next();
})
app.locals.appname = 'Express.js Todo App'
// all environments


app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(favicon(path.join('public','favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride());
app.use(cookieParser('CEAF3FA4-F385-49AA-8FE4-54766A9874F1'));
app.use(session({
  secret: '59B93087-78BC-4EB9-993A-A61FC844F6C9',
  resave: true,
  saveUninitialized: true
}));
app.use(csrf());

app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.locals._csrf = req.csrfToken();
    return next();
})

app.get('/', routes.index);
app.post('/login', tasks.login);

app.use(function(req, res, next) {
  if(req.session.nickname){
      next();
  }else{
      res.redirect('/')
  }
})

app.param('task_id', function(req, res, next, taskId) {
  req.db.tasks.findById(taskId, function(error, task){
    if (error) return next(error);
    if (!task) return next(new Error('Task is not found.'));
    req.task = task;
    return next();
  });
});

app.get('/tasks', tasks.list);
app.post('/tasks', tasks.markAllCompleted, sendMsg)
app.post('/tasks', tasks.add, sendMsg);
app.put('/tasks/:task_id', tasks.updateTask, sendMsg);
app.get('/tasks/:task_id', tasks.findById);
app.post('/tasks/:task_id', tasks.markCompleted, sendMsg);
app.delete('/tasks/:task_id', tasks.del, sendMsg);

app.all('*', function(req, res){
  res.send(404);
})
// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = socket.listen(server);

io.on('connection', function(socket) {
  console.log('Hello Socket IO');

  socket.emit('user connect');

});


function sendMsg() {

  console.log('============ chnage task ==========');

  io.sockets.emit('change task');
}


