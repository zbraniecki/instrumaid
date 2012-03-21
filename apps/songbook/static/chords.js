var App = {
  'viewMode': 1,
  'song': null,
  'data': null,
  'expand': true,
}

var charSize = {'height': 18, 'width': 8.4};
var lineLength = 80;

var data = [
  [['a', 0], ['G', 10], ['a', 15]],
  [['a', 0], ['e', 10]],
  [['a', 0], ['e', 10], ['a', 20]],
  [['d', 0], ['e', 10], ['a', 20]]
]

var song = {
  'meta': {
    'title': "Mona",
    'author': "Unknown",
  },
  'lyrics': [
    {
      'type': 'verse',
      'lines': [
        'W grudniowy płaszcz okryta śmierć',
        'Spod czarnych nieba zeszła chmur.',
        'Przy brzegu konał smukły bryg',
        'Na pomoc "Mona" poszła mu.'
      ]
    },
    {
      'type': 'verse',
      'lines': [
        'Gdy przyszedł sygnał każdy z nich',
        'Wpół dojedzonej strawy dzban',
        'Porzucił, by na przystań biec,',
        'Wyruszyć w ten dziki z morzem tan!'
      ]
    },
    {
      'type': 'ref',
      'lines': [
        'Był pięćdziesiąty dziewiąty rok.',
        'Pamiętam ten grudniowy dzień',
        'Gdy ośmiu mężczyzn zabrał sztorm',
        'Gdzieś w oceanu wieczny cień.'
      ]
    },
  ]
};

function getCharWidth() {
  var line = $("<span/>", {
    'class': 'line',
  }).appendTo($("<p/>", {
    'class': 'verse',
  }).appendTo($("<div/>", {
    'class': 'song test',
  }).appendTo($("body"))));
  line.text((new Array(lineLength+1)).join("a"));
  var width = line.width()/lineLength;
  $(".song.test").remove();
  return width;
}

function setChordOverlay(hSong, data) {
  if (App.viewMode == 1)
    setChordOverlay1(hSong, data)
  else if (App.viewMode == 2)
    setChordOverlay2(hSong, data)
}

function setChordOverlay1(hSong, data) {
  var verses = $('.verse, .refrain', hSong);
  for (var v=0; v<verses.length; v++) {
    var lines = $('.line', verses[v]);

    var chordBlock = data[v];
    if (!chordBlock.length) {
      chordBlock = data[v-2];
    }
    
    if (App.expand) {
      var counter = 0;
      for (var i=0; i<lines.length; i++) {
        if (counter > chordBlock.length-1)
          counter = 0;
        var chords = chordBlock[counter++];
        for (var c in chords) {
          var chord = chords[c];
          setChord($(lines[i]), chord);
        }
      }
    } else {
      for (var i in data[v]) {
        var line = data[v][i];
        for (var j in line) {
          var chord = line[j];
          setChord($(lines[i]), chord);
        }
      }
    }
  }
}

function getLongestLine(verse) {
  var lines = $('.line', verse);
  var res = 0;
  for (var i=0;i<lines.length;i++) {
    var len = $(lines[i]).text().length;
    if (len>res)
      res = len;
  }
  return res;
}

function setChordOverlay2(hSong, data) {
  var verses = $('.verse, .ref', hSong);
  var longest = getLongestLine(hSong);
  for (var v=0;v<verses.length;v++) {
    var lines = $('.line', verses[v]);

    var chords = [];
    for (var i in data[v]) {
      chords[i] = [];
      for (var j in data[v][i]) {
        chords[i].push(data[v][i][j][0]);
      }
    }
    for (var i=0;i<lines.length;i++) {
      var pos = $(lines[i]).offset();
      var width = $(lines[i]).width();
      var cl = chords[i].join(' ');
      var hChord = $('<div/>', {
        'class': 'chord',
      }).text(cl);
      hChord.offset({'top': pos.top, 'left': pos.left+(longest*charSize.width)+10});
      hChord.appendTo(hSong);
    }
  }
}

function setChord(line, c) {
  var pos = line.offset();
  var chord = $('<div/>', {
    'class': 'chord',
  }).appendTo(line);
  chord.text(c[0]);
  chord.offset({'top':pos.top-charSize.height, 'left': pos.left+(charSize.width*c[1])}); 
}

function insertSong(song) {
  var hSong = $("<div/>", {
    'class': 'song'
  });
  for (var i in song['lyrics']) {
    var lVerse = song['lyrics'][i];
    var hVerse = $("<p/>", {
      'class': lVerse['type']
    });
    for (var j in song['lyrics'][i]['lines']) {
      var hLine = $("<span/>", {
        'class': 'line'
      });
      hLine.text(song['lyrics'][i]['lines'][j]);
      hLine.appendTo(hVerse);
      hVerse.append('<br/>');
    }
    hVerse.appendTo(hSong);
  }
  hSong.appendTo($("body"));
  return hSong;
}

function clearChords() {
  $(".chord").remove();
}

function loadFile(path) {
  $.ajax({
    url: path,
    success: function(data) {
      $(this).addClass("done");
      parseChords(data);
    }
  });
}

function parseChords(data) {
  var reader = new Reader();
  reader.text = data;
  var crd = reader.parse();
  $("#src").val(JSON.stringify(crd, null, '\t'));
  getSongFromAST(crd);
}

function getSongFromAST(ast) {
  var data = [];

  var song = {
    'meta': {
      'title': "Mona",
      'author': "Unknown",
    },
    'lyrics': [],
  };
  var newBlock = true;
  var lastBlock = -1;
  var lineType = null;
  var lastData = null;
  for (var i=0;i<ast.length;i++) {
    if (ast[i]['type'] != 'chords' && lineType != ast[i]['type']) {
      lineType = ast[i]['type'];
      newBlock = true;
    }
    if (lineType && newBlock) {
      song['lyrics'].push({
        'type': lineType,
        'lines': []
      });
      data.push([]);
      lastBlock += 1;
      newBlock = false;
    }
    if (ast[i]['type'] == 'chords') {
      lastData = ast[i]['content'];
    } else {
      song['lyrics'][lastBlock]['lines'].push(ast[i]['content']);
      if (lastData)
        data[lastBlock].push(lastData);
      lastData = null
    }
  }
  App.song = insertSong(song);
  App.data = data;
  setChordOverlay(App.song, App.data); 
  $("#src2").val(JSON.stringify(song, null, '\t'));
  $("#src3").val(JSON.stringify(data, null, '\t'));
}

$(document).ready(function() {
  $("#play").on('click', function() {
    charSize.width = getCharWidth();
    loadFile("/static/song.crd");
  });
  $("#view").on('change', function() {
    if (App.viewMode == $('#view').val())
      return;
    App.viewMode = $("#view").val();
    clearChords();
    setChordOverlay(App.song, App.data)
  });

  $("#expand").on('change', function() {
    if (App.expand == $('#expand').val())
      return;
    App.expand = $("#expand").val()=='true'?true:false;
    clearChords();
    setChordOverlay(App.song, App.data)
  });

});
