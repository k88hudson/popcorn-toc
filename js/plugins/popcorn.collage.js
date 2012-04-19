// PLUGIN: IMAGE

(function ( Popcorn ) {

/**
 * Images popcorn plug-in
 * Shows an image element
 * Options parameter will need a start, end, href, target and src.
 * Start is the time that you want this plug-in to execute
 * End is the time that you want this plug-in to stop executing
 * href is the url of the destination of a anchor - optional
 * Target is the id of the document element that the iframe needs to be attached to,
 * this target element must exist on the DOM
 * Src is the url of the image that you want to display
 * text is the overlayed text on the image - optional
 *
 * @param {Object} options
 *
 * Example:
   var p = Popcorn('#video')
      .image({
        start: 5, // seconds
        end: 15, // seconds
        href: 'http://www.drumbeat.org/',
        src: 'http://www.drumbeat.org/sites/default/files/domain-2/drumbeat_logo.png',
        text: 'DRUMBEAT',
        target: 'imagediv'
      } )
 *
 */
  Popcorn.plugin( "collage", {
      manifest: {
        about: {
          name: "Popcorn capture Plugin",
          version: "0.1",
          author: "",
          website: ""
        },
        options: {
          start: {
            elem: "input",
            type: "number",
            label: "In"
          },
          end: {
            elem: "input",
            type: "number",
            label: "Out"
          },
          minsize: {
            elem: "input",
            type: "number",
            label: "Minimum size (%)",
            optional: true
          },
          maxsize: {
            elem: "input",
            type: "number",
            label: "Maximum size (%)",
            optional: true
          },
          target: "collage-container",
        }
      },
      _setup: function( options ) {

      //Capture
        function capture(collage, video, scaleFactor) {
        if(scaleFactor == null){
            scaleFactor = 1;
        }

        var w = video.videoWidth * scaleFactor;
        var h = video.videoHeight * scaleFactor;

      var x = Math.random()*(collage.width-20);
      var y = Math.random()*(collage.height-20);

        var ctx = collage.getContext('2d');
      ctx.globalAlpha = 0.1 + 0.9*Math.random();
        ctx.drawImage(video, x, y, w, h);
    } 
        
      },

      /**
       * @member image
       * The start function will be executed when the currentTime
       * of the video  reaches the start time provided by the
       * options variable
       */
      start: function( event, options ) {
        options.anchor.style.display = "inline";
      },
      frame: function( event, options ) {
        if(options.type === "collage") {
          frameCount++;
          //if(frameCount % 100 == 0) {
          if(lastTime!=time && frameCount % 100 == 0) {
            capture(canvas, video,0.1+0.1*Math.random());
            lastTime=time;
          }
          //console.log("frame!!!");
        }
      }
      end: function( event, options ) {
        options.anchor.style.display = "none";
      },
      _teardown: function( options ) {
        document.getElementById( options.target ) && document.getElementById( options.target ).removeChild( options.anchor );
      }
  });
})( Popcorn );
