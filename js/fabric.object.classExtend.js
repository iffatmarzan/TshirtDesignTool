/**
 * Created by bs062 on 10/26/2015.
 */

isVML = function() { return typeof G_vmlCanvasManager !== 'undefined'; };

fabric.util.object.extend(fabric.Object.prototype, {
    borderColor: 'rgba(100,100,100,.40)',
    hasRotatingPoint: true,
    cornerColor: 'rgba(100,100,100,.8)',
    cornerSize: 10,

    _drawControl: function(control, ctx, methodName, left, top) {
        if (!this.isControlVisible(control)) {
            return;
        }
        var size = this.cornerSize;
        isVML() || this.transparentCorners || ctx.clearRect(left, top, size, size);

        if(control !== 'mt' && control !== 'mr' && control !== 'ml' && control !== 'mb' && control !== 'tl')
            ctx['fillRect'](left, top, size, size);

        var SelectedIconImage = new Image();
        if(control === 'tl') {
            SelectedIconImage.src = 'img/cross-black.png';
            ctx.drawImage(SelectedIconImage, left, top, size, size);
        }

    }

});
