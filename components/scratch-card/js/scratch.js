var isMouseDown = false;
var scratchJsFlashArray = [];
function scratchJsFlashCallback(f, p, c) {
    if (typeof c !== 'undefined') {
        var counter = f;
        if (typeof counter === 'function') {
            counter(c, scratchJsFlashArray[p]);
        }
    } else {
        var callback = f;
        if (typeof callback === 'function') {
            callback(scratchJsFlashArray[p]);
        }
    }
}
function createScratchCard(init) {
    var settings = {
        topImage: new Image(),
        bottomImage: new Image(),
        coinImage: new Image(),
        thickness: 20,
        endAt: 95,
        defaultCursor: 'pointer',
        counter: false
    };
    var covered = 0;
    var update = 0;
    var counter;
    var container;
    var cWidth;
    var cHeight;
    var transparentAtStart;
    var originalWidth = 0;
    var originalHeight = 0;
    var ratio = 1;
    var touch = false;
    var limit = 10;
    var jump = 20;
    if (typeof init.resizeTrigger === 'undefined') {
        init.resizeTrigger;
    }
    if (typeof init.hasEnded === 'undefined') {
        init.hasEnded = false;
    }
    if (typeof init.width !== 'undefined' && typeof init.height !== 'undefined') {
        cWidth = init.width;
        cHeight = init.height;
    }
    if (!window.HTMLCanvasElement || init.flash == true) {
        if (typeof init.flashPath !== 'undefined') {
            if (typeof init.background != 'undefined') {
                settings.bottomImage.onload = function() {
                    var flashPlayer = document.createElement('object');
                    flashPlayer.type = 'application/x-shockwave-flash';
                    flashPlayer.data = init.flashPath;
                    if (typeof init.container !== 'undefined' && init.container.offsetWidth * init.container.offsetHeight != 0) {
                        flashPlayer.width = init.container.offsetWidth;
                        flashPlayer.height = init.container.offsetHeight;
                    } else {
                        flashPlayer.width = settings.bottomImage.width;
                        flashPlayer.height = settings.bottomImage.height;
                    }
                    var parameters = 'backgroundImage=' + init.background + '&foregroundImage=' + init.foreground;
                    var l = scratchJsFlashArray.length;
                    scratchJsFlashArray.push(init);
                    parameters += '&init=' + l;
                    if (typeof init.coin !== 'undefined') {
                        parameters += '&coin=' + init.coin;
                    } else {
                        parameters += '&cursor=' + settings.defaultCursor;
                    }
                    if (typeof init.thickness !== 'undefined') {
                        parameters += '&thickness=' + init.thickness;
                    } else {
                        parameters += '&thickness=' + settings.thickness;
                    }
                    if (typeof init.percent != 'undefined') {
                        parameters += '&percent=' + init.percent;
                    } else {
                        parameters += '&percent=' + settings.endAt;
                    }
                    if (typeof init.counter != 'undefined') {
                        parameters += '&counter=' + init.counter;
                    }
                    var flashMovie = document.createElement('param');
                    flashMovie.name = 'movie';
                    flashMovie.value = init.flashPath;
                    var flashVars = document.createElement('param');
                    flashVars.name = 'FlashVars';
                    flashVars.value = parameters;
                    var flashContent = document.createElement('param');
                    flashContent.name = 'FlashContent';
                    flashContent.value = init.flashPath;
                    var embed = document.createElement('embed');
                    embed.src = init.flashPath;
                    embed.width = flashPlayer.width;
                    embed.height = flashPlayer.height;
                    embed.type = 'application/x-shockwave-flash';
                    if (navigator.userAgent.toLowerCase().indexOf('msie') != -1) {
                        init.container.innerHTML = '<object type="application/x-shockwave-flash" data="' + init.flashPath + '" width="' + flashPlayer.width + '" height="' + flashPlayer.height + '" ><param name="movie" value="' + init.flashPath + '" /><param name="FlashVars" value="' + parameters + '" /></object>';
                    } else {
                        flashPlayer.appendChild(flashMovie);
                        flashPlayer.appendChild(flashVars);
                        flashPlayer.appendChild(flashContent);
                        flashPlayer.appendChild(embed);
                        init.container.appendChild(flashPlayer);
                    }
                    init.locked = true;
                    init.container.lock = function lock(l) {
                        if (typeof l === 'undefined') {
                            l = init.locked;
                        }
                        init.locked = !init.locked;
                        flashPlayer.lock(l);
                    }
                    init.container.restart = function() {
                        flashPlayer.restart();
                    }
                    init.container.clean = function() {
                        flashPlayer.clean();
                    }
                }
                settings.bottomImage.src = init.background;
            }
            return false;
        } else {
            container.innerHTML = 'Your browser does not support HTML5 canvas tag.';
        }
    }
    if (typeof init.container != 'undefined') {
        container = init.container;
        cWidth = container.offsetWidth;
        cHeight = container.offsetHeight;
        container.style.setProperty('position', 'relative', 'important');
        container.style.setProperty('padding', '0', 'important');
        disableSelection(container);
    } else {
        return false;
    }
    if (typeof init.background != 'undefined' && !init.hasEnded) {
        settings.bottomImage.onload = function() {
            if (cWidth != 0 && cHeight == 0) {
                originalHeight = 'auto';
                cHeight = (cWidth / settings.bottomImage.width) * settings.bottomImage.height;
                container.style.height = cHeight + 'px';
            } else if (cWidth == 0 && cHeight != 0) {
                originalWidth = 'auto';
                cWidth = (cHeight / settings.bottomImage.height) * settings.bottomImage.width;
                container.style.width = cWidth + 'px';
            }
            if ((cWidth * cHeight) == 0) {
                originalWidth = 'auto';
                originalHeight = 'auto';
                cWidth = settings.bottomImage.width;
                cHeight = settings.bottomImage.height;
                container.style.width = cWidth + 'px';
                container.style.height = cHeight + 'px';
            }
            if (typeof init.responsiveRatio == 'undefined') {
                init.responsiveRatio = cWidth / settings.bottomImage.width;
                ratio = (cWidth / settings.bottomImage.width) / init.responsiveRatio;
            } else {
                ratio = cWidth / settings.bottomImage.width;
                ratio = (cWidth / settings.bottomImage.width) / init.responsiveRatio;
            }
            overlay.width = cWidth;
            overlay.height = cHeight;
            disableSelection(overlay);
            setupScratchElements();
        }
        settings.bottomImage.src = init.background;
    } else {
        return false;
    }
    var overlay = document.createElement('canvas');
    overlay.className = 'scratchcard-Overlay';
    var overctx = overlay.getContext('2d');
    overctx.translate(0, 0);
    var cursor = document.createElement('div');
    cursor.className = 'scratchcard-Cursor';
    var cursorW = 0;
    var cursorH = 0;
    function triggerResizeFunction() {
        clearTimeout(init.resizeTrigger);
        init.resizeTrigger = setTimeout(documentResize, 100);
    }
    function documentResize() {
        window.removeEventListener('resize', documentResize);
        clear(false);
        createScratchCard(init);
    }
    function setupScratchElements() {
        if (typeof init.foreground != 'undefined' && !init.hasEnded) {
            if (init.foreground.charAt(0) === '#' && ((init.foreground.length == 4) || (init.foreground.length == 7))) {
                overctx.fillStyle = init.foreground;
                overctx.fillRect(0, 0, cWidth, cHeight);
                if (typeof init.scratchedOverlay !== 'undefined') {
                    overctx.globalCompositeOperation = 'destination-out';
                    overctx.drawImage(init.scratchedOverlay, 0, 0, cWidth, cHeight);
                }
                displayScratchcard();
            } else {
                settings.topImage.crossOrigin = 'anonymous';
                settings.topImage.src = init.foreground;
                settings.topImage.onload = function() {
                    if (typeof init.scratchedOverlay !== 'undefined') {
                        overctx.drawImage(settings.topImage, 0, 0, cWidth, cHeight);
                        overctx.globalCompositeOperation = 'destination-out';
                        overctx.drawImage(init.scratchedOverlay, 0, 0, cWidth, cHeight);
                    } else {
                        overctx.drawImage(settings.topImage, 0, 0, cWidth, cHeight);
                    }
                    displayScratchcard();
                }
                ;
            }
        } else {
            return false;
        }
        if (typeof init.percent != 'undefined') {
            settings.endAt = init.percent;
        }
        if (typeof init.coin != 'undefined') {
            settings.coinImage.src = init.coin;
            settings.coinImage.onload = function() {
                cursorW = settings.coinImage.width * ratio;
                cursorH = settings.coinImage.height * ratio;
                cursor.style.width = cursorW + 'px';
                cursor.style.height = cursorH + 'px';
                cursor.style.background = 'url("' + init.coin + '") no-repeat left top';
                cursor.style.backgroundSize = '100%';
                setCursorCssProperties();
            }
        } else {
            overlay.style.cursor = settings.defaultCursor;
        }
        if (typeof init.thickness != 'undefined') {
            settings.thickness = init.thickness;
        }
        if (typeof init.counter != 'undefined') {
            settings.counter = init.counter;
            counter = window[init.counter];
        }
        document.body.addEventListener('touchstart', function() {
            touch = true;
        }, false);
        overlay.addEventListener('mousedown', scratchOff);
        overlay.addEventListener('mousemove', scratchOff);
        document.addEventListener('mouseup', mouseOff);
        overlay.addEventListener('touchstart', scratchOff);
        overlay.addEventListener('touchmove', scratchOff);
        document.addEventListener('touchend', mouseOff);
        overlay.addEventListener('mouseover', mouseEnter);
        overlay.addEventListener('mouseout', mouseExit);
        overlay.addEventListener('mousemove', mouseMove);
    }
    function getPosition(element) {
        var xPosition = 0;
        var yPosition = 0;
        while (element) {
            xPosition += (element.offsetLeft + element.clientLeft);
            yPosition += (element.offsetTop + element.clientTop);
            element = element.offsetParent;
        }
        return {
            x: xPosition,
            y: yPosition
        };
    }
    function displayScratchcard() {
        window.addEventListener('resize', triggerResizeFunction);
        container.appendChild(overlay);
        container.appendChild(cursor);
        container.style.background = 'url("' + init.background + '") center center no-repeat';
        container.style.backgroundSize = '100%';
    }
    function setCursorCssProperties() {
        container.style.cursor = 'none';
        cursor.style.position = 'absolute';
        cursor.style.display = 'none';
        cursor.style.zIndex = '9000';
        cursor.style.top = 0;
        cursor.style.left = 0;
        cursor.style.pointerEvents = "none";
        disableSelection(cursor);
    }
    function scratchOff(event) {
        var click = false;
        if (event.type == 'touchmove') {
            event.preventDefault();
            click = false;
        } else if (event.type == 'mousedown' || event.type == 'touchstart') {
            isMouseDown = true;
            click = true;
        }
        scratchPercent(true);
        if (isMouseDown) {
            var x = event.pageX - this.offsetLeft;
            var y = event.pageY - this.offsetTop;
            var p = getPosition(container);
            x = ((event.pageX) - p.x);
            y = ((event.pageY) - p.y);
            if (event.type == 'touchmove' || event.type == 'touchstart') {
                limit = 20;
                var touch = event.touches[0];
                x = touch.pageX - p.x;
                y = touch.pageY - p.y;
            }
            overctx.save();
            overctx.globalCompositeOperation = 'destination-out';
            overctx.beginPath();
            overctx.arc(x, y, (settings.thickness * ratio), 0, 2 * Math.PI, false);
            overctx.closePath();
            overctx.fillStyle = 'rgba(0, 0, 0, 1)';
            overctx.fill();
            overctx.restore();
            if (event.type == 'touchmove' || event.type == 'touchstart' || event.type == 'touchend') {
                overlay.style.marginRight = '1px';
                overlay.style.marginRight = '0px';
            }
            if (parseInt(scratchPercent(click)) >= settings.endAt) {
                clear(true);
            }
        }
    }
    function clear(ended) {
        overlay.removeEventListener('mousedown', scratchOff);
        overlay.removeEventListener('mousemove', scratchOff);
        document.removeEventListener('mouseup', mouseOff);
        overlay.removeEventListener('mouseover', mouseEnter);
        overlay.removeEventListener('mouseout', mouseExit);
        overlay.removeEventListener('mousemove', mouseMove);
        overlay.removeEventListener('touchstart', scratchOff);
        overlay.removeEventListener('touchmove', scratchOff);
        document.removeEventListener('touchend', mouseOff);
        container.addEventListener('touchmove', function(e) {
            e.preventDefault();
            return false;
        });
        if (ended && !init.hasEnded) {
            init.hasEnded = true;
            container.style.setProperty('cursor', 'default', 'important');
            overlay.style.setProperty('cursor', 'default', 'important');
            cursor.style.display = 'none';
            delete init.scratchedOverlay;
            container.innerHTML = '';
            if (settings.counter != false) {
                if (typeof counter === 'function') {
                    counter(covered, init);
                }
            }
            var event = new CustomEvent('scratch-end', { detail: {covered: covered} });
            container.dispatchEvent(event);
            
        } else if (!ended && !init.hasEnded) {
            if (originalWidth != 0) {
                container.style.width = originalWidth;
            }
            if (originalHeight != 0) {
                container.style.height = originalHeight;
            }
            init.scratchedOverlay = generateMask();
            container.style.backgroundImage = 'none';
            container.innerHTML = '';
        }
    }
    function scratchPercent(click) {
        if (update++ % limit == 0 || click) {
            var ct = 0;
            var canvasData = overctx.getImageData(0, 0, cWidth, cHeight).data;
            for (var i = 0, l = (canvasData.length - jump); i < l; i += (4 * jump)) {
                if (canvasData[i] > 0)
                    ct++;
            }
            if (typeof transparentAtStart === 'undefined') {
                transparentAtStart = ((cWidth * cHeight) / jump) - ct;
            }
            covered = (100 - (((ct) / (((cWidth * cHeight) / jump) - transparentAtStart)) * (100))).toFixed(2);
        }
        if (settings.counter != false) {
            if (typeof counter === 'function' && covered > 0) {
                counter(covered, init);
            }
        }
        return ( covered) ;
    }
    function generateMask() {
        var mask = document.createElement('canvas');
        mask.width = cWidth;
        mask.height = cHeight;
        var maskCtx = mask.getContext('2d');
        maskCtx.translate(0, 0);
        maskCtx.fillStyle = 'rgba(10, 11, 12, 200)';
        maskCtx.fillRect(0, 0, cWidth, cHeight);
        maskCtx.globalCompositeOperation = 'destination-out';
        maskCtx.drawImage(overlay, 0, 0, cWidth, cHeight);
        return mask;
    }
    function mouseOff() {
        isMouseDown = false;
    }
    function mouseEnter(event) {
        if (!touch) {
            cursor.style.display = 'block';
        }
    }
    function mouseExit(event) {
        cursor.style.display = 'none';
    }
    function mouseMove(event) {
        var p = getPosition(container);
        cursor.style.left = ((event.pageX) - p.x - (cursorW / 2)) + 'px';
        cursor.style.top = ((event.pageY) - p.y - (cursorH / 2)) + 'px';
    }
    function disableSelection(target) {
        target.style.setProperty('-khtml-user-select', 'none', 'important');
        target.style.setProperty('-webkit-user-select', 'none', 'important');
        target.style.setProperty('-moz-user-select', '-moz-none', 'important');
        target.style.setProperty('-ms-user-select', 'none', 'important');
        target.style.setProperty('user-select', 'none', 'important');
        target.style.setProperty('-webkit-touch-callout', 'none', 'important');
        target.style.setProperty('-ms-touch-action', 'none', 'important')
    }
    document.addEventListener('touchstart', cursorFix);
    document.addEventListener('touchmove', cursorFix);
    document.addEventListener('touchend', cursorFix);
    function cursorFix() {
        overlay.style.setProperty('cursor', 'default', 'important');
        document.removeEventListener('touchstart', cursorFix);
        document.removeEventListener('touchmove', cursorFix);
        document.removeEventListener('touchend', cursorFix);
    }
    init.locked = false;
    init.container.lock = function lock(l) {
        if (typeof l !== 'undefined') {
            init.locked = !l;
        }
        if (init.locked) {
            overlay.addEventListener('mousedown', scratchOff);
            overlay.addEventListener('mousemove', scratchOff);
            document.addEventListener('mouseup', mouseOff);
            overlay.addEventListener('mouseover', mouseEnter);
            overlay.addEventListener('mouseout', mouseExit);
            overlay.addEventListener('mousemove', mouseMove);
            overlay.addEventListener('touchstart', scratchOff);
            overlay.addEventListener('touchmove', scratchOff);
            document.addEventListener('touchend', mouseOff);
            if (typeof init.coin == 'undefined') {
                overlay.style.cursor = settings.defaultCursor;
            }
        } else {
            overlay.removeEventListener('mousedown', scratchOff);
            overlay.removeEventListener('mousemove', scratchOff);
            document.removeEventListener('mouseup', mouseOff);
            overlay.removeEventListener('mouseover', mouseEnter);
            overlay.removeEventListener('mouseout', mouseExit);
            overlay.removeEventListener('mousemove', mouseMove);
            overlay.removeEventListener('touchstart', scratchOff);
            overlay.removeEventListener('touchmove', scratchOff);
            document.removeEventListener('touchend', mouseOff);
            overlay.style.cursor = 'default';
        }
        init.locked = !init.locked;
    }
    init.container.restart = function() {
        init.hasEnded = false;
        clear(false);
        init.scratchedOverlay = undefined;
        window.removeEventListener('resize', documentResize);
        createScratchCard(init);
    }
    init.container.clean = function() {
        overlay.removeEventListener('mousedown', scratchOff);
        overlay.removeEventListener('mousemove', scratchOff);
        document.removeEventListener('mouseup', mouseOff);
        overlay.removeEventListener('mouseover', mouseEnter);
        overlay.removeEventListener('mouseout', mouseExit);
        overlay.removeEventListener('mousemove', mouseMove);
        overlay.removeEventListener('touchstart', scratchOff);
        overlay.removeEventListener('touchmove', scratchOff);
        document.removeEventListener('touchend', mouseOff);
        container.addEventListener('touchmove', function(e) {
            e.preventDefault();
            return false;
        });
        init.hasEnded = true;
        init.container.lock(true);
        delete init.scratchedOverlay;
        container.innerHTML = '';
        container.removeAttribute("style");
    }
}
