angular.module('imdbApp').controller('mainController', function($scope,$http,$routeParams,$location,getDataFactory){

	//show or hide text box
	$scope.search = false;
	//hide button back
	$scope.showback = false;
	//initial class on title Shows
	$scope.classTitle = 'col-md-4';

	$scope.reset = function()
	{
		//show or hide text box
		$scope.search = false;
		//hide button back
		$scope.showback = false;
		//initial class on title Shows
		$scope.classTitle = 'col-md-4';
	}
	
	//search
	$scope.getMovies = function(){
		var query = $scope.txtSearch;
		$scope.message = '';
		var urlTest = URL+"s="+query;
		var movies = [];
		var params = "search/tv?query="+$scope.txtSearch+"&";


	if(typeof query != "undefined"){
		  getDataFactory.getObject(params)
		  	.then(function(response){
		  	if(getDataFactory.getStatus(response) === 1){	  		
		  		response.data.results.forEach(function(element){
		  			movies.push(element);
		  		});
		  	}else{
		  		$scope.message = 'The Movie/Serie '+ query + ' was not found.';	
		  	}
		  	},function(Error){
		  		$scope.message = Error;
		  	})
		}

		$scope.movies = movies;
		$location.url("/search");	

		//enable button back
		$scope.showback = true;	
		//change size of div Show (button)
		$scope.classTitle = 'col-md-2';
		//hide search textbox
		$scope.search = false;

	}


	//method show info movie on mouse over
	$scope.preview = function(id){	 
	 $scope.rating = '';
	 var params = "tv/" + id +"?"; 
	 var actors = '';

	 getDataFactory.getObject(params)
	 	.then(function(response){	 		
	 		//check status 
	 		if(getDataFactory.getStatus(response) === 1){	 				 			
	 			$scope.rating = response.data.vote_average;	 			
	 		}else{
	 			$scope.message = 'The Movie/Serie '+ query + ' was not found.';	
	 		}
	 	},function(Error){
	 		$scope.message = Error;
	 	});
	 	
	//get Actors or Cast	 
	 params = "tv/"+ id +"/credits?";
	 getDataFactory.getObject(params)
	 	.then(function(response){	 		
	 		if(typeof response.data.cast != 'undefined'){
	 		for(var x = 0; x < 3; x ++){
	 			actors += response.data.cast[x].name +",";
	 		 }
	 		 $scope.actors = actors.slice(0,-1);
	 		}else{
	 			actors = 'No actors';
	 		}
	 	},function(Error){
	 		$scope.message = Error;
	 	});	

	}



	//get individual Details like Poster and Name of serie
	var id = $routeParams.id;	
	var params = "tv/" + id +"?";

	if(typeof id != 'undefined' && typeof id != 'null'){

		
		

		getDataFactory.getObject(params)
		  .then(function(response){	
		  	
		  	$scope.Title = response.data.name;
		  	$scope.Poster = response.data.poster_path;		  	

		  	var totalSeasons = response.data.number_of_seasons;
		  	arraySeasons = [];
		  	for(var x= 1; x<= totalSeasons; x++){
		  		arraySeasons.push(x);		  		
		  	}
		  	$scope.seasons = arraySeasons;
		  },function(Error){
		  	$scope.message = Error;
		  });
	}
			

	$scope.getEpisodes = function(season){
		var params = 'tv/'+id+'/season/'+season+'?';	

		getDataFactory.getObject(params)
		 .then(function(response){		 	
		 	$scope.Episodes = response.data.episodes;
		 },function(Error){
		 	$scope.message = Error;
		 });
	}


	//load by default first season
	if(typeof id != 'undefined' && typeof id != 'null'){
		$scope.getEpisodes(1);
	}

});

