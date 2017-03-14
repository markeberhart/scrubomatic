# scrubomatic
Javascript library for animating a directory of still images with a scrubber button

Basic Usage:

<link rel="stylesheet" href="./src/js/scrubomatic/scrubomatic.css">

<div id="scrubomatic"></div>

<script src="./src/js/scrubomatic/scrubomatic.js"></script>

<script>
    var _scrubomatic = scrubomatic.create({
        totalNumImages:36,
        startImageNum:0,
        scrollPixelsPerImage:5,
        imagesUrl:'./src/images/solar/animation_{imgNum}.png',
        imageNumLength:3,
        divId:'scrubomatic',
        width:400,
        height:400,
        btnWidth:30,
        btnHeight:30,
        insidePadding:25,
        percentImagesToShow:0.95,
        backgroundColor:'rgba(25,255,255,0.5)'
    })
</script>
