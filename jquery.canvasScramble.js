(function($){
  $.fn.canvasScramble = function(options) {
    var start = new Date();

    //generate a coordinate list of pixel data for each pixel in the source image
    var generateCoordinatePairs = function(width, height) {
      var randomCoords = {};

      var globalCounter = 0;
      var loopCounter = 0;
      for(var i=0; i<width; i++) {
        if(loopCounter < width) {
          for(var j=0; j<height; j++) {
            randomCoords[globalCounter] = [i,j];
            globalCounter++;
          }
          loopCounter++

        } else {
          loopCounter = 0;
          for(var j=0; j<height; j++) {
            randomCoords[globalCounter] = [i,j];
            globalCounter++;
          }
          loopCounter++;
        }
      }
      return randomCoords;
    };

    //randomly shuffle an array
    var shuffle = function(array) {
      var currentIndex = array.length, temporaryValue, randomIndex ;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    };

    //generate a static list of random numbers
    var generateRandomIndex = function(limit){
      var globalIndex = [];
      for(var i=0;i<limit;i++) {
        globalIndex.push(i);
      }
      return shuffle(globalIndex);
    }

    console.log(this)

    $.each(this, function(i, img){
      $img = $(img);

      //wrap each image in <div class="canvasScramble" id="canvasScramble0">
      var wrapper = $("<div>").attr({
        id:"canvasScramble"+i,
        class:"canvasScramble"
      });
      $img.hide().wrap(wrapper);
      $img.detach();

      //create the input and output canvases
      var canvas = document.createElement('canvas');
          canvas.setAttribute('id', 'input');
          canvas.setAttribute('width', this.width);
          canvas.setAttribute('height', this.height);

      var output = document.createElement('canvas');
          output.setAttribute('id', 'output');
          output.setAttribute('width', this.width);
          output.setAttribute('height', this.height);

      var totalPixels = this.width * this.height;

      //instantiate the canvases
      var ctx = canvas.getContext('2d');
      var outputCtx = output.getContext('2d');

      //dump the original image into the input canvas
          ctx.drawImage(img,0,0,this.width,this.height);

      //create a list of every pixel in the source canvas
      //do the same for the output canvas
        //create a random list of indexes that will be used to iterate through
        //each pixel in the input and output canvases
      var randomInputCoords = generateCoordinatePairs(this.width, this.height);
      var randomOutputCoords = generateCoordinatePairs(this.width, this.height);
      var randomInputIndex = generateRandomIndex(totalPixels);
      var randomOutputIndex = generateRandomIndex(totalPixels);

      for(var j = 0; j<totalPixels; j++) {
        //using the randomized list of indexes, select the first pixel
        var randomInput = randomInputCoords[randomInputIndex[j]];
        var randomInputX = randomInput[0] +1;
        var randomInputY = randomInput[1] +1;

        //using the randomized output list of indees, select the first output pixel
        var randomOutput = randomOutputCoords[randomOutputIndex[j]];
        var randomOutputX = randomOutput[0];
        var randomOutputY = randomOutput[1];

        //read the random input canvas pixel, output to the random output canvas pixel
        var v1 = randomInputX, v2 = randomInputY, v3 = randomOutputX, v4 = randomOutputY;
        var imageData = ctx.getImageData(v1,v2,1,1);
        var outputCtx = output.getContext('2d');
            outputCtx.putImageData(imageData, v3, v4, 0, 0, 1, 1);
      }

      if(options && options.hasOwnProperty("displayInput") && (options.displayInput === true)) {
        //attach the rendered input canvas to the DOM
        $("#canvasScramble"+i).append(canvas);
      }

      //attach the rendered output canvas to the DOM
      $("#canvasScramble"+i).append(output);

      if(options && options.hasOwnProperty("debug") && (options.debug === true)) {
        var time = new Date() - start;
        console.log(time/1000 + " seconds to process #canvasScramble" + i);
      }

    }); //end each

  } //end $.fn.canvasScramble

})(jQuery);
