//fabric.util.object.extend(fabric.Text.prototype, {
//    letterSpace: 0,
//    _renderChars: function(method, ctx, chars, left, top) {
//        if(!this.letterSpace){
//            ctx[method](chars, left, top);
//            return;
//        }
//        var charShift = 0;
//        for(var i = 0; i < chars.length; i++){
//            if(i > 0){
//                charShift += this.letterSpace + ctx.measureText(chars.charAt(i-1)).width;
//            }
//            ctx[method](chars.charAt(i), left+charShift, top);
//        }
//    },
//    _getLineWidth: function(ctx, lineIndex) {
//        if (this.__lineWidths[lineIndex]) {
//            return this.__lineWidths[lineIndex];
//        }
//        var lineLength = this._textLines[lineIndex].length;
//        var additionalSpaceSum = 0
//        if(lineLength > 0){
//            additionalSpaceSum = this.letterSpace * (lineLength - 1);
//        }
//        this.__lineWidths[lineIndex] = ctx.measureText(this._textLines[lineIndex]).width + additionalSpaceSum;
//        return this.__lineWidths[lineIndex];
//    }
//});

fabric.util.object.extend(fabric.Text.prototype, {
    _renderChars: function(method, ctx, chars, left, top) {
        //console.log(this.width);
        var characters = String.prototype.split.call(chars, ''),
            index = 0,
            current,
            currentPosition = left,
            y = top,
            align = 1,
            ls = 0;

        if (this.letterSpacing !== undefined)
            ls = this.letterSpacing;

        if (this.textAlign === 'right') {
            characters = characters.reverse();
            align = -1;
        } else if (this.textAlign === 'center') {
            var totalWidth = 0;
            for (var i = 0; i < characters.length; i++) {
                totalWidth += (ctx.measureText(characters[i]).width + ls);
            }
            //currentPosition = x - (totalWidth / 2); //original
            currentPosition = left - (totalWidth / 2); //just randomly replaced x with 'left' to avoid error, should be taken care of before finalizing
        }
        var updatedWidth = currentPosition;
        while (index < chars.length) {
            current = characters[index++];
            ctx.fillText(current, currentPosition, y);
            currentPosition += (align * (ctx.measureText(current).width + ls));
        }
        updatedWidth = currentPosition - updatedWidth;
        this.width = updatedWidth;
    }

});

//fabric.util.object.extend(fabric.IText.prototype, {
//    letterSpacing : 0,
//    _getTextWidth: function(ctx, textLines) {
//        var maxWidth = ctx.measureText(textLines[0] || '|').width;
//        var maxLineLength = textLines[0].length;
//        for (var i = 1, len = textLines.length; i < len; i++) {
//            var currentLineWidth = ctx.measureText(textLines[i]).width;
//            if (currentLineWidth > maxWidth) {
//                maxWidth = currentLineWidth;
//                maxLineLength = textLines[i].length;
//            }
//        }
//
//        return maxWidth + (this.letterSpacing * maxLineLength);
//    },
//    _getWidthOfChar: function(ctx, _char, lineIndex, charIndex) {
//        if (this.textAlign === 'justify' && /\s/.test(_char)) {
//            return this._getWidthOfSpace(ctx, lineIndex);
//        }
//
//        var styleDeclaration = this._getStyleDeclaration(lineIndex, charIndex);
//        this._applyFontStyles(styleDeclaration);
//        var cacheProp = this._getCacheProp(_char, styleDeclaration);
//
//        if (this._charWidthsCache[cacheProp] && this.caching) {
//            return this._charWidthsCache[cacheProp] + this.letterSpacing;
//        }
//        else if (ctx) {
//            ctx.save();
//            var width = this._applyCharStylesGetWidth(ctx, _char, lineIndex, charIndex);
//            ctx.restore();
//            return width + this.letterSpacing;
//        }
//    },
//    _getWidthOfSpace: function (ctx, lineIndex) {
//        var lines = this.text.split(this._reNewline),
//            line = lines[lineIndex],
//            words = line.split(/\s+/),
//            wordsWidth = this._getWidthOfWords(ctx, line, lineIndex),
//            widthDiff = this.width - wordsWidth,
//            numSpaces = words.length - 1,
//            width = widthDiff / numSpaces;
//
//        return width + this.letterSpacing;
//    }
//
//});

fabric.util.object.extend(fabric.Object.prototype, {

    borderColor: 'rgba(100,100,100,.40)',
    //hasRotatingPoint: false,
    cornerColor: 'rgba(100,100,100,.8)',
    cornerSize: 10,

    _drawControl: function(control, ctx, methodName, left, top) {
         if (!this.isControlVisible(control)) {
            return;
         }
         var size = this.cornerSize;
         isVML() || this.transparentCorners || ctx.clearRect(left, top, size, size);

        if(control !== 'mt' && control !== 'mr' && control !== 'ml' && control !== 'mb')
            ctx['fillRect'](left, top, size, size);


        var SelectedIconImage = new Image();
        if(control === 'tl') {
             SelectedIconImage.src = 'img/cross-black.png';
             ctx.drawImage(SelectedIconImage, left, top, size, size);
     }

    }

});

fabric.util.object.extend(fabric.Canvas.prototype, {

    pointerCursor:         'pointer',

    _getActionFromCorner: function(target, corner) {
        var action = 'drag';
        if (corner) {
            action = corner === 'mtr'
                ? 'rotate'
                : corner === 'tl'
                ? 'remove'
                : 'scale';
        }
        return action;
    },

     _setupCurrentTransform: function (e, target) {

         if (!target) {
             return;
         }

         var pointer = this.getPointer(e),
             corner = target._findTargetCorner(this.getPointer(e, true)),
             action = this._getActionFromCorner(target, corner),
             origin = this._getOriginFromCorner(target, corner);


         if (action == 'remove')
         {
             if (this.getActiveGroup() && this.getActiveGroup()!= 'undefined')
             {
                 this.getActiveGroup().forEachObject(function(o)
                 {
                     o.remove();
                 });
                 this.discardActiveGroup();
             }
             else
             {
                 var activeObject=window.canvas.getActiveObject();
                 window.canvas.remove(activeObject);
             }
             window.canvas.renderAll();
             TShirtDesignTool.changeToAddTextPanel();
             return;
         }


         this._currentTransform = {
             target: target,
             action: action,
             scaleX: target.scaleX,
             scaleY: target.scaleY,
             offsetX: pointer.x - target.left,
             offsetY: pointer.y - target.top,
             originX: origin.x,
             originY: origin.y,
             ex: pointer.x,
             ey: pointer.y,
             left: target.left,
             top: target.top,
             theta: degreesToRadians(target.angle),
             width: target.width * target.scaleX,
             mouseXSign: 1,
             mouseYSign: 1
         };

         this._currentTransform.original = {
             left: target.left,
             top: target.top,
             scaleX: target.scaleX,
             scaleY: target.scaleY,
             originX: origin.x,
             originY: origin.y
         };

         this._resetCurrentTransform(e);
     },

    _setCornerCursor: function(corner, target) {
         if (corner === 'tl') {
             this.setCursor(this.pointerCursor);
         }
         else if (corner in cursorOffset) {
             this.setCursor(this._getRotatedCornerCursor(corner, target));
         }
         else if (corner === 'mtr' && target.hasRotatingPoint) {
             this.setCursor(this.rotationCursor);
         }
         else {
             this.setCursor(this.defaultCursor);
             return false;
         }
     }

 });

var cursorOffset = {
    //mt: 0, // n
    tr: 1, // ne
    //mr: 2, // e
    br: 3, // se
    //mb: 4, // s
    bl: 5, // sw
    //ml: 6, // w
    tl: 7 // nw
};

isVML = function() { return typeof G_vmlCanvasManager !== 'undefined'; };

degreesToRadians = fabric.util.degreesToRadians;

fabric.util.object.extend(fabric.CurvedText.prototype, {

    drawBorders: function(ctx) {

        console.log("here");
        if (!this.hasBorders) {
            return this;
        }

        ctx.save();

        ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = 1 / this.borderScaleFactor;

        var wh = this._calculateCurrentDimensions(true),
            width = wh.x,
            height = wh.y;
        if (this.group) {
            width = width * this.group.scaleX;
            height = height * this.group.scaleY;
        }

        ctx.strokeRect(
            ~~(-(width / 2)) - 10,
            ~~(-(height / 2)) - 0.5,
            ~~(width) + 15.5,
            ~~(height) + 10.5
        );

        if (this.hasRotatingPoint && this.isControlVisible('mtr') && !this.get('lockRotation') && this.hasControls) {

            var rotateHeight = -height / 2;

            ctx.beginPath();
            ctx.moveTo(0, rotateHeight);
            ctx.lineTo(0, rotateHeight - this.rotatingPointOffset);
            ctx.closePath();
            ctx.stroke();
        }

        ctx.restore();
        return this;

    },

    _drawControl: function(control, ctx, methodName, left, top) {
        console.log("!!!!");
        if (!this.isControlVisible(control)) {
            return;
        }
        var size = this.cornerSize;
        isVML() || this.transparentCorners || ctx.clearRect(left, top, size, size);

        if(control === 'tl')
            ctx['fillRect'](left-10, top, size, size);
        else if(control === 'tr')
            ctx['fillRect'](left+5, top, size, size);
        else if(control === 'bl')
            ctx['fillRect'](left-10, top+10, size, size);
        else if(control === 'br')
            ctx['fillRect'](left+5, top+10, size, size);
        else if(control === 'mtr')
            ctx['fillRect'](left, top, size, size);

        var SelectedIconImage = new Image();
        if(control === 'tl') {
            SelectedIconImage.src = 'img/cross-black.png';
            ctx.drawImage(SelectedIconImage, left-10, top, size, size);
        }

    },

    /*_setCornerCoords: function() {
        var coords = this.oCoords,
            newTheta = degreesToRadians(45 - this.angle),
        /!* Math.sqrt(2 * Math.pow(this.cornerSize, 2)) / 2, *!/
        /!* 0.707106 stands for sqrt(2)/2 *!/
            cornerHypotenuse = this.cornerSize * 0.707106,
            cosHalfOffset = cornerHypotenuse * Math.cos(newTheta),
            sinHalfOffset = cornerHypotenuse * Math.sin(newTheta),
            x, y;

        for (var point in coords) {
            x = coords[point].x;
            y = coords[point].y;
            coords[point].corner = {
                tl: {
                    x: x - sinHalfOffset-10,
                    y: y - cosHalfOffset
                },
                tr: {
                    x: x + cosHalfOffset,
                    y: y - sinHalfOffset
                },
                bl: {
                    x: x - cosHalfOffset-10,
                    y: y + sinHalfOffset+10
                },
                br: {
                    x: x + sinHalfOffset,
                    y: y + cosHalfOffset
                }
            };
        }
    }*/



});
