/**
 * Created by Ash.Zhang on 2015/5/7.
 */


var express = require('express'),
    handlebars = require('express-handlebars')
      .create({
        defaultLayout: 'main',
        extname: '.hbs',
        helpers: {
          section: function(name, options) {
            if(!this.sections) this.sections = {};
            this.sections[name] = options.fn(this);
            return null;
          }
        }
      }),
    PORT = 3344,
    app = express();


// Settings
// --------------------------

app.disable('x-powered-by');
app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');
app.set('port', process.env.PORT || PORT);


// Middleware
// --------------------------

app.use(express.static(__dirname + '/public'));


// Routers
// --------------------------

// Pages
app.get('/:page', function (req, res) {
  res.render(req.params.page);
});

// Index
app.get('/', function (req, res) {
  res.render('index');
});

// 404
app.use(function (req, res) {
  res.status(404).render('404');
});

// 500
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).render('500');
});


// Listening
// --------------------------

app.listen(app.get('port'), function () {
  console.log('Listening at port: ' + app.get('port'));
});
