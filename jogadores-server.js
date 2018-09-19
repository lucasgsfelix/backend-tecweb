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
    nomeJogador = nomeJogador.replace("_", " ")
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
    //acessando valores do dicionário console.log(x[0]["Market Value 0"])
    console.log(precoJogador)
	dbo.collection('Jogadores').find( {"Market Value 0" : {$gte: parseInt(precoJogador)} } ).toArray(function(err, x) {
        
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
//retornando jogadores pela nacionalidade
app.get('/Jogadores/nacionalidade', function(req, res){

    var nacionalidade = req.query.eq
    var nacionalidade = {"Birth Place": nacionalidade}

    dbo.collection('Jogadores').find(nacionalidade).toArray(function(err, x) {
        res.setHeader('Content-Type','application/json');
        res.status(200);
        res.send(JSON.stringify(x)); //estou retornando o jogador
    });
})
app.get('/Times/Nacional', function(req, res){

    var consultas = req.query.eq
    var nacionalidade = {"Birth Place": consultas[0]}
    var valorMercado = consultas[1]
       
    dbo.collection('Jogadores').find( {"Market Value 0" : {$gte: parseInt(valorMercado)} } ).toArray(function(err, jogadores) {
        
        selecionados = []
        for(var i=0;i<jogadores.length;i++){

            if(jogadores[i]["Birth Place"] == consultas[0]){
                selecionados.push(jogadores[i])
            }
        }
        res.setHeader('Content-Type','application/json');
        res.status(200);
        res.send(JSON.stringify(selecionados)); //estou retornando o jogador
    
    });

})
app.get('/Times/Selecao', function(req, res){
    //selecionar os jogadores mais caros por posição de um determinado país
    var nacionalidade = req.query.eq
    var nacionalidade = {"Birth Place": nacionalidade}
    var formacao = ['GK', 'GK', 'LB', 'RB', 'CB', 'CB', 'LW', 'RW', 'CF', 'CF', 'CM', 'CM']

    dbo.collection('Jogadores').find(nacionalidade).toArray(function(err, jogadores) {
        

        //res.setHeader('Content-Type','application/json');
        jogadores.sort(function(a, b){
            
            return a["Preferred Positions"] - b["Preferred Positions"]
        })
        jogadoresSelecionados = []
        for(var j in formacao){
            
            for(var i=0;i<jogadores.length;i++){

                if((jogadores[i]["Preferred Positions"] == formacao[j]) && (jogadoresSelecionados.includes(jogadores[i]) == false)){
                    jogadoresSelecionados.push(jogadores[i]); //estou retornando o jogador
                    break
                }
            } //aqui adicionei todos de uma posição desejada */
        }
        res.setHeader('Content-Type','application/json');
        res.status(200);
        res.send(JSON.stringify(jogadoresSelecionados)); //estou retornando o jogador
        
    });  

})

app.get('/Times/Mundo', function(req, res){ // retorna os melhores de acordo com as posições passadas pelo usuário

    //var posicao = ['GK', 'ST', 'RW', 'CF', 'LW', 'CAM', 'CM', 'CDM', 'LM', 'RM', 'CB', 'RB', 'RWB', 'LB', 'RB']
    var formacao = ['GK', 'LB', 'RB', 'CB', 'CB', 'LW', 'RW', 'CF', 'CF', 'CM', 'CM']
    var jogadores = []
    for(var i in formacao){

        var jogador = (dbo.collection('Jogadores').find({"Preferred Positions": formacao[i]}).sort({"Market Value 0":-1}).limit(1).toArray(function(err, jogador){
            if(err) return console.log(err)

            //res.setHeader('Content-Type','application/json');
            res.status(200);
            if(jogador.length>0){
                res.write(JSON.stringify(jogador)); //estou retornando o jogador
                return jogador[0].Name.toString()
            }
           
        }))
        jogadores.push(jogador) //assim eu verifico se o jogador não esta aqui antes de retornar        
    }
})
app.get('/Edicao', function(req, res){ //retornando por edicao do fifa

    var edicao = req.query.eq
    edicao = edicao.replace("_", " ")

    dbo.collection('Jogadores').find( {"Game Edition" : edicao} ).toArray(function(err, x) {
        res.setHeader('Content-Type','application/json');
        res.status(200);
        res.send(JSON.stringify(x)); //estou retornando o jogador
    });
})

app.get('/valor/edicao', function(req, res){ //retornando por edição e por valor

    var edicao = req.query.eq
    edicao = edicao.replace("_", " ")

    dbo.collection('Jogadores').find( {"Game Edition" : edicao} ).sort({"Market Value 0":-1}).toArray(function(err, x) {
        res.setHeader('Content-Type','application/json');
        res.status(200);
        res.send(JSON.stringify(x)); //estou retornando o jogador
    });
})
//retornando pelo valor de mercado
app.get('/Jogadores/valor_mercado', function(req, res){

	var valorMercado = req.query.eq;

	dbo.collection('Jogadores').find( {"Market Value" : {$gte: parseInt(valorMercado)} } ).toArray(function(err, x) {
        res.setHeader('Content-Type','application/json');
        res.status(200);
        res.send(JSON.stringify(x)); //estou retornando o jogador
    });

})
app.put('/Jogadores', function(req, res){ //mudando jogador

	var jogador = req.body //ele vai pegar o json
	var jogadorDic_nome = {Name : jogador.Name}; //pegando no json

	dbo.collection('Jogadores').updateOne(jogadorDic_nome, {$set : jogador}, function(err, result){
        if(err) throw console.log(err)
        res.status(200)
       	res.send("Os dados do jogador foram alterados com sucesso !")

    })

})

app.post('/Jogadores', function(req, res) { //adicionando jogadores no banco de dados
    var jogador = req.body;

    dbo.collection('Jogadores').insertOne(jogador, function(err, result) {
        if (err) throw console.log(err);

        res.status(200);
        res.send('Jogador adicionado com sucesso!');
    });
});

app.delete('/Jogadores/nome', function(req, res) { //deleta um jogador

    var nomeJogador = req.query.eq;
    var id = {Name : nomeJogador};

    dbo.collection('Jogadores').deleteOne(id,function(err, result) { //deleta apenas um jogador
       res.status(204);
       res.send('Jogador removido com sucesso!');
    });
});

app.delete('/Jogadores', function(req, res) {  // deleta todos jogadores

	
    dbo.collection('Jogadores').deleteMany({},function(err, result) {
        res.status(204);
        res.send('Jogadores removidos com sucesso!');
    });
});
