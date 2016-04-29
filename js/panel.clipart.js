// -------------------------------------------------------------------------
// <copyright company="BrainStation 23 Ltd.">
//     Copyright (c) 2016 [BrainStation 23 Ltd.](http://brainstation-23.com/)
// </copyright>
// <updated>29-04-2016</updated>
// <author>Mahbubur Rahman Manik</author>
// -------------------------------------------------------------------------

(function (extend) {
    extend.addClipartToCanvas = function (imageSrc) {
        fabric.loadSVGFromURL(imageSrc, function (objects, options) {
            var _canvas = window.canvas;
            var obj = fabric.util.groupSVGElements(objects, options);
            obj.left = _canvas.getWidth() / 2 - 50;
            obj.top = _canvas.getHeight() / 2 - 50;
            obj.scaleX = 100 / options.width;
            obj.scaleY = 100 / options.height;
            obj.hasRotatingPoint = false;
            _canvas.add(obj).renderAll();
        });

    };
    extend.clipartEditorPanel = function () {
        this.showPanel('edit-clipart-panel');
        var activeObject = window.canvas.getActiveObject();
        //console.log(activeObject.paths[pathList.options.selectedIndex].fill)
        $('#svgFill').spectrum("set", activeObject.paths[pathList.options.selectedIndex].fill);
        //$('.k-selected-color').get(2).style['background-color'] = activeObject.paths[pathList.options.selectedIndex];
        if (activeObject.angle) {
            $('#svgAngle').slider('value', activeObject.angle);
        }
        if (activeObject.opacity)
            $('#svgOpacity').slider('value', activeObject.opacity * 100);
    };
    extend.setSvgPathColor = function (fillColor) {
        var activeObject = window.canvas.getActiveObject();
        if (!activeObject){
            return;
        }
        activeObject.paths[pathList.options.selectedIndex].fill = fillColor;
        //activeObject.paths[pathList.options.selectedIndex].stroke='red';
        //activeObject.paths[pathList.options.selectedIndex].strokeWidth=5;
        //window.canvas.render(activeObject);
        window.canvas.renderAll();
    };
    extend.svgPathChange = function () {
        var activeObject = window.canvas.getActiveObject();
        if (!activeObject)
            return;
        $('#svgFill').spectrum("set", activeObject.paths[pathList.options.selectedIndex].fill);
    };
    extend.setSvgStroke = function (stroke) {
        var activeObject = window.canvas.getActiveObject();
        if (!activeObject)
            return;
        activeObject.setStroke(stroke);
        $('#svgStrokeWidth .ui-slider-range').css('background', stroke);
        window.canvas.renderAll();

    };
    extend.setSvgAngle = function () {
        var activeObject = window.canvas.getActiveObject();
        if (!activeObject)
            return;
        activeObject.setAngle($('#svgAngle').slider('value'));
        window.canvas.renderAll();
    };
    extend.setSvgOpacity = function () {
        var activeObject = window.canvas.getActiveObject();
        if (!activeObject)
            return;
        activeObject.setOpacity(($('#svgOpacity').slider('value')) * .01);
        window.canvas.renderAll();

    };
})(TShirtDesignTool);