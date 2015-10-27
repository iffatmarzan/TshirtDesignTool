/**
 * Created by bs062 on 10/26/2015.
 */

var cursorOffset = {
    mt: 0, // n
    tr: 1, // ne
    mr: 2, // e
    br: 3, // se
    mb: 4, // s
    bl: 5, // sw
    ml: 6, // w
    tl: 7 // nw
};
degreesToRadians = fabric.util.degreesToRadians;

fabric.util.object.extend(fabric.Canvas.prototype, {
    pointerCursor: 'pointer',
    _getActionFromCorner: function(target, corner) {
        var action = 'drag';
        if (corner) {
            action = (corner === 'ml' || corner === 'mr')
                ? 'scaleX'
                : (corner === 'mt' || corner === 'mb')
                ? 'scaleY'
                :( corner === 'mtr' )
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
            TShirtDesignTool.changeToAddTextPanel();
            window.canvas.renderAll();
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


