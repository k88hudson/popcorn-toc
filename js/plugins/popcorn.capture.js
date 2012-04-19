// PLUGIN: words

(function (Popcorn) {

"use strict";

  var styleSheet;

  Popcorn.basePlugin( "toc" , function(options, base) {
    var popcorn,
      video,
      classes,
      container,
      canvas,
      text, node, i;
    
    //Check if the target or text not set
    if (!base.target || !options.toc) {
      return;
    }

    popcorn = this;
    video = popcorn.media;
    
    //Styles for showing/hiding
    if (!styleSheet) {
      styleSheet = document.createElement('style');
      styleSheet.setAttribute('type', 'text/css');
      styleSheet.appendChild(
        document.createTextNode(
          '.popcorn-container { display: none; }\n' +
          '.popcorn-container.active { display: block; }\n'
      ));
      document.head.appendChild(styleSheet);
    }
    
    //Container
    container = base.makeContainer();
    base.addClass(container, "popcorn-container");
    container.style.cssText = options.style || '';
    
    if (typeof options.onLoad === 'function') {
      options.onLoad(options);
    }

    //All done
    var setupMode = true;
    
     //CaptureFrame
    function captureFrame(container, video, toc, size) {
   
      //Set the width and height
      var w = video.videoWidth * size / 100;
      var h = video.videoHeight * size / 100;

      function addCanvas(toc) {
        var frameTime = toc.frameTime || toc.timestamp;
        var title = toc.title;
        var timestamp = toc.timestamp;
        //Set up each canvas space
        var newCanvas = document.createElement("canvas");
        newCanvas.setAttribute("width", w);
        newCanvas.setAttribute("height", h);
        var id = "capture-" + timestamp;
        newCanvas.id = id;
        //Set up link
        var link = document.createElement("a");
        base.addClass(link, "timestamp-link");
        link.setAttribute("href", "#" + timestamp);
        //Set up canvas
        var linkText = document.createElement("div");
        base.addClass(linkText, "title");
        linkText.innerHTML = "<h4>"+title+"</h4>";

        container.appendChild(link);
        link.appendChild(linkText);
        link.appendChild(newCanvas);
        

        //Create the link to the time in the video
        link.addEventListener("click", function(e) {
          if (setupMode == false) {
            video.style.display = "block";
            var theTimeLink = link.href.split("#")[1];
            console.log(theTimeLink);
            popcorn.currentTime(theTimeLink);
            popcorn.play();
          }
        }, false);

        //Create the image creator event, which runs if allDone is false.
        popcorn.on("seeked", function() {
          if (popcorn.currentTime() === frameTime && setupMode == true) {
            console.log(frameTime);
            var ctx = document.getElementById(id).getContext('2d');
            ctx.drawImage(video, 0, 0, w, h);
            newCanvas.style.opacity = 1;
          }
        });

      } //addCanvas

      //Put a marker at the end of the table of contents to help end the setupMode
      toc[toc.length] = "complete";

      //Create each grab
      Popcorn.forEach(toc, function(item, key){
          if(key != toc.length - 1) {
            addCanvas(item);
          } 

          setTimeout(function() {
            if(key == toc.length - 1) {
              //All done creating ToC, setupMode should be false now.
              setupMode = false;
              popcorn.currentTime(0);
            } else if (item.frameTime){
              popcorn.currentTime(item.frameTime);
            } else {
              popcorn.currentTime(item.timestamp);
            }
          }, 200 * key)
      });
    } //CaptureFrame

    //Set up the screenshots
    container.innerHTML = "<h2>" + options.text + "</h2>";
    popcorn.on('durationchange', function() {
      captureFrame(container, video, options.toc, options.size);
    });

    return {
      start: function( event, options ) {
        base.addClass(base.container, 'active');
      },
      frame: function( event, options, time ) {
        
      },
      end: function( event, options ) {
        base.removeClass(base.container, 'active');
      },
      _teardown: function ( options ) {
        console.log('teardown');
      }
     
    }; 
  });
}( Popcorn ));
