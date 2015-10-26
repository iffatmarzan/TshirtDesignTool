/**
 * Created by bs062 on 10/26/2015.
 */

fabric.util.object.extend(fabric.CurvedText.prototype, {
    drawBorders: function(ctx) {
        //console.log("here");
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
    //_drawControl: function(control, ctx, methodName, left, top) {
    //    //console.log("!!!!");
    //    if (!this.isControlVisible(control)) {
    //        return;
    //    }
    //    var size = this.cornerSize;
    //    isVML() || this.transparentCorners || ctx.clearRect(left, top, size, size);
    //
    //    if(control === 'tl')
    //        ctx['fillRect'](left-10, top, size, size);
    //    else if(control === 'tr')
    //        ctx['fillRect'](left+5, top, size, size);
    //    else if(control === 'bl')
    //        ctx['fillRect'](left-10, top+10, size, size);
    //    else if(control === 'br')
    //        ctx['fillRect'](left+5, top+10, size, size);
    //    else if(control === 'mtr')
    //        ctx['fillRect'](left, top, size, size);
    //
    //    var SelectedIconImage = new Image();
    //    if(control === 'tl') {
    //        SelectedIconImage.src = 'img/cross-black.png';
    //        ctx.drawImage(SelectedIconImage, left-10, top, size, size);
    //    }
    //
    //},
    //
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
