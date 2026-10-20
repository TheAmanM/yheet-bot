const returnVal = '<br>Tell A.L.I.C.E:<br><form method="POST" name="f"><input type="HIDDEN" name="botcust2" value="f6f3143cbf802f18"><table border="0" cellspacing="0"><tbody><tr><td><input type="TEXT" autocomplete="off" name="message" size="60"></td><td>&nbsp;</td><td><input type="SUBMIT" value="Say"></td></tr><tr><td align="right" valign="top"><font size="-1"><i>Powered by <a href="http://www.pandorabots.com" target="_blank">Pandorabots</a>.</i></font></td></tr></tbody></table></form><br><b>Human:</b> how are you? <br><b>A.L.I.C.E:</b> My logic and cognitive functions are normal. <br><br><b>Human:</b> hello <br><b>A.L.I.C.E:</b> Hi there! <br>'

// console.log(returnVal.indexOf('<b>'))
let currentString = returnVal.substring(returnVal.indexOf('<b>') + 3);
currentString = currentString.substring(currentString.indexOf('<b>') + 3);
currentString = currentString.substring(14);

currentString = currentString.substring(0, currentString.indexOf('<br>'));
currentString = currentString.trim();

console.log(currentString);