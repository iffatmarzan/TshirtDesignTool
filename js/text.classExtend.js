fabric.util.object.extend(fabric.Text.prototype, {
    letterSpace: 0,
    _renderChars: function(method, ctx, chars, left, top) {
        if(!this.letterSpace){
            ctx[method](chars, left, top);
            return;
        }
        var charShift = 0;
        for(var i = 0; i < chars.length; i++){
            if(i > 0){
                charShift += this.letterSpace + ctx.measureText(chars.charAt(i-1)).width;
            }
            ctx[method](chars.charAt(i), left+charShift, top);
        }
    },
    _getLineWidth: function(ctx, lineIndex) {
        if (this.__lineWidths[lineIndex]) {
            return this.__lineWidths[lineIndex];
        }
        var lineLength = this._textLines[lineIndex].length;
        var additionalSpaceSum = 0
        if(lineLength > 0){
            additionalSpaceSum = this.letterSpace * (lineLength - 1);
        }
        this.__lineWidths[lineIndex] = ctx.measureText(this._textLines[lineIndex]).width + additionalSpaceSum;
        return this.__lineWidths[lineIndex];
    }
});