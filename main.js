$(function(){
  var img = null;
  var lastUrl = null;
  var $mainForm = $("form#mainForm");

  function processImage(img){

    var dim = {
      "snes": { 
        sw: 3366,
        sh: 2100,
        dx: () => { return rotate ? -3366 : -1832 },
        dy: 0,
        dw: () => { return rotate ? 2100 : 1534 },
        dh: () => { return rotate ? 1534 : 2100 }
       },
      "neogeocd": {
        sw: 3225,
        sh: 2156,
        dx: () => { return rotate ? -3225 : -1520 },
        dy: 0,
        dw: () => { return rotate ? 2156 : 1705 },
        dh: () => { return rotate ? 1705 : 2156 }
       },
       "genesismegadrive": {
        sw: 3366,
        sh: 2100,
        dx: () => { return rotate ? -3366 : -1835 },
        dy: 0,
        dw: () => { return rotate ? 2156 : 1520 },
        dh: () => { return rotate ? 1520 : 2156 }
       }
    }

    var system = dim[$("#system").val()];

    var rotate = $("#rotate").prop("checked")
    var c = document.createElement('canvas');
    c.id = "mainCanvas";
    c.width = system.dw();
    c.height = system.dh();
    var ctx = c.getContext('2d');
    if(rotate){
      ctx.save();
      ctx.rotate(-90*Math.PI/180);
      ctx.drawImage(img, system.dx(), system.dy, system.sw, system.sh);
      ctx.restore();
    } else {
      ctx.drawImage(img, system.dx(), system.dy, system.sw, system.sh);
    }
    $("#mainImage").attr("src", c.toDataURL('image/png'));
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
