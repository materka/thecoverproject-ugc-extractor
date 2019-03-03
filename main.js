$(function(){
  var img = null;
  var lastUrl = null;
  var $mainForm = $("form#mainForm");

  var systemDimensions = {
    "snes": { 
      sw: 3366,
      sh: 2100,
      dx: (rotate) => { return rotate ? -3366 : -1832 },
      dy: 0,
      dw: (rotate) => { return rotate ? 2100 : 1534 },
      dh: (rotate) => { return rotate ? 1534 : 2100 }
     },
    "neogeocd": {
      sw: 3225,
      sh: 2156,
      dx: (rotate) => { return rotate ? -3225 : -1687 },
      dy: 0,
      dw: (rotate) => { return rotate ? 2154 : 1538 },
      dh: (rotate) => { return rotate ? 1538 : 2154 }
     },
     "genesismegadrive": {
      sw: 3366,
      sh: 2100,
      dx: (rotate) => { return rotate ? -3366 : -1835 },
      dy: 0,
      dw: (rotate) => { return rotate ? 2156 : 1520 },
      dh: (rotate) => { return rotate ? 1520 : 2156 }
     }
  }

  function processImage(img){
    var rotate = $("#rotate").prop("checked")
    var system = systemDimensions[$("#system").val()];
    var c = document.createElement('canvas');
    c.id = "mainCanvas";
    c.width = system.dw(rotate);
    c.height = system.dh(rotate);
    var ctx = c.getContext('2d');
    if(rotate){
      ctx.save();
      ctx.rotate(-90*Math.PI/180);
      ctx.drawImage(img, system.dx(rotate), system.dy, system.sw, system.sh);
      ctx.restore();
    } else {
      ctx.drawImage(img, system.dx(), system.dy, system.sw, system.sh);
    }
    $("#mainImage").attr("src", c.toDataURL('application/octet-stream'));
    $mainForm.removeClass("loading").addClass("loaded");
  }

  $mainForm.on("submit", function(e) {
    e.preventDefault();

    var url = $("#url").val();

    if (url == lastUrl && img !== null) {
      processImage(img);
      return
    }

    if(!url.match(/^https?:\/\/www\.thecoverproject\.net\/download_cover\.php/i)){
      alert('Invalid URL.\n\nExample: http://www.thecoverproject.net/download_cover.php?file=n64_007-worldisnotenough.jpg')
      return;
    }
    
    $mainForm.addClass("loading");
    img = new Image;
    img.crossOrigin = "Anonymous";
    img.onload = function(e){
      try {
        processImage(img)
      } catch(err) {
        alert(err.message)
      }
    }
    img.onerror = function(err){
      alert('There was an error loading the image.')
    }
    img.src = url;

  })
})
