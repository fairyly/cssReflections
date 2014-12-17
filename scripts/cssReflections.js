/*global window:false */

"use strict";

var startApp, appLogic, domLib;


startApp = {
    init: function () {
        appLogic.init();
    }
};

appLogic = {
    imageList: [],
    locationList: [],
    imageData: {},
    imageIndex: 0,
    nextControl: null,
    prevControl: null,
    playControl: null,
    pauseControl: null,
    timerVar: null,

    init: function () {
        var i, whichElement, createImageNodes;
        createImageNodes = function createImageNodes() {
            //create the template
            var i, initialDiv, imageFrame, titleSpan, dateSpan, docFrag, newDiv;

            initialDiv = document.createElement("div");
            initialDiv.setAttribute("class", "photoComp");
            imageFrame = document.createElement("img");
            imageFrame.setAttribute("class", "imageFrame");
            titleSpan = document.createElement("span");
            titleSpan.setAttribute("class", "photoTitle");
            dateSpan = document.createElement("span");
            dateSpan.setAttribute("class", "photoDate");
            initialDiv.appendChild(imageFrame);
            initialDiv.appendChild(titleSpan);
            initialDiv.appendChild(dateSpan);

            //clone the template and insert
            //use a document fragment to minimise dom walking
            docFrag = document.createDocumentFragment();
            for (i = 0; i <= 5; i += 1) {
                newDiv = initialDiv.cloneNode(true);
                newDiv.setAttribute("id", "image" + i);
                docFrag.appendChild(newDiv);
            }
            domLib.byId("myImages").insertBefore(docFrag, domLib.byId("controls"));
        };

        this.locationList = ["photoComp withFocus", "photoComp atRight",
            "photoComp atFarRight", "photoComp atBack", "photoComp atFarLeft", "photoComp atLeft"];

        createImageNodes();

        for (i = 0; i <= 5; i += 1) {
            whichElement = domLib.byId("image" + i);
            this.imageList.push(whichElement);
        }
        this.buildImageData();

        // initialise the bits
        this.setImageData();
        // (domLib.byId("myImages")).addEventListener("click", function(e){
        //     console.log(e);
        // }, true);
        this.playControl = domLib.byId("play");
        this.pauseControl = domLib.byId("pause");
        this.nextControl = domLib.byId("next");
        this.prevControl = domLib.byId("previous");
        this.playControl.addEventListener("click", appLogic.togglePlayback);
        this.pauseControl.addEventListener("click", appLogic.togglePlayback);
        this.nextControl.addEventListener("click", appLogic.nextImage);
        this.prevControl.addEventListener("click", appLogic.previousImage);
        // put the items where they're supposed to be
        for (i = 0; i <= 5; i += 1) {
            this.imageList[i].className = this.locationList[i];
        }
        // quick hack to prevent the bounce on iOS
        document.addEventListener("touchmove", function(e) {
            e.preventDefault();
        });
    },

    setImageData: function () {
        var i, targetElement, targetData, imageFrame;
        for (i = 0; i <= 5; i += 1) {
            targetElement = this.imageList[i];
            targetData = this.imageData[i];
            imageFrame = targetElement.firstElementChild;
            imageFrame.setAttribute("src", targetData.src);
            imageFrame.nextElementSibling.innerHTML = targetData.title;
            imageFrame.nextElementSibling.nextElementSibling.innerHTML = targetData.date;
        }
    },

    reposition: function () {
        var i, moveIndex;

        for (i = 0; i <= 5; i += 1) {
            moveIndex = domLib.modPos((i - appLogic.imageIndex), 6);
            appLogic.imageList[i].className = appLogic.locationList[moveIndex];
        }
    },

    nextImage: function () {
        if (appLogic.imageIndex < 5) {
            appLogic.imageIndex += 1;
        } else {
            appLogic.imageIndex = 0;
        }
        appLogic.reposition(true);
    },

    previousImage: function () {
        if (appLogic.imageIndex > 0) {
            appLogic.imageIndex -= 1;
        } else {
            appLogic.imageIndex = 5;
        }
        appLogic.reposition(false);
    },

    togglePlayback: function (e) {
        var whichControl;

        function toggleControls() {
            (domLib.hasClass(appLogic.playControl, "hidden")) ?
                domLib.removeClass(appLogic.playControl, "hidden") :
                    domLib.addClass(appLogic.playControl, "hidden");
            (domLib.hasClass(appLogic.pauseControl, "hidden")) ?
                domLib.removeClass(appLogic.pauseControl, "hidden") :
                    domLib.addClass(appLogic.pauseControl, "hidden");
        }

        function fadeOutManualControls() {
            var hideControls = function hideControls() {
                domLib.addClass(appLogic.nextControl, "hidden");
                domLib.addClass(appLogic.prevControl, "hidden");
                appLogic.nextControl.removeEventListener("transitionend", hideControls, false);
            };
            appLogic.nextControl.style.opacity = 0;
            appLogic.prevControl.style.opacity = 0;
            appLogic.nextControl.addEventListener("transitionend", hideControls, false);
        }

        function fadeUpManualControls() {
            var showControls = function showControls() {
                appLogic.nextControl.style.opacity = 1;
                appLogic.prevControl.style.opacity = 1;
            };
            domLib.removeClass(appLogic.nextControl, "hidden");
            domLib.removeClass(appLogic.prevControl, "hidden");
            setTimeout(showControls, 0);
        }

        whichControl = e.target;

        toggleControls();

        if (whichControl === appLogic.playControl) {
            appLogic.timerVar = setInterval(function () {
                appLogic.nextImage();
            }, 1500);
            fadeOutManualControls();
        } else {
            clearInterval(appLogic.timerVar);
            fadeUpManualControls();
        }
    },

    buildImageData: function () {
        this.imageData = [
            {
                title: "Funkstrum at night",
                date: "3rd November 2009",
                src: "assets/photos/funkstrum.jpg"
            },
            {
                title: "Babylon Kino",
                date: "3rd November 2009",
                src: "assets/photos/kino.jpg"
            },
            {
                title: "Sold already",
                date: "3rd November 2009",
                src: "assets/photos/aufgekauft.jpg"
            },
            {
                title: "Dom at night",
                date: "3rd November 2009",
                src: "assets/photos/berlinerDom.jpg"
            },
            {
                title: "Ampelman",
                date: "3rd November 2009",
                src: "assets/photos/ampelman.jpg"
            },
            {
                title: "Oude Oost",
                date: "3rd November 2009",
                src: "assets/photos/meermacht.jpg"
            }
        ];
    }
};

domLib = {
    addLoadEvent: function (aFunc) {
        var oldOnload = window.onload;
        if (typeof window.onload !== "function") {
            window.onload = aFunc;
        } else {
            window.onload = function () {
                oldOnload();
                aFunc();
            };
        }
    },

    byId: function (aId) {
        return document.getElementById(aId);
    },

    modPos: function (aNumber, aModulus) {
        var ret = aNumber % aModulus;
        if (ret < 0) {
            ret += aModulus;
        }
        return ret;
    },

    // adds a class to an element
    addClass: function (elem, className) {
        if (!domLib.hasClass(elem, className)) {
            var cl = "" + elem.className;
            elem.className += (cl.length > 0 ? " " : "") + className;
        }
    },

    // removes a class from an element
    removeClass: function (elem, className) {
        if (domLib.hasClass(elem, className)) {
            var reg = new RegExp("(\\s|^)" + className + "(\\s|$)");
            elem.className = elem.className.replace(reg, " ");
        }
    },

    // does elem have a class?
    hasClass: function (elem, className) {
        var reg = new RegExp("(^|\\s)" + className + "(\\s|$)");
        return reg.test(elem.className);
    }
};

domLib.addLoadEvent(startApp.init);
