

var myAjax = {
	loginPost: function(id, callback){
		console.info("loginPost");
		console.info(VueResource);
		console.info(id);
	}
};

if ( typeof window !== "undefined") {
	window.userAjax = myAjax;
}

