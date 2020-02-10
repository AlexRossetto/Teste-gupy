const request = require('request');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'staging.cweudo5c98bn.sa-east-1.rds.amazonaws.com',
    user: 'pyqa',
    password: 'sUQu1gH7gl9#uBoKnB',
    database: 'teste_py'
  });

  connection.connect((err) => {
    if (err) throw err;
  });

  let standard_input = process.stdin;
  standard_input.setEncoding('utf-8');
  console.log("Digite o Cep:   ")
  standard_input.on('data', function(data) {
     let param =  data
     request(`http://cep.bldstools.com/?cep=${param}`, { json: true }, (err, res, body) => {
      if (err) { return console.log(err); }
      //console.log(body);
      if(body.code == 200) {
        let nome = 'Alexandre Diniz';
        let stmt = "INSERT INTO dados_dep(cep, nome, endereco, bairro, estado, cidade, retorno_api) VALUES(?,?,?,?,?,?,?)"
        let json = {code : body.code, message: body.message}
        json = JSON.stringify(json);
        let values = [param, nome, body.result.logradouro, body.result.bairro, body.result.uf, body.result.localidade, json];
        //console.log(values , "valores a serem inseridos");
        connection.query(stmt, values, (err, results, fields) => {
          if (err) {
            return console.error(err.message);
          }
          // get inserted id
          //console.log('Id:' + results.insertId);
      
          let stmt = "Select * from dados_dep where id = ?"
          connection.query(stmt, results.insertId, function(err, rows, fields) {
            console.log(rows[0], "Dados que eu inseri");
          });
        });
      }
      console.log(body);
    })
 })