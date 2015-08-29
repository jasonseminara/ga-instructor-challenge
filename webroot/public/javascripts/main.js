$(function(){

  // global ref to the results div
  var $results      = $('#results');
  var $fullDetails  = $('#moreinfo');
  var omdbURL       = 'http://www.omdbapi.com/';

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
    $.each( results, function(i, item) {
      $('<tr>').append(
        $('<td>').append(
          $('<a>', {
            title: "Click to see more details about this movie.",
            href:'#',
            class:'moreinfo',
            'data-imdbID': item.imdbID 
          }).text(item.Title)
        ),
        $('<td>').text(item.Year),
        $('<td>').append(
          $('<a>', {
            title: "Favorite this title",
            href: "/favorite/" + item.imdbID 
          }).text("Add to favorites")
        )
      ).appendTo($target);
    });
  }

  // build the details section
  var showDetails = function(data,$target){
    
    // make a new table
    $table = $('<table>')
    
    $target
      .empty()
      .append($table)

    $.each( data, function(key, val) {
      $('<tr>').append(
        $('<th>').text(key),
        $('<td>').text(val)
      ).appendTo($table)
      //console.log(key,val);
    })
  }

  // Hide results DRY because we 
  var hideResults = function(e){
    $results.hide()
    $fullDetails.hide()
  }

  // when typing in the search box
  $('#search')

    // hide the results when the user clears or clicks the search field
    .on('click',hideResults)
  
    // react to each keystroke
    .on('keyup',function(e){
      //console.log(e)
      var searchTerm = $(this).val();
      switch(e.keyCode){
        
        // enter
        case 13:
          $.get(omdbURL,{s:searchTerm,type:'movie'},function(data){
            showResults(data,$results.find('tbody'));
          })
          break;
        
        // bkspc  
        case 8:
          hideResults()
          break;
      }
      
    })

  // click to see more about a title  
  $results.on('click','a.moreinfo',function(e){
    
    $fullDetails.empty()
    $fullDetails.show()


    $infoLink = $(e.target)
    
    // Go back to omdb to get extended info for this title.
    $.get( omdbURL,
      { 
        /* the link has a data attribute of data-imdbid */
        i:$infoLink.data('imdbid'),
        type:'movie',
        plot:'full'
      },
      function(data){
        showDetails(data,$fullDetails);
      }
    )
    // we don't want the event to propagate beyond this handler. Make it stop here. 
    e.preventDefault()
    e.stopPropagation();
  })

})