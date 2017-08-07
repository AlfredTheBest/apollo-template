
var staticTpl = function (str, data) {

  var element = document.getElementById(str);
  if (element) {
    var html = /^(textarea|input)$/i.test(element.nodeName) ? element.value : element.innerText;
    console.log(html);
    return tplEngine(html, data);
  } else {
    return tplEngine(str, data);
  }

}

function tplEngine(tpl, data) {
    var reg = /<%([^%>]+)?%>/g,
        regOut = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,
        code = 'var r=[];\n',
        cursor = 0;

    var add = function(line, js) {
        js? (code += line.match(regOut) ? line + '\n' : 'r.push(' + line + ');\n') :
            (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
        return add;
    }
    while(match = reg.exec(tpl)) {
        add(tpl.slice(cursor, match.index))(match[1], true);
        cursor = match.index + match[0].length;
    }
    add(tpl.substr(cursor, tpl.length - cursor));
    code += 'return r.join("");';
    return new Function(code.replace(/[\r\t\n]/g, '')).apply(data);
};

window.staticTpl = staticTpl;
