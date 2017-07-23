var express = require('express');
var app = express();

var data = require('./content/content.json');
// data += require('./content/content2.json');
// console.log(data);

// filelist

var fs = require('fs');

var myFileList = [];

function readFiles(dirname, onFileContent, onError) {
  fs.readdir(dirname, function(err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach(function(filename) {
      fs.readFile(dirname + filename, 'utf-8', function(err, content) {
        if (err) {
          onError(err);
          return;
        }
        onFileContent(filename, content);
      });
    });
  });
}


readFiles('data/', function(filename, content) {
  if(filename != ".DS_Store"){
    myFileList.push(filename);
  }
}, function(err) {
  throw err;
});



app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname));

// set the view engine to ejs
app.set('view engine', 'ejs');

// pages

app.get('/', function(request, response) {
  response.render('../views/index.html.ejs');
});

app.get('/ui', function(request, response) {
  // console.log(myFileList);
  response.render('../views/ui.html.ejs', {fileList: JSON.stringify(myFileList)});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
