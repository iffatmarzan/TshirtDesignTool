/**
 * Created by bs062 on 2/16/2016.
 */

TShirtDesignTool.addClipartToCanvas = function (imageSrc) {
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

TShirtDesignTool.clipartEditorPanel = function () {
    TShirtDesignTool.showPanel('edit-clipart-panel');
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

TShirtDesignTool.setSvgPathColor = function (fillColor) {
    var activeObject = window.canvas.getActiveObject();
    if (!activeObject)
        return;
    activeObject.paths[pathList.options.selectedIndex].fill = fillColor;
    //activeObject.paths[pathList.options.selectedIndex].stroke='red';
    //activeObject.paths[pathList.options.selectedIndex].strokeWidth=5;
    //window.canvas.render(activeObject);
    window.canvas.renderAll();
};

TShirtDesignTool.svgPathChange = function () {
    var activeObject = window.canvas.getActiveObject();
    if (!activeObject)
        return;
    $('#svgFill').spectrum("set", activeObject.paths[pathList.options.selectedIndex].fill);
};

TShirtDesignTool.setSvgStroke = function (stroke) {
    var activeObject = window.canvas.getActiveObject();
    if (!activeObject)
        return;
    activeObject.setStroke(stroke);
    $('#svgStrokeWidth .ui-slider-range').css('background', stroke);
    window.canvas.renderAll();

};

TShirtDesignTool.setSvgAngle = function () {
    var activeObject = window.canvas.getActiveObject();
    if (!activeObject)
        return;
    activeObject.setAngle($('#svgAngle').slider('value'));
    window.canvas.renderAll();
};

TShirtDesignTool.setSvgOpacity = function () {
    var activeObject = window.canvas.getActiveObject();
    if (!activeObject)
        return;
    activeObject.setOpacity(($('#svgOpacity').slider('value')) * .01);
    window.canvas.renderAll();

};