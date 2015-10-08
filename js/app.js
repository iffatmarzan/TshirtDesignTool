var TShirtDesignTool =
{
    init: function () {
        var _this = TShirtDesignTool;
        _this.canvasInit();
        //window.canvas.on('mouse:down', function(options) {
        //    console.log(options.e.clientX, options.e.clientY);
        //    if (options.target) {
        //        console.log('an object was clicked! ', options.target.type);
        //    }
        //});
    }
    , canvasInit: function () {
    //$('#canvas').removeAttr('style');
    window.canvas = new fabric.Canvas('canvas');
    canvas.setHeight(430);
    canvas.setWidth(385);
    //canvas.isDrawingMode=true;
    canvas.renderAll();
}
    , drawText: function (Text) {
    if (window.canvas.getObjects().length > 0) {
        window.canvas.item(0).text = Text;
        window.canvas.renderAll();
        return;
    }
    var SampleText = new fabric.Text(Text, {
        left: canvas.getWidth() / 2,
        top: canvas.getHeight() / 2
    });

    SampleText.on('selected', function() {
        console.log('Text is selected');
    });

    SampleText.on('added', function() {
        console.log('Text added');
    });

    window.canvas.add(SampleText);
    return;
} // end of drawText
    ,changeTextPanel:function(){
    $('#textPanel').empty();
    $('#textPanel').css("border","1px solid darkgray");
      var editorPanel=' <h6>Text Properties:</h6>'+
             '<textarea name=""></textarea>'+
             '<select name="font">'+
             '<option value="" selected>Change font</option><option value="1">OldSansBlack</option>'+
              '<option value="2">Megazine</option><option value="3" >Typodermic</option><option value="4">Impact</option>'+
            '</select>';
    $('#textPanel').append(editorPanel);
}
};

$(document).ready(function () {
    TShirtDesignTool.init();

    $('#add-text-form a').bind("click", function () {

        var Text = $('#add-text-form textarea').val();
        if(Text!=""){
            TShirtDesignTool.drawText(Text);
            TShirtDesignTool.changeTextPanel();
        }


    });
});