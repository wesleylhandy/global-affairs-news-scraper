$(document).ready(function(){

	//Materialize Page Elements
	$(".button-collapse").sideNav();
	$('.modal').modal();

	//set date in footer
	var d = new Date();
	var year = d.getFullYear();
	$("#year").text(year);

});