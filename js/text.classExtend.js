
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
        if(this.width<updatedWidth)
            this.width = updatedWidth;
    }

});




