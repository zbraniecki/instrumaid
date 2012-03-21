var Reader = function() {
}

Reader.prototype = {
  text: null,
  parse: function() {
    var crd = [];
    var token;
    //this.getWS();
    while (token = this.getToken()) {
      switch(token['type']) {
        case 'directive':
          break;
        case 'chord':
          break;
        case 'lyrics':
          crd.push(token);
          break;
        case 'ws':
          break;
      }
    }
    return crd;
  },
  getToken: function() {
    if (!this.text.length)
      return false;
    if (this.text[0] == '[')
      return this.getChord();
    else if (this.text[0] == '{')
      return this.getDirective();
    else
      return this.getLyrics();
  },
  getWS: function() {
    var res = /^\s+/g.exec(this.text);
    if (!res)
      return;
    this.text = this.text.substr(res[0].length);
  },
  getLyrics: function() {
    var ptr = 0;
    var len = this.text.length;
    while (ptr < len && this.text[ptr] != '[' && this.text[ptr] != '{')
      ptr += 1;
    var buffer = this.text.substr(0, ptr)
    this.text = this.text.substr(ptr);
    return {'type': 'lyrics', 'content': buffer}
  }
}
