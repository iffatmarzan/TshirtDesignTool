
var TShirtDesignTool =
{
    init: function()
    {
        var _this = TShirtDesignTool;
        _this.drawText();
    }
    , drawText: function()
    {
        var canvas = new fabric.Canvas('FrontViewCanvas');

        var SampleText = new fabric.Text('hello, world.', {
            left: canvas.getWidth() / 2,
            top: canvas.getHeight() / 2
        });


        canvas.add(SampleText);
      //  canvas.setWidth($('#FrontViewDiv').width());
      //  canvas.setHeight($('#FrontViewDiv').height());

    }
};

$(document).ready(function()
{
   TShirtDesignTool.init();
});