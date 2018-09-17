// backend do projeto

var express = require('express');
var app = express();

var body_parser = require('body-parser');
app.use(body_parser.urlencoded({
    extended: true
}));
app.use(body_parser.json());

var mongo_cliente = require('mongodb').MongoClient;
var dbo;

mongo_cliente.connect('mongodb://localhost:27017/', { useNewUrlParser: true }, function( err, db) {
    if (err) throw err; //função para conectar ao banco de dados

    dbo = db.db('Futebol');

    app.listen(3000, function() {
        console.log('Funcionando ...');
    });
});

app.get('/Jogadores', function(req, res) { //retorna os jogadores em nosso banco
    dbo.collection('Jogadores').find().toArray(function(err, Jogadores) {
        res.setHeader('Content-Type','application/json');
        res.status(200);
        res.send(JSON.stringify(Jogadores));
    });
});
//retornando jogadores pelo nome
app.get('/Jogadores/nome', function(req, res){

	var nomeJogador = req.query.eq; //fazendo a pesquisa pelo nome do jogador
    var jogador = {Name : nomeJogador}; //cria um "dicionario" com o campo Name: "Requisição", assim ele pesquisa no banco
 
   	dbo.collection('Jogadores').find(jogador).toArray(function(err, x) {
        res.setHeader('Content-Type','application/json');
        res.status(200);
        res.send(JSON.stringify(x)); //estou retornando o jogador
    });
})

//retornando jogadores por um limite de preço
app.get('/Jogadores/preco', function(req, res){

	var precoJogador =  req.query.eq
	//var precoJogador = {Price : parseInt(precoJogador)}
	//$gt -- greater than
	dbo.collection('Jogadores').find( {Price : {$gte: parseInt(precoJogador)} } ).toArray(function(err, x) {
        res.setHeader('Content-Type','application/json');
        res.status(200);
        res.send(JSON.stringify(x)); //estou retornando o jogador
    });

})

//retornando jogadores pela idade
app.get('/Jogadores/idade', function(req, res){

	var idadeJogador =  req.query.eq
	//var precoJogador = {Price : parseInt(precoJogador)}
	//$gt -- greater than
	dbo.collection('Jogadores').find( {Age : {$gte: parseInt(idadeJogador)} } ).toArray(function(err, x) {
        res.setHeader('Content-Type','application/json');
        res.status(200);
        res.send(JSON.stringify(x)); //estou retornando o jogador
    });
})

app.get('/Jogadores/valor_mercado', function(req, res){

	var valorMercado = req.query.eq;

	dbo.collection('Jogadores').find( {"Market Value" : {$gte: parseInt(valorMercado)} } ).toArray(function(err, x) {
        res.setHeader('Content-Type','application/json');
        res.status(200);
        res.send(JSON.stringify(x)); //estou retornando o jogador
    });

})
app.put('/Jogadores', function(req, res){ //mudando o nome do jogador

	var jogador = req.body //ele vai pegar o json
	var jogadorDic_nome = {Name : jogador.Name}; //pegando no json

	dbo.collection('Jogadores').updateOne(jogadorDic_nome, {$set : jogador}, function(err, result){
        if(err) throw console.log(err)
        res.status(200)
       	res.send("Os dados do jogador foram alterados com sucesso !")

    })

})