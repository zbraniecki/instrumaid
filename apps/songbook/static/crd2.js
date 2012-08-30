var Reader = function() {
}

Reader.prototype = {
  text: null,
  patterns: {
    'chord': /^(\s*)([CDEAGHBF][bm]?)(?![a-zA-Z])/,
    'ws': /^\s+/g,
  },
  lineType: 'verse',
  parse: function() {
    var crd = [];
    var lines = this.text.split('\n');
    var newBlock = false;

    for(var i=0;i<lines.length-1;i++) {
      var line = this.getLine(lines[i], newBlock);
      if (line) {
        crd.push(line);
        if (line['type'] != 'chords')
          newBlock = false;
      } else {
        newBlock = true;
      }
    }
    return crd;
  },
  trim: function(txt) {
    return txt.replace(/^\s*/, "")
  },
  getLine: function(line, newBlock) {
    tLine = this.trim(line);
    if (tLine.length == 0)
      return
    if (tLine[0] == '[')
      return
    if (this.patterns['chord'].test(line))
      return this.getChordLine(line);
    else
      return this.getLyricsLine(line, newBlock);
  },
  getChordLine: function(line) {
    var chords = [];
    var pos = 0;
    while (m = line.match(this.patterns['chord'])) {
      pos += m[1].length;
      chords.push([m[2], pos]);
      pos += m[2].length;
      line = line.substr(m[0].length);
    }
    return {'type': 'chords', 'content': chords};
  },
  getLyricsLine: function(line, newBlock) {
    if (newBlock) {
      if (this.lineType == 'verse')
        this.lineType = 'refrain';
      else
        this.lineType = 'verse'; 
    }
    return {'type': this.lineType, 'content': line};
  },
}
