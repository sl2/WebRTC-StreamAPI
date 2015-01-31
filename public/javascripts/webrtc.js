// WebRTC Stream API Demo

$(function(){
    navigator.getMedia = (  navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia ||
                            navigator.msGetUserMedia );
    
    var video = document.getElementById('camera');
    
    var canvas = document.getElementById('camera_canvas');
    var ctx = canvas.getContext('2d');
    
    var image1 = document.getElementById('camera_image1');
    var image2 = document.getElementById('camera_image2');
    var image3 = document.getElementById('camera_image3');
    
    navigator.getMedia ({ video:true, audio:true }, function(stream) {
        video.src = window.URL.createObjectURL(stream);
        
        var context = new webkitAudioContext();
        var source = context.createMediaStreamSource(stream);
        source.connect(context.destination);

    }, function(err){console.log(err);});
    
    function cameraToImage(modifyFunc,img){
        ctx.drawImage(video,0,0,400,300);
        
        var canvas_image = ctx.getImageData(0, 0, 400, 300);
        modifyFunc(canvas_image.data);
        ctx.putImageData(canvas_image, 0, 0);

        var dataURL = canvas.toDataURL("image/octet-stream");
        img.src = dataURL;
    }

    setInterval(function(){
        cameraToImage(toGlayScale, image1);
        cameraToImage(toBlackWhite, image2);
        cameraToImage(toRedNoise, image3);
    }, 200);
   
    
    //Effect function : glayscale
    function toGlayScale(pixel){
        for (var i = 0, n = pixel.length; i < n; i += 4) {
	    var gr = pixel[i  ] * 0.2 + pixel[i+1] * 0.2 + pixel[i+2] * 0.2;
	    pixel[i  ] = gr; //R
	    pixel[i+1] = gr; //G
	    pixel[i+2] = gr; //B
	}
    }
    
    //Effect function : red noise
    function toRedNoise(pixel){
        for (var i = 0, n = pixel.length; i < n; i += 4) {
	    pixel[i  ] *= Math.random()*2; //R
	    pixel[i+1] *= Math.random()*0.3; //G
	    pixel[i+2] *= Math.random()*0.3; //B
	}
    }
    
    //Effect function : black & white
    function toBlackWhite(pixel){
        for (var i = 0, n = pixel.length; i < n; i += 4) {
	    var bw = pixel[i  ] * 4 + pixel[i+1] * 4 + pixel[i+2] * 4;
	    pixel[i  ] = bw; //R
	    pixel[i+1] = bw; //G
	    pixel[i+2] = bw; //B
	}
    }
    
    $('img').click(function(){
        var dataURL = $(this).attr('src');
        var $img = $('<img>').attr('src', dataURL);
        $($img).prependTo('#snapshot');
    });

});


