$(function(){

  // global ref to the results div
  var $results = $('#results');

  // hide the results by default
  $results.hide();

  // what should we do when the data comes back from the server?
  var showResults = function(data,$target){

    // clear out the data in the results' body area
    $target.empty()

    // show the results field if it's hidden
    $results.show()

    // fn to sort the movie results by year, and then title
    var results = data.Search.sort(function (a,b) {
      return (a.Year===b.Year) 
        ? a.title > b.title 
        : a.Year > b.Year;
    })

    // iterate through the results and create a table row from each movie
    $.each(results, function(i, item) {
      $('<tr>').append(
        $('<td>').text(item.Title),
        $('<td>').text(item.Year),
        $('<td>').append(
          $("<a>", {
            title: "Favorite this title",
            href: "/favorite/" + item.imdbID 
          }).text("Add to favorites")
        )
      ).appendTo($target);
    });
  }


  // when typing in the search box
  $('#search')
    // hide the results when the user clears or clicks the search field
    .on('click',function(e){
      $results.hide()
    })
    // react to each keystroke
    .on('keyup',function(e){
      //console.log(e)
      var searchTerm = $(this).val();
      switch(e.keyCode){
        
        // enter
        case 13:
          $.get('http://www.omdbapi.com/',{s:searchTerm,type:'movie'},function(data){
            showResults(data,$results.find('tbody'));
          })
          break;
        
        // bkspc  
        case 8:
          $results.hide()
          break;
      }
      
    })


})