//configure
requirejs.config({

paths:{
       jquery:"//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min",
	   jquery_ui:"//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min",
	   bootstrap:"//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min",
	   knockout:"//cdnjs.cloudflare.com/ajax/libs/knockout/3.1.0/knockout-min",
	   helpers:"../vendor/knockout-amd-helpers.min",
	   text:"../vendor/text",
	   domReady:"../vendor/domReady",
	   viewModel: "../js/viewModel"
	   
	   
	   
	   

      },
//urlArgs: "bust=v2" //prevent from caching required resources
urlArgs: "bust=" + (new Date()).getTime()
});

//start the main app logic

requirejs(['knockout','viewModel','text', 'helpers','domReady!','jquery', 'jquery_ui', 'bootstrap'], function(ko, viewModel) {
    
	
	ko.amdTemplateEngine.defaultPath = "../templates";
	var vm=new viewModel();
	ko.applyBindings(vm);
	
	
	
					 
	//localStorage.records=JSON.stringify(listOfRecords);
	
	
	
     
		 
	 
	
    
	
	
});