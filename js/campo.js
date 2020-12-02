  var matriz = []					//variaveis globais, possibilidade de acesso em qualquer lugar
  var bombas = 0
  var linhaAtual;
  var colunaAtual;
  arrayflag = [];
  


  class CampoMinado{				//a logica foi criada em class com metodos e OO para facilitar o transporte ao servidor
  	constructor(){
  		this.perder = false;		//Variaveis no constructor de condicao de derrota e false
  	}
  	fase;
  	totalabertos = 0;				//criacao da variavel
  	line;
  	colune;
  	bombs;

  	gerarTabela(){						//gerarTabela serve para localizar os links dos quadradinhos
  		var str = "";					//criacao de variavel
  		if(this.perder){
  			this.perder = false;
  			str = "<table style='pointer-events: none;'>"  				//tabela nao clicavel
  		}else{
  			str = "<table>"
  		}																  
  		for(var i = 0; i < matriz.length; i++){						//pecorrendo a matriz de numeros nas celulas
  			str += "<tr>";
  			for(var j = 0; j < matriz[i].length; j++){
  				if(matriz[i][j] === 'BOMBA'){  					
  					str += `<td id='bomba' class='espaco'><a onmousedown="bandeira(event, this)" href="clicar/${[i]}/${[j]}"><audio  autoplay src="../imagens/explosao.mp3"></audio></audio></a></td>`;
  					//evento apos o clique na bomba (-1)
  				}
  				else if(matriz[i][j] === '0'){
  					str += `<td class='espaco numero n0 fundo'></td>`;	//evento quando houver um cloque no zero
  				}
  				else if(typeof matriz[i][j] === 'string'){
  					str += `<td class='espaco numero n${matriz[i][j]}'>${matriz[i][j]}</td>`;
  				}
  				else{
  					if(arrayflag[i][j] == 9){
  						str += `<td class='espaco'><a class='bandeira' onmousedown="bandeira(event, this)" href="clicar/${[i]}/${[j]}"></a></td>`;
  					}	//adiciona o 9 na matriz gerada para armazenar as posicoes das bandeiras
  					else{
  						str += `<td class='espaco'><a onmousedown="bandeira(event, this)" href="clicar/${[i]}/${[j]}"></a></td>`; //armazena os dados
  					}
  				}
  			}
  			str += "</tr>"; 	//criacao de linhas
  		}
  		str += "</table>";
  		return str 					//str converte os valores especificos em uma string
  	}


  	matrizdebandeira(){  				//geração da matriz bandeira do mesmo tamanho que a matriz original	 
  		for(var i = 0; i < this.line; i++){
  			arrayflag[i] = new Array(this.colune).fill(0)		//matriz com zeros
  		}  		
  	}


  	clicar(linha, coluna){		//esse metodo é acionado no clique, la no servidor "/clicar"

  		if(matriz[linha][coluna] == -1){	//quando clicado em uma bomba
  			this.perder = true;				//perder se torna verdadeiro
  			for(var i = 0; i < matriz.length; i++){			
  				for(var j = 0; j < matriz[i].length; j++){  						
  					if(matriz[i][j] == -1){
  						matriz[i][j] = 'BOMBA'		//atribui a string 	BOMBA para acessar sua condicao gerarTabela
  					}
  				}
  			}  			
  		}

  		else{  		  			//caso nao clique em bomba		
  			this.vitoria()  			
  			if(matriz[linha][coluna] === 0){ 	//se for zero entra no metodo mais dificil das nossas vidas
  				linha = parseInt(linha)			//transforma os parametros linah e coluna em number, pois o href (links), os trasformatam em string
  				coluna = parseInt(coluna)		//eh necessario que sejam numeros para realizar operaçoes no metodo abrirCelulas
  				this.abrirCelulas(linha, coluna)  	//ESTE METODO													 
  			}
  			else{
  				matriz[linha][coluna] = matriz[linha][coluna].toString()		//caso seja apenas um numero != 0, ele é exibido
  			}
  		}

  	}  

  	vitoria(){								//metodo é chamado no servidor (index.js)
  		for(var i = 0; i < matriz.length;i++){
  			for(var j = 0; j < matriz[i].length; j++){
  				if(matriz[i][j] != -1 && typeof matriz[i][j] == "number"){		//caso as unicas casas nao abertas sejam bombas, assim o jogador consegui
  					return false; 												//terminar o jogo
  				}		
  			}
  		}
  		return true
  	}


//monta a matriz dependendo do nivel
nivel(value){						//busca do select os valores no servidor (index.js)
	if(value == 0){
		this.fase = 0
		matriz = []				//gera a matriz quando o select é acionado
		bombas = 5		
		this.line = 5;				//quantidade de linha e coluna da matrinz
		this.colune = 6;	
		this.matrizdebandeira()				//matriz para armazena bandeiras
		this.gerarMatriz(this.line, this.colune)   //metodo para criar a matriz
	}else if(value == 1){
		this.fase = 1
		matriz = []
		bombas = 24
		this.line = 8;
		this.colune = 12;	
		this.matrizdebandeira()
		this.gerarMatriz(this.line, this.colune) 		
	}else if(value == 2){
		this.fase = 2
		matriz = []
		bombas = 70 
		this.line = 10;
		this.colune = 20;	
		this.matrizdebandeira()
		this.gerarMatriz(this.line, this.colune)	 		
	}else if(value == 3){
		this.fase = 3
		matriz = []
		bombas = 350 
		this.line = 40;
		this.colune = 23;	
		this.matrizdebandeira()
		this.gerarMatriz(this.line, this.colune)
	}else if(value == 4){
		this.fase = 4
		matriz = []
		bombas = 114 
		this.line = 5;
		this.colune = 23;	
		this.matrizdebandeira()
		this.gerarMatriz(this.line, this.colune)
	}
}

gerarMatriz(linha, coluna){
	for(var i = 0; i < linha; i++){
		matriz[i] = new Array(coluna).fill(0)		//cria uma matriz de zeros com o tamanho solicitado no nivel
	}
	this.colocarBombas(linha, coluna) 				//chama os metodos para gerar a matriz desejadas
	this.bombasEmVolta(linha, coluna)
}


colocarBombas(linha, coluna){
	for(var b = 0; b < bombas;){
		for(var i = 0; i < linha; i++){
			for(var j = 0; j < coluna; j++){							//não colocar bomba em uma casa que ja tem bomba				
				if((Math.floor(Math.random() * 8)) == 0 && b < bombas && matriz[i][j] != -1){ // coloca as bombas (-1) aleatoriamente 
					b++										
					matriz[i][j] = -1					
				}
			}
		}
	}
}

somarBombasEmVolta(linhaAtual, colunaAtual, linha, coluna){
	var n = 0;					//contador do numero da celula

	for(var i = (linhaAtual-1); i <= (linhaAtual+1); i++){				//tecnicamente pecorrer os 9 elementos mais proximos do clique
		for (var j = (colunaAtual-1); j <= (colunaAtual+1); j++){  			
			if((i < 0 || i > (linha-1)) || (j < 0 || j > (coluna-1))){
				continue
			}
			if(matriz[i][j] == -1){				//incrementado caso tenha bomba em sua volta
				n++
			}
		}
	}
	matriz[linhaAtual][colunaAtual] = n        //atribui o novo valor a matriz
}

abrirCelulas(l, c){					
	for (var i = l - 1; i <= l + 1; i++) {					//pecorre os que estao em volta
		for (var j = c - 1; j <= c + 1; j++) {
			if (i >= 0 && i < this.line && j >= 0 && j < this.colune){				//posição valida dentro da tabela
				if(typeof matriz[i][j] == 'string' && matriz[i][j] != '0'){			//se for uma string quer dizer que ja foi aberta, ou seja, continua
					continue;
				}if(typeof matriz[i][j] == 'number' && matriz[i][j] != 0){						
					matriz[i][j] = matriz[i][j].toString()							//caso seja um nao zero, ele apenas exibi, o transformando em string
				}
				if(matriz[i][j] === 0){
					matriz[i][j] = matriz[i][j].toString()							//recursao caso o zero for number, ou seja, primeira vez que é acessado
					this.abrirCelulas(i, j)											//assim evitando o looping infinito
				}
			}
		}
	}
}



bombasEmVolta(linha, coluna){		
	for(linhaAtual = 0; linhaAtual < linha; linhaAtual++){
		for(colunaAtual = 0; colunaAtual < coluna; colunaAtual++){  			
			if(matriz[linhaAtual][colunaAtual] != -1){  						//caso não seja bomba, chama o metodo para calcular o numero de bombas em volta			
				this.somarBombasEmVolta(linhaAtual, colunaAtual, linha, coluna)
			}
		}
	}
	this.gerarTabela()				//por ultimo ele chama o metodo gerarTabela	
}
}

module.exports = new CampoMinado()				//exportar toda classe para o servidor