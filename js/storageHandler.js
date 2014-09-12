define(['jquery','knockout'],function(ko){

var updateRecords= function(list){
                 console.log('storage called');
				  console.log(list);
				  
                 //alert('storage name: '+list[0].name());      
               //console.log("list: ");
			   //console.log(list);
			   var plainList=new Array();
				for(var i=0;i<list.length;i++){
				     var tt=new Array;
					 if(list[i].tracks().length>0){
					 for(var g=0;g<list[i].tracks().length;g++){
					   tt.push(list[i].tracks()[g]);
					  }
				      //plainList.push({name:list[i].name(),tracks:tt,length:list[i].length});
					  }
					  else {
					  
					   tt=[];
					    }
						plainList.push({name:list[i].name(),tracks:tt,length:list[i].length});
                      //console.log(list[i].tracks());
					  //console.log(list[i].name());
					  //console.log(list[i].length);
					  //console.log('plainList '+i+":");
					 // console.log(JSON.stringify(plainList[i]));
                     }				
						//console.log(JSON.stringify(plainList));
						//console.log('plainList');
						//console.log( plainList);
						localStorage.playlists=JSON.stringify(plainList);
                           
						   }
						  


var getRecords=    function(){
                           
                           return JSON.parse(localStorage.playlists);
                           
						   }
						   


		  

return {
       
        updateRecords:updateRecords,
		
		getRecords:getRecords
		
       }

});