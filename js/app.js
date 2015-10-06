
var TShirtDesignTool =
{
    init: function()
    {
        var _this = TShirtDesignTool;
        //var Text=$('#add-text-form textarea').val();
        //_this.drawText(Text);
    }
    , drawText: function(Text)
    {
        Text==""?Text="dot dot dot":Text=Text;
        var canvas = new fabric.Canvas('FrontViewCanvas');

        var SampleText = new fabric.Text(Text, {
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
    $('#add-text-form a').bind("click",function(){
        var Text=$('#add-text-form textarea').val();
        TShirtDesignTool.drawText(Text);
    });
});