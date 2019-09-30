var express = require('express')
var bodyParser = require('body-parser')
var fs = require('fs')
const uuidv1 = require('uuid/v1');
var app = express()
var filename = './data/relatorios.json';
var fileNameStatus = './data/status.json';

var statusMock =  {
  "status": "CONCLUIDO",
  "nome": "consultaPessoaDefault",
  "mensagem": "Válido.",
  "resultado": "VALID",
  "validado_em": "2018-11-19T19:34:46.815Z",
  "validado_por": null,
  "validado_manualmente": false,
  "atualizado_em": "2018-11-19T19:39:43.565Z",
  "criado_em": "2018-11-19T19:34:46.515Z",
  "criado_por": "Alvo Percival Wulfric Brian Dumbledore"
};

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({   // to support URL-encoded bodies
  extended: true
}));

//Define request response in root URL (/)
app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.post('/relatorios', function (req, res) {
  var json = req.body;
  var responseData = {
    "status_code": 200,
    "result": {}
  };

  try {
    createFile(filename);
    createFile(fileNameStatus);

    fs.access(filename, function (error) {
      fs.readFile(filename, 'utf8', function(err, contents) {
        var data = contents;

        if (typeof data == 'string') {
          var uuid = uuidv1();
          json.numero = uuid;
          data = JSON.parse(data);
          data.push(json);
          responseData.result.numero = uuid;
          statusMock.numero = uuid;

          fs.writeFile(filename, JSON.stringify(data), function(err) {
            if (err) throw err;
            
            fs.access(fileNameStatus, function (error) {
              fs.readFile(fileNameStatus, 'utf8', function(err, contents) {
                if (typeof contents == 'string') {
                   var statusData = JSON.parse(contents);
                   statusData.push(statusMock);

                  fs.writeFile(fileNameStatus, JSON.stringify(statusData), function(err) {
                    if (err) throw err;
                  });
                }
              });

              res.json(responseData);
            });
          });
        }
      });
    });
  } catch (e) {
    res.json({
        "error": "Bad Request",
        "message": "child \"parametros\" fails because [\"dado_aleatorio\" is not allowed]",
        "validation": {
            "source": "payload",
            "keys": [
                "parametros.dado_aleatorio"
            ]
        },
        "status_code": 400
    });
  }
});

app.get('/relatorios', function (req, res) {
  try {
    fs.access(filename, function (error) {
      fs.readFile(filename, 'utf8', function(err, contents) {
        var data = JSON.parse(contents);
        res.json(data);
      });
    });
  } catch (e) {
    res.json({
      "error": "Not Found",
      "message": "Protocolo não encontrado.",
      "status_code": 404
    });
  }
});

app.get('/relatorios/:numero/status', function (req, res) {
  try {
    var numero = req.params.numero;

    if (numero) {
      fs.access(fileNameStatus, function (error) {
        fs.readFile(fileNameStatus, 'utf8', function(err, contents) {
          var data = JSON.parse(contents);
          var result = data.filter(function (element) {
              return element.numero == numero;
          });

          res.json(result[0]);
        });
      });
    } else {
      res.json({
        "error": "Number is required",
        "message": "Número é obrigatório",
        "status_code": 400
      });
    }
    
  } catch (e) {
    res.json({
      "error": "Error",
      "message": "",
      "status_code": 400
    });
  }
});

//Launch listening server on port 8081
app.listen(8081, function () {
  console.log('app listening on port 8081!')
})

function createFile(filename) {

  if (!fs.existsSync(filename)) {
    fs.open(filename,'r',function(err, fd){
      if (err) {
        fs.writeFile(filename,JSON.stringify([]), function(err) {
            if(err) {
                console.log(err);
            }
            console.log("The file was saved!");
        });
      } else {
        console.log("The file exists!");
      }
    });
  }
}