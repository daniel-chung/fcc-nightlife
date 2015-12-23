// /app/controllers/yelpController.client.js
'use strict';

// Set up ----------------------------------------------------------------------
var appUrl = window.location.origin;


// jQuery main entry -----------------------------------------------------------
$(document).ready(function() {
  // Variables used by multiple functions
  var rsvpButtonVal = '';

  // Helper functions to add bar cards ------------------------------------ //
  function getRsvpCounter(bd, callback) {
    $.get(appUrl+"/api/fetch/"+bd.id, function(data) {
      var counterVal = data.rsvps;
    // Fire off the callback after getting rsvp count
      if (typeof callback === 'function') {
        callback(bd, counterVal);
      }
    });
  };

  function appendBarCard(bd, ct) {
    $('.search-results').append(
        '<div class="bar-card">'+
          '<div class="bar-img-wrapper">'+
            '<img class="bar-img" src="'+bd.img+'">'+
          '</div>'+
          '<div class="bar-text">'+
            '<div class="bar-text-topline">'+
              '<div class="bar-name-div">'+
                '<a href="'+bd.link+'" target="_blank" class="bar-link">'+
                  '<span class="bar-name">'+bd.name+'</span>'+
                '</a>'+
              '</div> &nbsp; &nbsp;'+
              '<div class="rsvp-counter-div">'+
                '<button id="rsvp" class="'+bd.id+'">'+
                  '<span id="rsvp-counter">'+String(ct)+'</span>'+
                  ' going'+
                '</button>'+
              '</div>'+
            '</div>'+
            '<br>'+
            '<span class="bar-snippet">'+bd.snippet+'</span>'+
          '</div>'+
        '</div>'
    );
  };

  function showBusiness(obj) {
    var barData = {
      id      : obj.id,
      name    : obj.name,
      link    : obj.url,
      img     : obj.image_url,
      snippet : obj.snippet_text,
    };
    getRsvpCounter(barData, appendBarCard);
  };

  function loadBusiness(searchTerm) {
    console.log(searchTerm);
    $.get(appUrl+"/api/search/"+searchTerm, function(data) {
      $('.search-results').html('');
      var results = data.businesses; // yelp search results, n=20
      for (var i=0; i<results.length; i++) {
        showBusiness(results[i]);
      }
    });
  }


  // Load search if there is a local storage item ------------------------- //
  if (localStorage.getItem('yelp-search')) {
    var searchTerm = localStorage.getItem('yelp-search');
    loadBusiness(searchTerm);
    $('#yelp-search input:text').val(searchTerm.replace(/\+/, ' '));
    localStorage.removeItem('yelp-search');
  }
  else {
    $('#yelp-search input:text').val('');
  }


  // Form: Search on yelp ------------------------------------------------- //
  $('#yelp-search').on('submit', function(e) {
    e.preventDefault(); // Don't reload the page
  // Extract form value & send a get request to the API
    var searchTerm = $('form').serializeArray()[0].value.replace(/\s/, '+');
    loadBusiness(searchTerm);
  });


  // Button: RSVP link ---------------------------------------------------- //
  $('.search-results').on('click', '#rsvp', function() {
    var yId = $(this).attr('class');
    $.get(appUrl+"/api/rsvp/"+yId, function(data) {
      if (data.login) {
        rsvpButtonVal = '<span id="rsvp-counter">'+data.rsvps+'</span> going';
      }
      else {
      // Set the session to store the current search value for after auth
        var yelpLocation = $('form').serializeArray()[0].value.replace(/\s/, '+');
        localStorage.setItem('yelp-search', yelpLocation);
      // Authenticate Twitter login
        var root = window.location.origin;
        window.location.replace(root + '/auth/twitter');
      }
    });
  });


  // jQuery sugar --------------------------------------------------------- //
  $(".search-results").on('mouseenter', '#rsvp', function() {
    rsvpButtonVal = $(this).html();
    $(this).html('click to RSVP');
    $(this).css({
      'color': '#62CDF0',
      'background-color': '#642f62',
      'border': '1px solid #642f62',
      'font-style': 'italic',
    });
  });
  $(".search-results").on('mouseleave', '#rsvp', function() {
    $(this).html(rsvpButtonVal);
    $(this).css({
      'color': 'black',
      'background-color': '#DDDDDD',
      'border': '1px solid #000000',
      'font-style': 'normal',
    });
    rsvpButtonVal = '';
  });


});


// EOF -------------------------------------------------------------------------
