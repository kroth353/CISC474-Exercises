$(document).ready(function() {
    console.log( "ready!" );
    $('#go').click(function(){
        var fname = $('fname').val();
        var lname = $('lname').val();
        $('#jumbotron').text(fname + " "+ lname);
    })
});