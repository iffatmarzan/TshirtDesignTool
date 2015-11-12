/**
 * Created by bs062 on 10/26/2015.
 */

isVML = function () {
    return typeof G_vmlCanvasManager !== 'undefined';
};

fabric.util.object.extend(fabric.Object.prototype, {
    borderColor: 'rgba(100,100,100,.40)',
    hasRotatingPoint: true,
    cornerColor: 'rgba(100,100,100,.8)',
    cornerSize: 12,

    _drawControl: function (control, ctx, methodName, left, top) {
        if (!this.isControlVisible(control)) {
            return;
        }
        var size = this.cornerSize;
        isVML() || this.transparentCorners || ctx.clearRect(left, top, size, size);

        var deleteIcon = new Image();
        deleteIcon.src = 'img/delete.png';

        var scaleIcon= new Image();
        scaleIcon.src='img/scale.gif';

        var rotateIcon= new Image();
        rotateIcon.src='img/rotate.png';

        if (control === 'tl') {
            //SelectedIconImage.onload = function () {
            //    ctx['drawImage'](SelectedIconImage, left, top, size, size);
            //    ctx['strokeRect'](left, top, size, size);
            //}
            ctx['drawImage'](deleteIcon, left, top, size, size);
            //ctx['strokeRect'](left, top, size, size);
        }
        if (control === 'mtr') {
            //SelectedIconImage.onload = function () {
            //    ctx['drawImage'](SelectedIconImage, left, top, size, size);
            //    ctx['strokeRect'](left, top, size, size);
            //}
            //ctx['drawImage'](rotateIcon, left, top, size, size);
            //ctx['strokeRect'](left, top, size, size);
            ctx['fillRect'](left, top, size, size);
        }
        if (control === 'tr' || control === 'br' || control === 'bl' )
        {
            ctx['drawImage'](scaleIcon, left, top, size, size);
            //ctx['strokeRect'](left, top, size, size);
        }


    }

});
