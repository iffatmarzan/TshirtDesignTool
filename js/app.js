var TShirtDesignTool =
{
    init: function () {
        var _this = TShirtDesignTool;
        _this.canvasInit();

       // _this.drawText("Hello world");

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
    , drawText: function () {

    //if (window.canvas.getObjects().length > 0) {
    //    window.canvas.item(0).text = Text;
    //    window.canvas.renderAll();
    //    return;
    //}

    var Text = $('#add-text-form textarea').val();
    if(Text==="")
        return;
    var SampleText = new fabric.CurvedText(Text, {
        left: canvas.getWidth() / 2,
        top: canvas.getHeight() / 2,
        //left: 380,
        //top:370,
        fontFamily: 'sans-serif',
        fontSize:30
    });

    SampleText.on('selected', function() {
       // console.log('Text is selected');
        TShirtDesignTool.changeToEditorPanel();
    });

    SampleText.on('added', function() {
        console.log('Text added');
    });

    SampleText.on('moving', function(e) {
      //  console.log(e.e.clientX);

        if(e.e.clientX <= 475 ){
            window.canvas.getActiveObject().set('left',25);
        }

        if(e.e.clientX >= 790){
            window.canvas.getActiveObject().set('left',385);
        }

        if(e.e.clientY <= 100){
            window.canvas.getActiveObject().set('top',10);
        }
        if(e.e.clientY >=400){
            window.canvas.getActiveObject().set('top',400);
        }
        window.canvas.renderAll();

    });

    window.canvas.add(SampleText);
    canvas.renderAll();
    TShirtDesignTool.changeToEditorPanel();
    return;
}                                                       // end of drawText
    ,changeToEditorPanel:function(){
    var selectedObject=window.canvas.getActiveObject();
    if(!selectedObject){
        selectedObject={'text':$('#textPanel textarea').val(),
                         'fill':'#000'}
    }
    $('#textPanel').empty();
    $('#textPanel').css("border","1px solid darkgray");
      var editorPanel=' <h6>Text Properties:</h6>'+
             '<textarea name="" onkeyup="return TShirtDesignTool.updateText(this.value)">'+selectedObject.text+'</textarea>'+
             '<select name="font" onchange="return TShirtDesignTool.setTextFont(this.value)">'+
             '<option value="sans-serif" selected>sans-serif</option><option value="OldSansBlack">OldSansBlack</option>'+
             '<option value="Megazine">Megazine</option><option value="monospace" >monospace</option><option value="Impact">Impact</option>'+
             '</select>'+
             '<b>Spacing: </b><input type="number"  min="1" max="10" value="1" onchange="return TShirtDesignTool.setTextSpacing(this.value)" >'+
             '<br/><b>Color: </b><input type="color" onchange="return TShirtDesignTool.setTextColor(this.value)" value='+selectedObject.fill+'>'+
             '<br/><b>Arc :</b><br/> <input type="range"  min="-50" max="50" value="0" onchange="return TShirtDesignTool.setTextArc(this.value)"/><br>';

    $('#textPanel').append(editorPanel);
}                                            //end of changeToEditorPanel
    ,changeToAddTextPanel: function(){
        $('#textPanel').empty();
        $('#textPanel').removeAttr('style');
        var addTextPanel='<div class="panel">'+
            '<h5>Add Text</h5>'+
            '<form id="add-text-form" class="content">'+
            '<textarea class="text full input-text-1" name=""></textarea>'+
            '<fieldset>'+
            '<a href="#" title="Add" onclick="return TShirtDesignTool.drawText()" class="primary-button full">Add Text</a>'+
            '</fieldset>'+
            '</form>'+
            '</div>';
        $('#textPanel').append(addTextPanel);
}
    ,updateText: function(e){
    window.canvas.getActiveObject().text=e;
    canvas.renderAll();
}
    ,setTextFont: function(e){
    window.canvas.getActiveObject().fontFamily=e;
    window.canvas.renderAll();
}
    ,setTextSpacing:function(e){
    window.canvas.getActiveObject().set('spacing',e);
    canvas.renderAll();
}
    ,setTextColor:function(e){
         window.canvas.getActiveObject().fill=e;
        canvas.renderAll();

}
    ,setTextArc:function(e){
    window.canvas.getActiveObject().set('radius',e);
    canvas.renderAll();
}

};                 //end of TShirtDesignTool

$(document).ready(function () {

    TShirtDesignTool.init();
    document.onkeydown = function(e) {
        if (46 === e.keyCode || e.keyCode===110) {
            var activeObject=window.canvas.getActiveObject();
            if(activeObject!==null){
                window.canvas.remove(activeObject);
                TShirtDesignTool.changeToAddTextPanel();
            }
            window.canvas.renderAll();
        }
    }

});