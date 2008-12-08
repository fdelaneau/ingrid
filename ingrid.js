var ingrid = function()
{
  // console.log("ingrid !");
  // These are used when no coockie is defined
  var params = {
    grid:  {
      defineWith:  "p",
      width:       960,
      cols:        3,
      subcols:     5,
      gutter:      5,
      align:       "c",
      marginLeft:  0,
      marginRight: 0
    },
    baseline: {
      lineHeight:  18,
      marginTop:   0
    },
    display: {
      grid:     "none",
      baseline: "none",
      hub:      "block"
    }
  };
  

  var lastPressedKey = {};
  
  var isMsie = (navigator.userAgent.toLowerCase().search(/msie/) != -1 && navigator.userAgent.toLowerCase().search(/opera/) == -1)?true:false;
  
  var turnBackColor = {pageWidth: 0, columnWidth: 0, subcolumnWidth: 0}

  var checkParams = function()
  {
    // We save the previous params
    var oldParams = {};
    var formLoaded = document.getElementById("ingrid-form");
    for (var i in params)
    {
      if (params.hasOwnProperty(i))
      {
        oldParams[i] = {};
        for (var j in params[i])
        {
          if (params[i].hasOwnProperty(j))
          {
            oldParams[i][j] = params[i][j];
          }
        }
      }
    }
    if (formLoaded)
    {
      var fieldsetList = formLoaded.getElementsByTagName("FIELDSET");
      var fieldsetName = "";
      for (i = fieldsetList.length - 1; i >= 0; i--)
      {
        fieldsetName = fieldsetList[i].id.replace(/ingrid-fieldset-/, "");
        var inputList = fieldsetList[i].getElementsByTagName("INPUT");
        for (j = inputList.length - 1; j >= 0; j--)
        {
          switch (inputList[j].getAttribute("type"))
          {
            case "text":
              if (inputList[j].value.length === 0 || isNaN(inputList[j].value) || inputList[j].value < 0)
              {
                inputList[j].value = 0;
              }
              params[fieldsetName][inputList[j].name] = parseInt(inputList[j].value, 10);
              variousTools.setCookie("syncotype"+fieldsetName+"["+inputList[j].name+"]", params[fieldsetName][inputList[j].name], 365);
              break;
            case "checkbox":
              params[fieldsetName][inputList[j].name] = (inputList[j].checked)?"block":"none";
              variousTools.setCookie("syncotype"+fieldsetName+"["+inputList[j].name+"]", params[fieldsetName][inputList[j].name], 365);
              break;
          }
        }
        var selectList = fieldsetList[i].getElementsByTagName("SELECT");
        for (j = selectList.length - 1; j >= 0; j--)
        {
          params[fieldsetName][selectList[j].name] = selectList[j].value;
          variousTools.setCookie("syncotype" + fieldsetName + "[" + selectList[j].name + "]", params[fieldsetName][selectList[j].name], 365);
        }
      }
    }
    else
    {
      //We pick the parameters registred in coockie, or we take some default one if they doesn't exsist
      for (var i in params)
      {
        if (params.hasOwnProperty(i))
        {
          var fieldset = params[i];
          for (var j in fieldset)
          {
            if (fieldset.hasOwnProperty(j))
            {
              if (variousTools.getCookie("syncotype"+i+"["+j+"]") !== null)
              {
                params[i][j] = variousTools.getCookie("syncotype"+i+"["+j+"]");
              }
              if (i !== "display" && j !== "defineWith" && j !== "align")
              {
                params[i][j] = parseInt(params[i][j], 10);
              }
            }
          }
        }
      }
    }
    if (params.grid.cols == 0)
    {
      params.grid.cols = 1;
      if (document.getElementById("ingrid-number"))
      {
        document.getElementById("ingrid-number").value = params.grid.cols;
      }
      variousTools.setCookie("syncotypegrid[cols]", params.grid.cols, 365);
    }
    
    // console.log("params", params);
    switch (params.grid.defineWith)
    {
      case "c":
        var pageWidth   = params.grid.width * params.grid.cols + (params.grid.cols - 1) * params.grid.gutter;
        var colWidth    = params.grid.width;
        var subcolWidth = (params.grid.subcols > 0)?colWidth / params.grid.subcols - (params.grid.subcols - 1) * params.grid.gutter / params.grid.subcols:0;
        break;
      case "p":
        var pageWidth   = params.grid.width;
        var colWidth    = (params.grid.width - (params.grid.cols - 1) * params.grid.gutter ) / params.grid.cols;
        var subcolWidth = (params.grid.subcols > 0)?colWidth / params.grid.subcols - (params.grid.subcols - 1) * params.grid.gutter / params.grid.subcols:0;
        if ((colWidth < 0 || subcolWidth < 0) && !!formLoaded)
        {
          var divPageWidth = document.getElementById("ingrid-pageWidth");
          divPageWidth.innerHTML = "-";
          divPageWidth.style.color = "#900";

          var divColumnWidth = document.getElementById("ingrid-columnWidth");
          divColumnWidth.innerHTML = "-";
          divColumnWidth.style.color = "#900";

          var divSubcolumnWidth = document.getElementById("ingrid-subcolumnWidth");
          divSubcolumnWidth.innerHTML = "-";
          divSubcolumnWidth.style.color = "#900";

          var divSubcolumnWidth = document.getElementById("ingrid-subcolumnWidth");
          divSubcolumnWidth.innerHTML = "-";
          divSubcolumnWidth.style.color = "#900";

          var inputWidth = document.getElementById("ingrid-width");
          inputWidth.style.backgroundColor = "#900";

          return [];
        }
        break;
    }
    
    // As there's no error, let's hide the red stuffs
    if (formLoaded)
    {
      if (document.getElementById("ingrid-pageWidth").style.color == "#900")
      {
        document.getElementById("ingrid-pageWidth").style.color = "#fff";
      }
      if (document.getElementById("ingrid-columnWidth").style.color == "#900")
      {
        document.getElementById("ingrid-columnWidth").style.color = "#fff";
      }
      if (document.getElementById("ingrid-subcolumnWidth").style.color == "#900")
      {
        document.getElementById("ingrid-subcolumnWidth").style.color = "#fff";
      }
      document.getElementById("ingrid-width").style.backgroundColor = "#222";
    }
    
    // We check if the public params have been changed
    var modifiedParams = [];
    var fieldsetModified;
    for (i in params)
    {
      if (params.hasOwnProperty(i))
      {
        fieldsetModified = false;
        for (j in params[i])
        {
          if (params[i].hasOwnProperty(j))
          {
            if (typeof oldParams[i][j] == "undefined" || oldParams[i][j] != params[i][j])
            {
              fieldsetModified = true;
            }
          }
        }
        if (fieldsetModified)
        {
          modifiedParams[modifiedParams.length] = i;
        }
      }
    }

    return modifiedParams;
  };

  var resetTableColor = function()
  {
    var now = new Date();
    now = now.getTime();
    for (var i in turnBackColor)
    {
      if (turnBackColor.hasOwnProperty(i))
      {
        if (turnBackColor[i] > 0 && turnBackColor[i] <= now)
        {
          document.getElementById("ingrid-"+i).style.color = "#fff";
          turnBackColor[i] = 0;
        }
      }
    }
  }

  var variousTools = {
    addEvent: function(elm, evType, fn, useCapture)
    {
      // ByScott Andrew : http://www.scottandrew.com/weblog
      if (elm.addEventListener)
      {
        elm.addEventListener(evType, fn, useCapture);
        return true;
      }
      else if (elm.attachEvent)
      {
        var r = elm.attachEvent("on"+evType, fn);
        return r;
      }
      else
      {
        elm["on"+evType] = fn;
      }
    },
    deleteNode: function(node)
    {
      while (node.hasChildNodes())
      {
        variousTools.deleteNode(node.firstChild);
      }
      node.parentNode.removeChild(node);
    },
    getCookie: function(name)
    {
      //by Dustin Diaz : http://www.dustindiaz.com/top-ten-javascript/
      var start = document.cookie.indexOf(name + "=");
      var len = start + name.length + 1;
      if (!start && name != document.cookie.substring(0, name.length))
      {
        return null;
      }
      if (start == -1) {return null; }
      var end = document.cookie.indexOf(';', len);
      if (end == -1) {end = document.cookie.length; }
      return document.cookie.substring(len, end);
    },
    setCookie: function(name, value, expires, path, domain, secure)
    {
      //by Dustin Diaz : http://www.dustindiaz.com/top-ten-javascript/
      var today = new Date();
      today.setTime(today.getTime());
      if (expires)
      {
        expires = expires * 1000 * 60 * 60 * 24;
      }
      var expires_date = new Date(today.getTime() + (expires));
      document.cookie = name+"="+value +
        ((expires)?";expires="+expires_date.toGMTString() : "")+
        ((path)?";path="+ path : "")+
        ((domain)?";domain="+domain:"")+
        ((secure)?";secure":"");
    },
    deleteCookie: function(name, path, domain)
    {
      //by Dustin Diaz : http://www.dustindiaz.com/top-ten-javascript/
      if (getCookie(name))
      {
        document.cookie = name+"="+((path)?";path="+path:"")+((domain)?";domain="+domain : "")+";expires=Thu, 01-Jan-1970 00:00:01 GMT";
      }
    }
  };

  var fixTheGridPosition = function()
  {
    var intWidth   = document.body.offsetWidth;
    var intHeight  = (typeof window.innerHeight != "undefined")? window.innerHeight : (document.documentElement && document.documentElement.clientHeight > 0)? document.documentElement.clientHeight : document.body.clientHeight;
    var intXScroll = (typeof window.pageXOffset != "undefined")? window.pageXOffset : document.body.scrollLeft;
    var intYScroll = (typeof window.window.pageYOffset != "undefined")? window.window.pageYOffset : (document.documentElement && document.documentElement.scrollTop > 0)? document.documentElement.scrollTop : document.body.scrollTop;
    var offsetLeft = intWidth / 2 - params.grid.pageWidth / 2;
    document.getElementById("ingrid").style.height = intHeight + intYScroll + "px";
    var ingridDivs = document.getElementById("ingrid").getElementsByTagName("DIV");
    if (ingridDivs.length)
    {
      for (var i = ingridDivs.length - 1; i >= 0; i--)
      {
        ingridDivs[i].style.height = intHeight + intYScroll + "px";
      }
    }
    switch (params.grid.align)
    {
      case "l":
        document.getElementById("ingrid").style.left = parseInt(params.grid.marginLeft, 10) + "px";
        document.getElementById("ingrid").style.right = "auto";
        break;
      case "r":
        document.getElementById("ingrid").style.left = "auto";
        document.getElementById("ingrid").style.right = parseInt(params.grid.marginRight, 10) + "px";
        break;
      case "c":
        document.getElementById("ingrid").style.left = parseInt(params.grid.marginLeft - params.grid.marginRight + offsetLeft, 10) + "px";
        break;
    }
  };

  var gridDraw = function()
  {
    if(document.getElementById("ingrid"))
    {
      variousTools.deleteNode(document.getElementById("ingrid"));
    }
    //Insertion of the grid
    if (params.grid.cols > 0)
    {
      switch (params.grid.defineWith)
      {
        case "c":
          params.grid.pageWidth   = params.grid.width * params.grid.cols + (params.grid.cols - 1) * params.grid.gutter;
          params.grid.colWidth    = params.grid.width;
          break;
        case "p":
          params.grid.pageWidth   = params.grid.width;
          params.grid.colWidth    = (params.grid.width - (params.grid.cols - 1) * params.grid.gutter ) / params.grid.cols;
          break;
      }
      params.grid.subcolWidth = (params.grid.subcols > 0)?params.grid.colWidth / params.grid.subcols - (params.grid.subcols - 1) * params.grid.gutter / params.grid.subcols:0;
      var now = new Date();
      now = now.getTime()+500;
      var colorChanged = false;
      var divPageWidth = document.getElementById("ingrid-pageWidth");
      if (divPageWidth)
      {
        if (Math.round(params.grid.pageWidth) != divPageWidth.innerHTML.replace(/px/, ""))
        {
          divPageWidth.style.color = "#ff0";
          turnBackColor.pageWidth = now;
          colorChanged = true;
        }
        divPageWidth.innerHTML = Math.round(params.grid.pageWidth)+"px";
      }
      var divColumnWidth = document.getElementById("ingrid-columnWidth");
      if (divColumnWidth)
      {
        if (Math.round(params.grid.colWidth) != divColumnWidth.innerHTML.replace(/px/, ""))
        {
          divColumnWidth.style.color = "#ff0";
          turnBackColor.columnWidth = now;
          colorChanged = true;
        }
        divColumnWidth.innerHTML = Math.round(params.grid.colWidth)+"px";
      }
      var divSubcolumnWidth = document.getElementById("ingrid-subcolumnWidth");
      if (divSubcolumnWidth)
      {
        if (Math.round(params.grid.subcolWidth) != divSubcolumnWidth.innerHTML.replace(/px/, ""))
        {
          divSubcolumnWidth.style.color = "#ff0";
          turnBackColor.subcolumnWidth = now;
          colorChanged = true;
        }
        divSubcolumnWidth.innerHTML = Math.round(params.grid.subcolWidth)+"px";
      }
      
      if (colorChanged)
      {
        setTimeout(resetTableColor, 600);
      }
      
      var divinGrid = document.createElement("div");
      divinGrid.setAttribute("id", "ingrid");
      divinGrid.style.display = params.display.grid;
      divinGrid.style.width = params.grid.pageWidth+"px";
      for (var i = 0; i < params.grid.cols; i++)
      {
        var divCol = document.createElement("div");
        divCol.style.width = params.grid.colWidth+"px";
        var leftPosition = parseInt(i * (parseInt(params.grid.colWidth, 10) + parseInt(params.grid.gutter, 10)), 10);
        divCol.style.left = i * (parseInt(params.grid.colWidth, 10) + parseInt(params.grid.gutter, 10))+"px";
        if (params.grid.subcols > 0)
        {
          for (var j = 0; j < params.grid.subcols; j++)
          {
            var subDivCol = document.createElement("div");
            subDivCol.style.width = params.grid.subcolWidth+"px";
            subDivCol.style.left = (leftPosition + j * (params.grid.subcolWidth + params.grid.gutter))+"px";
            divinGrid.appendChild(subDivCol);
          }
        }
        divinGrid.appendChild(divCol);
      }
      document.getElementsByTagName("body")[0].appendChild(divinGrid);
    }
    fixTheGridPosition();
  };
  
  var baselineDraw = function()
  {
    if(document.getElementById("ingrid-baseline"))
    {
      variousTools.deleteNode(document.getElementById("ingrid-baseline"));
    }
    var divBaseline = document.createElement("div");
    divBaseline.setAttribute("id", "ingrid-baseline");
    divBaseline.style.display = params.display.baseline;
    var scrollHeight = document.body.scrollHeight;
    divBaseline.style.height = scrollHeight;
    for (i = params.baseline.marginTop; i < scrollHeight; i += params.baseline.lineHeight)
    {
      var div = document.createElement("div");
      div.style.top             = i + "px";
      divBaseline.appendChild(div);
    }
    document.body.appendChild(divBaseline);
  };


  return (
    function()
    {
      /*
      var link = document.createElement("link");
      link.setAttribute("rel",   "stylesheet");
      link.setAttribute("type",  "text/css");
      link.setAttribute("media", "screen");
      link.setAttribute("href",  "ingrid.css");
      // link.setAttribute("href",  "http://fdelaneau.com/ingrid/ingrid.css");
      document.getElementsByTagName("HEAD")[0].appendChild(link);
      */
      var style = document.createElement("style");
      style.setAttribute("type",  "text/css");
      style.setAttribute("media", "screen");
      var cssContent = document.createTextNode('#ingrid-form,#ingrid-baseline,#ingrid-grid,#ingrid-form div,#ingrid-baseline div,#ingrid-grid div,#ingrid-form span,#ingrid-form h1,#ingrid-form p,#ingrid-form strong,#ingrid-form small,#ingrid-form ol,#ingrid-form li,#ingrid-form form,#ingrid-form fieldset,#ingrid-form label,#ingrid-form legend,#ingrid-form table,#ingrid-form caption,#ingrid-form tbody,#ingrid-form tfoot,#ingrid-form thead,#ingrid-form tr,#ingrid-form th,#ingrid-form td{clear:none;float:none;position:static;margin:0;padding:0;border:0;outline:0;font-weight:normal;font-style:normal;font-size:100%;font-family:inherit;vertical-align:baseline;color:#fff;background:none;font:12px/18px "Lucida Grande",Lucida,Arial,Helvetica,sans-serif}#ingrid-form,#ingrid-baseline,#ingrid-grid,#ingrid-form div,#ingrid-baseline div,#ingrid-grid div,#ingrid-form h1,#ingrid-form p,#ingrid-form ol,#ingrid-form li,#ingrid-form form,#ingrid-form fieldset,#ingrid-form legend,#ingrid-form table{display:block}#ingrid-form span,#ingrid-form strong,#ingrid-form small,#ingrid-form label{display:inline}#ingrid-form{ position:fixed !important;position:absolute;top:0;left:0;width:260px;background:#111;-moz-border-radius-bottomright:10px;-webkit-border-bottom-right-radius:10px;z-index:1001}#ingrid-form h1{float:left;width:100%}#ingrid-form h1 a{float:left;width:100%;padding:15px 0;margin:0 0 10px;text-decoration:none;background:#222}#ingrid-form h1 a:hover{text-decoration:none;background:#76a61d}#ingrid-form h1 strong{float:left;margin:0 15px;font:16px Georgia,"Times New Roman",Times,serif}#ingrid-form h1 strong small{font-size:10px}#ingrid-form h1 span{float:right;margin:0 15px;color:#333;font-size:10px;text-decoration:none}#ingrid-form fieldset{clear:both;border:none;padding:15px 0;margin:0 20px}#ingrid-form legend{color:#666}#ingrid-form ol{list-style:none}#ingrid-form li{clear:left;margin:0 0 10px}#ingrid-form label{display:-moz-inline-box;display:inline-block}#ingrid-form .ingrid-align label{width:100px}#ingrid-form label small{font-size:10px;color:#333}#ingrid-form input{width:40px;border:none;background:#222;text-align:center;color: #fff}#ingrid-form input[type=checkbox]{ background:none}#ingrid-form input:focus,#ingrid-form input:active{outline:none;border-color:#999;background:#333}#ingrid-form select{border:1px solid #666;background:#222;color:#fff}#ingrid-form #ingrid-fieldset-display input{width:auto}#ingrid-form #ingrid-start-with{margin:0 5px}#ingrid-form #ingrid-fieldset-grid table{border-collapse:separate;border-spacing:0;text-align:left;width:100%;margin:0 0 15px;padding-bottom:10px;border-bottom:1px solid #333}#ingrid-form #ingrid-fieldset-grid table th,#ingrid-form #ingrid-fieldset-grid table td{width:33%}#ingrid-form #ingrid-fieldset-grid table th{color:#666;font-size:10px}#ingrid-form #ingrid-fieldset-grid table td{color:#fff;font-size:14px}#ingrid-fieldset-baseline,#ingrid-fieldset-display{}#ingrid-fieldset-display span,#ingrid-fieldset-display p{font-size:10px;color:#666}#ingrid-fieldset-display span em,#ingrid-fieldset-display p em{font-size:10px;color:#fff}#ingrid-fieldset-display p em{font-weight:bold}#ingrid{position:fixed !important;position:absolute;top:0;left:0;z-index:1000}#ingrid div{position:absolute;top:0;left:0;background-color:#f00;opacity:0.2;filter:alpha(opacity=20)}#ingrid-baseline{ position:absolute; top:0; left:0; width:100%; height:100%}#ingrid-baseline div{ position:absolute; left:0; width:100%; height:1px; background-color:#f00; opacity:.5; filter:alpha(opacity=50); font-size:0; overflow:hidden}');
      style.appendChild(cssContent);
      document.getElementsByTagName("HEAD")[0].appendChild(style);
      

      checkParams();
      gridDraw();
      baselineDraw();

      //Insertion of the form
      var formSource = '<h1><a href="http://ui-studio.fr"><strong>inGrid <small>v1.0</small></strong> <span>by UI Studio</span></a></h1>' +
      '<fieldset id="ingrid-fieldset-grid">' +
      '<legend>Columns</legend>' +
      '<table cellspacing="0">' +
      '<thead>' +
      '<tr>' +
      '<th>page</th>' +
      '<th>column</th>' +
      '<th>sub-column</th>' +
      '</tr>' +
      '<thead>' +
      '<tbody>' +
      '<tr>' +
      '<td id="ingrid-pageWidth">'+Math.round(params.grid.pageWidth)+'px</td>' +
      '<td id="ingrid-columnWidth">'+Math.round(params.grid.colWidth)+'px</td>' +
      '<td id="ingrid-subcolumnWidth">'+Math.round(params.grid.subcolWidth)+'px</td>' +
      '</tr>' +
      '</tbody>' +
      '</table>' +
      '<ol>' +
      '<li>' +
      '<label for="ingrid-start-with">define <small>px</small></label>' +
      '<select id="ingrid-start-with" name="defineWith">' +
      '<option '; if (params.grid.defineWith == "c"){formSource += 'selected="selected" ';} formSource += 'value="c">column width</option>' +
      '<option '; if (params.grid.defineWith == "p"){formSource += 'selected="selected" ';} formSource += 'value="p">page width</option>' +
      '</select>' +
      '<input type="text" id="ingrid-width" name="width" value="'+params.grid.width+'">' +
      '</li>' +
      '<li class="ingrid-align">' +
      '<label for="ingrid-number">columns <small>#</small></label>' +
      '<input type="text" id="ingrid-number" name="cols" value="'+params.grid.cols+'">' +
      '</li>' +
      '<li class="ingrid-align">' +
      '<label for="ingrid-subset">sub-columns <small>#</small></label>' +
      '<input type="text" id="ingrid-subset" name="subcols" value="'+params.grid.subcols+'">' +
      '</li>' +
      '<li class="ingrid-align">' +
      '<label for="ingrid-gutter">gutter <small>px</small></label>' +
      '<input type="text" id="ingrid-gutter" name="gutter" value="'+params.grid.gutter+'">' +
      '</li>' +
      '<li class="ingrid-align">' +
      '<label for="ingrid-align">align</label>' +
      '<select id="ingrid-align" name="align">' +
      '<option '; if (params.grid.align == "l"){formSource += 'selected="selected" ';} formSource += 'value="l" >left</option>' +
      '<option '; if (params.grid.align == "c"){formSource += 'selected="selected" ';} formSource += 'value="c">center</option>' +
      '<option '; if (params.grid.align == "r"){formSource += 'selected="selected" ';} formSource += 'value="r">right</option>' +
      '</select>' +
      '</li>' +
      '<li class="ingrid-align">' +
      '<label for="ingrid-margin-left">margin left <small>px</small></label>' +
      '<input type="text" id="ingrid-margin-left" name="marginLeft" value="'+params.grid.marginLeft+'">' +
      '</li>' +
      '<li class="ingrid-align">' +
      '<label for="ingrid-margin-right">margin right <small>px</small></label>' +
      '<input type="text" id="ingrid-margin-right" name="marginRight" value="'+params.grid.marginRight+'">' +
      '</li>' +
      '</ol>' +
      '</fieldset>' +
      '<fieldset id="ingrid-fieldset-baseline">' +
      '<legend>Baseline</legend>' +
      '<ol>' +
      '<li class="ingrid-align">' +
      '<label for="ingrid-line-height">line-height <small>px</small></label>' +
      '<input type="text" id="ingrid-line-height" name="lineHeight" value="'+params.baseline.lineHeight+'">' +
      '</li>' +
      '<li class="ingrid-align">' +
      '<label for="ingrid-margin-top">margin top <small>px</small></label>' +
      '<input type="text" id="ingrid-margin-top" name="marginTop" value="'+params.baseline.marginTop+'">' +
      '</li>' +
      '</ol>' +
      '</fieldset>' +
      '<fieldset id="ingrid-fieldset-display">' +
      '<legend>Display</legend>' +
      '<ol>' +
      '<li class="checkbox">' +
      '<label for="ingrid-display-grid"><input type="checkbox" id="ingrid-display-grid" '; if(params.display.grid == "block"){formSource += 'checked="checked" ';} formSource += 'name="grid"> Display grid <span>or press <em>g</em> twice</span></label>' +
      '</li>' +
      '<li class="checkbox">' +
      '<label for="ingrid-display-baseline"><input type="checkbox" id="ingrid-display-baseline" '; if(params.display.baseline == "block"){formSource += 'checked="checked" ';} formSource += 'name="grid"> Display baseline <span>or press <em>b</em> twice</span></label>' +
      '</li>' +
      '</ol>' +
      '<p>To hide / show this panel press <em>p</em> twice.</p>';
      '</fieldset>';
      var form = document.createElement("form");
      form.setAttribute("id", "ingrid-form");
      form.style.display = params.display.hub
      form.innerHTML = formSource;
      document.getElementsByTagName("body")[0].appendChild(form);
      
      
      checkParams();
      
      variousTools.addEvent(window, "resize", fixTheGridPosition, false); 

      if (isMsie === true && navigator.userAgent.toLowerCase().search(/msie 6/) != -1)
      {
        variousTools.addEvent(window, "scroll", fixTheGridPosition, false);
      }
      var checkForm = function()
      {
        var modified = checkParams();
        if (modified.length > 0)
        {
          for (var i = modified.length - 1; i >= 0; i--)
          {
            switch (modified[i])
            {
              case "grid":
                gridDraw();
                break;
              case "baseline":
                baselineDraw();
                break;
            }
          }
        }
      }
      variousTools.addEvent(
        document.getElementById("ingrid-form"),
        "submit",
        function(e)
        {
          if (!e)
          {
            var e = window.event;
          }
          e.cancelBubble = true;
          if (e.stopPropagation)
          {
            e.stopPropagation();
          }
        },
        false
      );
      var elementsToObserve = [];
      var formInputs = document.getElementById("ingrid-form").getElementsByTagName("INPUT");
      for (var i = formInputs.length - 1; i >= 0; i--)
      {
        elementsToObserve[elementsToObserve.length] = formInputs[i];
      }
      var formSelects = document.getElementById("ingrid-form").getElementsByTagName("SELECT");
      for (i = formSelects.length - 1; i >= 0; i--){
        elementsToObserve[elementsToObserve.length] = formSelects[i];
      }
      for (i = elementsToObserve.length - 1; i >= 0; i--)
      {
        switch (elementsToObserve[i].nodeName)
        {
          case "SELECT":
            variousTools.addEvent(elementsToObserve[i], "change", checkForm, false);
            break;
          case "INPUT":
            switch (elementsToObserve[i].type)
            {
              case "text":
                variousTools.addEvent(
                  elementsToObserve[i],
                  "keyup",
                  function(event)
                  {
                    var target = event.target || event.srcElement;
                    if (target.nodeName.toLowerCase() == "input" && isNaN(target.value))
                    {
                      var inputValue = "";
                      for (var i=0; i < target.value.length; i++)
                      {
                        if (!isNaN(target.value[i]))
                        {
                          inputValue += target.value[i];
                        }
                      }
                      target.value = inputValue;
                    }
                    checkForm();
                  },
                  false
                );
                break;
              case "checkbox":
                variousTools.addEvent(
                  elementsToObserve[i],
                  "click",
                  function(event)
                  {
                    var target = event.target || event.srcElement;
                    var name = target.id.replace(/ingrid-display-/, "");
                    params.display[name] = (target.checked)?"block":"none";
                    var idElt = (name == "grid")?"ingrid":"ingrid-baseline";
                    document.getElementById(idElt).style.display = params.display[name];
                    variousTools.setCookie("syncotypedisplay["+name+"]", params.display[name], 365);
                  },
                  false
                );
                break;
            }
            break;
        }
      };
      variousTools.addEvent(
        (isMsie)?document.body:window, // IE needs to bind the keypress event to the body
        "keypress",
        function(e)
        {
          if(e.keyCode) // IE
          {
            keynum = e.keyCode;
          }
          else if(e.which) // Netscape/Firefox/Opera
          {
            keynum = e.which;
          }
          var now = new Date();
          if (
            typeof lastPressedKey.keynum != "undefined"
            && lastPressedKey.keynum == keynum
            && typeof lastPressedKey.pressTime != "undefined"
            && now.getTime() - lastPressedKey.pressTime < 500
          )
          {
            switch (keynum)
            {
              case 112://This is the "p" key
                if (document.getElementById("ingrid-form"))
                {
                  params.display.hub = (params.display.hub == "none")?"block":"none";
                  document.getElementById("ingrid-form").style.display = params.display.hub;
                  variousTools.setCookie("syncotypedisplay[hub]", params.display.hub, 365);
                }
                break;
              case 103://This is the "g" key
                if (document.getElementById("ingrid"))
                {
                  params.display.grid = (params.display.grid == "none")?"block":"none";
                  document.getElementById("ingrid").style.display = params.display.grid;
                  document.getElementById("ingrid-display-grid").checked = (params.display.grid == "block")?true:false;
                  variousTools.setCookie("syncotypedisplay[grid]", params.display.grid, 365);
                }
                break;
              case 98://This is the "b" key
                if (document.getElementById("ingrid-baseline"))
                {
                  params.display.baseline = (params.display.baseline == "none")?"block":"none";
                  document.getElementById("ingrid-baseline").style.display = params.display.baseline;
                  document.getElementById("ingrid-display-baseline").checked = (params.display.baseline == "block")?true:false;
                  variousTools.setCookie("syncotypedisplay[baseline]", params.display.baseline, 365);
                }
                break;
            }
          }
          lastPressedKey.pressTime = now.getTime();
          lastPressedKey.keynum = keynum;
        },
        false
      );
    })();
};
window.onload = ingrid;