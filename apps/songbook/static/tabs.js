var App = {
  'viewMode': 1,
  'song': null,
}

var data = {
  'meta': {},
  'notes': [{
    'length': 1,
    'value': {0:1,1:3,2:2}
  }, {
    'length': 1,
    'value': {1:1,2:2,3:2}
  }, {
    'length': 1,
    'value': {3:2, 4:2}
  }]
}

function insertNote(svg, note, pos) {
  for (var i in note['value']) {
    var newtext = document.createTextNode(note['value'][i]);
    var hNote = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    hNote.setAttribute('y', 12.5+(10*i));
    hNote.setAttribute('x', 10+(pos*40));
    hNote.setAttribute('font-family', 'Verdana');
    hNote.setAttribute('font-size', 10);
    hNote.setAttribute('fill', 'blue');
    hNote.appendChild(newtext);
    svg.appendChild(hNote);
  }

}

function insertSong() {
  var svg = document.getElementById('svgelem');
  for (var i=0;i<data['notes'].length;i++) {
    insertNote(svg, data['notes'][i], i);
  }
}

$(document).ready(function() {
  $("#play").on('click', function() {
    insertSong();
  });
  $("#view").on('change', function() {
  });
});

