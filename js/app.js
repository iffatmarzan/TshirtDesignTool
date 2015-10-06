
var TShirtDesignTool =
{
    init: function()
    {
        var _this = TShirtDesignTool;
        var Text=$('#add-text-form textarea').val();
        _this.drawText(Text);
    }
    , drawText: function(Text)
    {
        Text==""?Text="dot dot dot":Text=Text;
        var canvas = new fabric.Canvas('FrontViewCanvas');
        canvas.remove();
        var SampleText = new fabric.Text(Text, {
            left: canvas.getWidth() / 2,
            top: canvas.getHeight() / 2
        });
        canvas.add(SampleText);
        var circle = new fabric.Circle({
            radius: 20, fill: 'green', left: 100, top: 100
        });
        var triangle = new fabric.Triangle({
            width: 20, height: 30, fill: 'blue', left: 50, top: 50
        });

        canvas.add(circle, triangle);

        //SampleText = new fabric.Text(Text+"changed", {
        //    left: canvas.getWidth() / 2,
        //    top: canvas.getHeight() / 2
        //});
        //canvas.add(SampleText);


        canvas.renderAll();
      //  canvas.setWidth($('#FrontViewDiv').width());
      //  canvas.setHeight($('#FrontViewDiv').height());

    }
};

$(document).ready(function()
{
   TShirtDesignTool.init();
    $('#add-text-form a').bind("click",function(){
        var Text=$('#add-text-form textarea').val();
        //TShirtDesignTool.drawText(Text);

        var canvas = new fabric.Canvas('FrontViewCanvas');
        canvas.remove();

        var SampleText = new fabric.Text(Text, {
            left: canvas.getWidth() / 2,
            top: canvas.getHeight() / 2
        });
        canvas.add(SampleText);
        var triangle = new fabric.Triangle({
            width: 20, height: 30, fill: 'red', left: 50, top: 50
        });

        canvas.add(triangle);
    });
});