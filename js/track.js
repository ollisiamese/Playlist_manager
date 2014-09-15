define(['knockout','jquery'],function(ko){

//a Track (song) constructor 

return function track(data){
    if(data.album.images[2]){
	this.image=data.album.images[2].url;
	}
	else {
	this.image="img/No_Image_Available.gif";
	}
	this.trackName=data.name;
    this.album=data.album.name;
	this.artist=data.artists[0].name;
	this.durMs=data.duration_ms;
	
	if(Math.round(Math.floor((data.duration_ms/1000-(data.duration_ms/1000)/60))/10)>9){
    
	this.duration=Math.floor((data.duration_ms/1000)/60)+':'+Math.round(Math.floor((data.duration_ms/1000-(data.duration_ms/1000)/60))/10);
    }
	
	else {
	
	this.duration=Math.floor((data.duration_ms/1000)/60)+':0'+Math.round(Math.floor((data.duration_ms/1000-(data.duration_ms/1000)/60))/10);
	}
	this.uri=data.uri;
  }

});