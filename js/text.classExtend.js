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

        while (index < chars.length) {
            current = characters[index++];
            ctx.fillText(current, currentPosition, y);
            currentPosition += (align * (ctx.measureText(current).width + ls));
        }
    },

});


fabric.util.object.extend(fabric.IText.prototype, {
    letterSpacing : 0,
    _getTextWidth: function(ctx, textLines) {
        var maxWidth = ctx.measureText(textLines[0] || '|').width;
        var maxLineLength = textLines[0].length;
        for (var i = 1, len = textLines.length; i < len; i++) {
            var currentLineWidth = ctx.measureText(textLines[i]).width;
            if (currentLineWidth > maxWidth) {
                maxWidth = currentLineWidth;
                maxLineLength = textLines[i].length;
            }
        }

        return maxWidth + (this.letterSpacing * maxLineLength);
    },
    _getWidthOfChar: function(ctx, _char, lineIndex, charIndex) {
        if (this.textAlign === 'justify' && /\s/.test(_char)) {
            return this._getWidthOfSpace(ctx, lineIndex);
        }

        var styleDeclaration = this._getStyleDeclaration(lineIndex, charIndex);
        this._applyFontStyles(styleDeclaration);
        var cacheProp = this._getCacheProp(_char, styleDeclaration);

        if (this._charWidthsCache[cacheProp] && this.caching) {
            return this._charWidthsCache[cacheProp] + this.letterSpacing;
        }
        else if (ctx) {
            ctx.save();
            var width = this._applyCharStylesGetWidth(ctx, _char, lineIndex, charIndex);
            ctx.restore();
            return width + this.letterSpacing;
        }
    },
    _getWidthOfSpace: function (ctx, lineIndex) {
        var lines = this.text.split(this._reNewline),
            line = lines[lineIndex],
            words = line.split(/\s+/),
            wordsWidth = this._getWidthOfWords(ctx, line, lineIndex),
            widthDiff = this.width - wordsWidth,
            numSpaces = words.length - 1,
            width = widthDiff / numSpaces;

        return width + this.letterSpacing;
    }

});