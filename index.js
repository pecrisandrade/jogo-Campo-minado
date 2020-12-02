const express = require('express');
const fs = require('fs');			//file system(leitura de arquivo)
const app = express();
const campo = require(__dirname+'/js/campo.js')	   	//servidor receve todo metodo campo

app.use('/css', express.static(__dirname+'/css'))			//recebe o css e as imagens
app.use('/imagens', express.static(__dirname+'/imagens'))
campo.nivel(0)		//start no select

app.get('/nivel/:nivel', (req, res) =>{				//recebe o value do nivel
	campo.nivel(req.params.nivel)
	res.redirect('/campo?nivel='+campo.fase)
})

app.get('/campo', (req, res) =>{			//gera  a tabela
	fs.readFile(__dirname+'/views/campo.html', 'UTF-8', (err, date) =>{
		var tabela = campo.gerarTabela()
		var replaced = date.replace('__tabela__', tabela)
		res.send(replaced)
	})
})
app.get('/', (req, res) =>{		//links para mudanca de pagina
	res.sendFile(__dirname+'/views/menu-campo.html')
})

app.get('/regras', (req, res) =>{		//links para mudanca de pagina
	res.sendFile(__dirname+'/views/regras.html')
})

app.get('/criadores', (req, res) =>{		//links para mudanca de pagina
	res.sendFile(__dirname+'/views/criadores.html')
})

app.get('/clicar/:linha/:coluna/:bandeiras', (req, res) =>{		//recebe os indices do arraydebandeira
	var bandeiras = req.params.bandeiras	
	if(bandeiras === 'vazio'){
		
	}else{
		bandeiras = bandeiras.split(',')
		for(var i = 0; i < bandeiras.length; i++){			//percorrer todos elementos de matrizdebandeira
			var posicao = bandeiras[i].split('-')
			arrayflag[posicao[0]][posicao[1]] = 9			//indice de onde deve ser colocada a bandeira
		}
	}
	campo.clicar(req.params.linha, req.params.coluna)		//em todo clique "roda" o metodo vitoria
	if(campo.vitoria()){
		res.redirect('/nivel/'+(campo.fase + 1))			//caso o metodo vitoria seja true, ele passa de nivel
	}
	res.redirect('/campo')							//resposta ao requite
})

app.listen(3001)			//porta