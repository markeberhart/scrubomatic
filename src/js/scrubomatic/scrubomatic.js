/*
SCRUB-O-MATIC
ver 0.0.1
Created By: Mark Eberhart
Last Updated: March 14, 2017
*/

! function () {

    scrubomatic = {
        version: '0.0.1',
        options: {
            divId: 'scrubomatic',
            width: 400,
            height: 400,
            btnWidth:30,
            btnHeight:30,
            insidePadding: 25,
            totalNumImages:100,
            startImageNum:0,
            imagesUrl:'',
            scrollPixelsPerImage:5,
            percentImagesToShow:0.5,
            backgroundColor: 'rgba(25,255,255,0.5)'
        },
        elements: {},
        variables: {}
    }

    scrubomatic.create = function (options) {

        if (!options) {
            this.options = this.options;
        } else {
            this.options = options;
        }

        this.buildElements();

        this.variables.scrub = {
            current: {x: 0},
            last: {x: 0}
        }

        scrubomatic.defineMouseActions();
        scrubomatic.defineAnimationVariables();
        scrubomatic.loadImagesToAnimate();
        scrubomatic.correspondPixelsToImages();


    }


    scrubomatic.defineMouseActions = function(){
        this.variables.mouseDown = false;

        this.elements.scrubBtn.onmousedown = function (e) {
            scrubomatic.variables.mouseDown = true;
            scrubomatic.variables.scrub.origin = scrubomatic.elements.scrubomatic.offsetLeft;
            scrubomatic.variables.scrub.last.x = scrubomatic.elements.scrubBtn.offsetLeft + scrubomatic.elements.scrubomatic.offsetLeft;
            //console.log(scrubomatic.variables.scrub.last.x);
            return false;
        }

        this.elements.scrubomatic.onmousemove = function (e) {
            if (scrubomatic.variables.mouseDown === true) {
                scrubomatic.variables.scrubOffset = (parseInt(scrubomatic.elements.scrubBtn.style.width, 10)*1);
                scrubomatic.variables.timeWidth = parseInt(scrubomatic.elements.scrubTimeline.style.width, 10);
                //console.log(scrubomatic.variables.scrubOffset);

                if (e.clientX < scrubomatic.elements.scrubomatic.offsetLeft) {
                  scrubomatic.variables.newPosition = 0;//scrubomatic.variables.scrub.origin;// - (scrubomatic.variables.scrubOffset*2);
                }else if(e.clientX > (scrubomatic.variables.scrub.origin + scrubomatic.variables.timeWidth-scrubomatic.variables.scrubOffset)) {
                  scrubomatic.variables.newPosition = scrubomatic.variables.timeWidth-scrubomatic.variables.scrubOffset;
                }else{
                  scrubomatic.variables.newPosition = e.clientX-scrubomatic.variables.scrub.origin;
                }

                scrubomatic.elements.scrubBtn.style.left = scrubomatic.variables.newPosition + 'px';
                scrubomatic.variables.scrub.last.x        = e.clientX;

                scrubomatic.turnOffAllFrames();
                //console.log(scrubomatic.variables.pixelsArray[scrubomatic.variables.newPosition]);
                scrubomatic.variables.pixelsArray[scrubomatic.variables.newPosition].turnOn();

            }

        }

        this.elements.scrubomatic.onmouseup = function (e) {
            scrubomatic.variables.mouseDown = false;
        };
    }

    scrubomatic.buildElements = function () {
        this.elements.scrubBtn = document.createElement("div");
        this.elements.scrubBtn.setAttribute("id", "scrub");
        this.elements.scrubBtn.style.left = 0;
        this.elements.scrubBtn.style.width = this.options.btnWidth + 'px';
        this.elements.scrubBtn.style.height = this.options.btnHeight + 'px';

        this.elements.scrubTimeline = document.createElement("div");
        this.elements.scrubTimeline.setAttribute("id", "timeline");

        this.elements.scrubomatic = document.getElementById(this.options.divId);
        this.elements.scrubomatic.setAttribute("id", "scrubomatic");
        this.elements.scrubomatic.style.width = this.options.width + 'px';
        this.elements.scrubomatic.style.height = this.options.height + 'px';
        //this.elements.scrubomatic.style.padding = this.options.insidePadding + 'px';
        this.elements.scrubomatic.style.backgroundColor = this.options.backgroundColor;
        this.elements.scrubomatic.style.position = 'relative';
        this.elements.scrubomatic.appendChild(this.elements.scrubTimeline);
        this.elements.scrubTimeline.appendChild(this.elements.scrubBtn);
        this.elements.scrubTimeline.style.width = String(this.options.width) + 'px';
    }

    scrubomatic.turnOffAllFrames = function(){
        for(_f in this.variables.framesObject){
            this.variables.framesObject[_f].setAttribute("style", "visibility:hidden");
        }
    }

    scrubomatic.defineAnimationVariables = function(){
        this.variables.currPixel = 0;
        this.variables.newPosition = 0;
        this.variables.pixelsArray = [];
        this.variables.framesObject = {};
        this.variables.totalFrames = this.options.totalNumImages;
        this.variables.startFrame = this.options.startImageNum;
        this.variables.pixelsPerFrame = this.options.scrollPixelsPerImage;
        this.variables.pixelsToRemoveFromTimeWidth = 0;
        this.variables.timeWidth = this.options.width-this.variables.pixelsToRemoveFromTimeWidth;
        this.variables.percentImageFramesToShow = this.options.percentImagesToShow;
        this.variables.numFramesToShowPotential = this.variables.totalFrames*this.variables.percentImageFramesToShow;
        this.variables.frameSkipCnt = Math.round(this.variables.totalFrames/this.variables.numFramesToShowPotential);
        this.variables.numFramesPerAnimation = Math.round(this.variables.totalFrames/this.variables.frameSkipCnt);
        this.variables.numPixelsPerAnimation = this.variables.pixelsPerFrame*this.variables.numFramesPerAnimation;
        this.variables.numAnimations = Math.ceil(this.variables.timeWidth/this.variables.numPixelsPerAnimation);
    }

    scrubomatic.getImageNameFromFrameNum = function(num){
        var s = num+"";
        while (s.length < this.options.imageNumLength) s = "0" + s;
        var _url = this.options.imagesUrl.replace('{imgNum}',s);
        var _obj = {
            image:_url,
            number:s,
            frame:num
        }
        return _obj
    }

    scrubomatic.loadImagesToAnimate = function(){
        for(i=0;i<=this.variables.totalFrames;i+=this.variables.frameSkipCnt){
            //console.log(i,getImageNameFromFrameNum(i));
            this.elements.img = document.createElement("img");
            this.elements.img.setAttribute("class","frame");
            this.elements.img.setAttribute("height", this.options.height);
            this.elements.img.setAttribute("width", this.options.width);
            this.elements.img.setAttribute("style", "visibility:hidden"); //visible
            this.elements.img.setAttribute("source",scrubomatic.getImageNameFromFrameNum(i));
            this.elements.img.src = scrubomatic.getImageNameFromFrameNum(i).image;
            this.elements.img.onload = function() {
                scrubomatic.elements.scrubomatic.appendChild(this);
            };
            this.variables.framesObject[scrubomatic.getImageNameFromFrameNum(i).number] = this.elements.img;
            //this.elements.frame =
        }
    }

    scrubomatic.correspondPixelsToImages = function(){
        for(a=0;a<this.variables.numAnimations;a++){
            this.variables.currFrame = 0;
            this.variables.currAnimPixel = 0;
            //console.log("          -------> img ",getImageNameFromFrameNum(_currFrame));
            for(p=0;p<=this.variables.numPixelsPerAnimation;p++){

                if(this.variables.currAnimPixel>=this.variables.pixelsPerFrame){
                    this.variables.currFrame =this.variables.currFrame+this.variables.frameSkipCnt;
                    //console.log("          -------> img ",getImageNameFromFrameNum(_currFrame));
                    this.variables.currAnimPixel = 0;
                }

                this.variables.pixelsArray.push({
                    pixel:this.variables.currPixel,
                    image:this.getImageNameFromFrameNum(this.variables.currFrame).image,
                    frame:this.variables.framesObject[this.getImageNameFromFrameNum(this.variables.currFrame).number],
                    turnOn:function(){
                        this.frame.setAttribute("style", "visibility:visible");
                    },
                    turnOff:function(){
                        this.frame.setAttribute("style", "visibility:hidden");
                    }
                })
                this.variables.currPixel++;
                this.variables.currAnimPixel++;
            }
        }
        this.variables.pixelsArray[0].turnOn();
    }

}();
