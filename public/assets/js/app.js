$(document).ready(function(){





	// Grab the articles as a json
	$.getJSON("/articles", function(data) {
	  // For each one
	  for (var i = 0; i < data.length; i++) {
	    // Display the apropos information on the page
	    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
	  }
	});


	//Materialize Page Elements
	$(".button-collapse").sideNav();

	//set date in footer
	var d = new Date();
	var year = d.getFullYear();
	$("#year").text(year);

});