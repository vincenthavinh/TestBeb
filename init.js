function initialisation(){
	cleanForm();

	/*affiche les dropdown menus contenant les noms de toutes les colonnes de la Spreadsheet*/
	google.charts.setOnLoadCallback(retrieveColumnsNames);
	google.charts.setOnLoadCallback(retrieveTechniquesNames);
}

function retrieveColumnsNames(){
	/*String requete qui ne rend qu'une seule ligne de resultat, peu importe laquelle*/
	var query = "LIMIT 1";

	/*url de la spreadsheet google. concatenation debut_url+ Spreadsheet Key + fin_url*/
	var url = "https://docs.google.com/spreadsheets/d/"+
		document.getElementById("key").value+"/gviz/tq?sheet=Sheet1&headers=1&tq=";

	sendQuery(url, query, function(response){
		/*extract... renvoie un objet Datatable avec les donneess utiles dedans*/
		var data = extractDataTableFromAnswer(response);

		printColumnsNamesMenus(data);
		retrieveVersions(data);

	});

	function printColumnsNamesMenus(data){
		/*fragment HTML = objet conteneur qu'on remplit de noeuds HTML*/
		var fragment = document.createDocumentFragment();

		/*boucle d'ajout d'un noeud <option> de nom de colonne dans le fragment HTML*/
		for(var i=0; i<data.getNumberOfColumns(); i++){
			var opt = document.createElement('option');
			opt.innerHTML = data.getColumnId(i)+": "+data.getColumnLabel(i);
		    opt.value = data.getColumnId(i);
		    fragment.appendChild(opt);
		}

		/*dropdown menus auxquels on veut ajouter les options*/
		var menu = document.getElementById("comparedType");

		/*ajout des options*/
		menu.appendChild(fragment.cloneNode(true));

		/*on rend les menus visibles dans le document HTML*/
		menu.style.display = 'inline';
	}

	function retrieveVersions(data){
		var versionColumnId;
		for(var i=0; i<=data.getNumberOfColumns() && data.getColumnLabel(i).search(/version/i); i++){
		}
		versionColumnId = data.getColumnId(i);

		var query = "SELECT "+versionColumnId+", count("+versionColumnId+") GROUP BY "+versionColumnId;
		var queryEncoded = new google.visualization.Query(url + encodeURIComponent(query));
		queryEncoded.send( function(response){
			var dt = extractDataTableFromAnswer(response);
			console.log("num of rows: "+dt.getNumberOfRows());
			//for(var i=0; i<dt.getNumberOfRows(); i++ ) 
			//	console.log(dt.getValue(i, 0));

		});
	}
}

function retrieveTechniquesNames(){
	/*String requete qui rend les techniques distinctes et le nombre de lignes
	resultats pour chacune*/
	var query = "SELECT D, count(D) GROUP BY D";

	/*url de la spreadsheet google. concatenation debut_url+ Spreadsheet Key + fin_url*/
	var url = "https://docs.google.com/spreadsheets/d/"+
		document.getElementById("key").value+"/gviz/tq?sheet=Sheet1&headers=1&tq=";

	sendQuery(url, query, printTechniquesNamesMenus);

	function printTechniquesNamesMenus(response){
		/*extract... renvoie un objet Datatable avec les donneess utiles dedans*/
		var data = extractDataTableFromAnswer(response);

		//console.log("distinct techniques in the spreadsheet :\n"+
		//	data.getDistinctValues(0)+"\n(techniques with <= 1 row removed from dropdown menu)");

		/*fragment HTML = objet conteneur qu'on remplit de noeuds HTML*/
		var fragment = document.createDocumentFragment();

		/*boucle d'ajout d'un noeud <option> de nom de colonne dans le fragment HTML*/
		for (var i=0; i<data.getNumberOfRows(); i++) {
			/*ON NE GARDE PAS LES TECHNIQUES QUI ONT <= 1 RESULTAT*/
			if(data.getValue(i,1)>1){
				var opt = document.createElement('option');
				opt.innerHTML = "("+data.getValue(i,1)+"): "+data.getValue(i,0);
		    	opt.value = data.getValue(i,0);
		    	fragment.appendChild(opt);
			}
		}

		/*dropdown menus auxquels on veut ajouter les options*/
		var menu1 = document.getElementById("techX");
		var menu2 = document.getElementById("techY");

		/*ajout des options*/
		menu1.appendChild(fragment.cloneNode(true));
		menu2.appendChild(fragment.cloneNode(true));

		/*on rend les menus visibles dans le document HTML*/
		menu1.style.display = 'inline';
		menu2.style.display = 'inline';
	}
}

function cleanForm(){
		var toClean = ["comparedType", "techX", "techY", ];
		
		for(var i=0; i<toClean.length; i++){
			var tmp = document.getElementById(toClean[i]);
			while (tmp.lastChild) 
  				tmp.removeChild(tmp.lastChild);
		}
}