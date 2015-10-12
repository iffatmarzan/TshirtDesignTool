var TShirtDesignTool =
{
    init: function () {
        var _this = TShirtDesignTool;
        _this.canvasInit();
    }
    , canvasInit: function () {
                window.canvas = new fabric.Canvas('canvas');
                canvas.setHeight(430);
                canvas.setWidth(385);
                //canvas.isDrawingMode=true;
                canvas.renderAll();
                canvas.on('object:moving', function (e) {
                    var obj = e.target;
                    // if object is too big ignore
                    if(obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width){
                        return;
                    }
                    obj.setCoords();
                    // top-left  corner
                    if(obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0){
                        obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
                        obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left);
                    }
                    // bot-right corner
                    if(obj.getBoundingRect().top+obj.getBoundingRect().height  > obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width  > obj.canvas.width){
                        obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
                        obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
                    }
    });

}
    , drawText: function () {
            var Text = $('#add-text-form textarea').val();
            if(Text==="")
                return;
            //var SampleText = new fabric.Text(Text, {
            //    left: canvas.getWidth() / 2,
            //    top: canvas.getHeight() / 2,
            //    //left: 380,
            //    //top:370,
            //    fontFamily: 'sans-serif',
            //    fontSize:30
            //});
            var curveText= new fabric.CurvedText(Text,{
                left:canvas.getWidth() / 2,
                top:canvas.getHeight() / 2,
                fill: '#ff0000',
                textAlign: 'center'
            });

            //SampleText.on('selected', function() {
            //   // console.log('Text is selected');
            //    TShirtDesignTool.changeToEditorPanel();
            //});

            curveText.on('selected', function() {
                // console.log('Text is selected');
                TShirtDesignTool.changeToEditorPanel();
            });

            //window.canvas.add(SampleText);
            window.canvas.add(curveText);
            canvas.renderAll();
            TShirtDesignTool.changeToEditorPanel();
            return;
}
    ,changeToEditorPanel:function(){
            var selectedObject=window.canvas.getActiveObject();
            if(!selectedObject){
                selectedObject={'text':$('#textPanel textarea').val(),
                                 'fill':'#000'
                               }
            }
            $('#textPanel').empty();
            $('#textPanel').css("border","1px solid darkgray");
              var editorPanel=' <h6>Text Properties:</h6>'+
                     '<textarea name="" onkeyup="return TShirtDesignTool.updateText(this.value)">'+selectedObject.text+'</textarea>'+
                     '<select name="font" onchange="return TShirtDesignTool.setTextFont(this.value)">'+
                     '<option value="sans-serif" selected>sans-serif</option><option value="OldSansBlack">OldSansBlack</option>'+
                     '<option value="Megazine">Megazine</option><option value="monospace" >monospace</option><option value="Impact">Impact</option>'+
                     '</select>'+
                     '<b>Spacing: </b><input type="number"  min="-5" max="10" value="0" onchange="return TShirtDesignTool.setTextSpacing(this.value)" >'+
                     '<b>Color: </b><input type="color" onchange="return TShirtDesignTool.setTextColor(this.value)" value='+selectedObject.fill+'>'+
                     '<br/><b>ArcText :</b><input type="range"  min="-170" max="170" value="0" onchange="return TShirtDesignTool.setTextArc(this.value)"/><br>';

            $('#textPanel').append(editorPanel);
}
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
            var activeObject=window.canvas.getActiveObject();
            if(!activeObject)
                activeObject=window.canvas.item(0);
            activeObject.setText(e);
            canvas.renderAll();
}
    ,setTextFont: function(e){
            window.canvas.getActiveObject().fontFamily=e;
            window.canvas.renderAll();
}
    ,setTextSpacing:function(e){
            var activeObject=window.canvas.getActiveObject();
            if(!activeObject)
                activeObject=window.canvas.item(0);

         if(activeObject.effect=='arc')
                activeObject.set({
                spacing:-10+parseInt(e)*2});

    if(activeObject.effect=='STRAIGHT')
        activeObject.set({
            spacing:e});

                canvas.renderAll();
}
    ,setTextColor:function(e){
            var activeObject=window.canvas.getActiveObject();
            if(!activeObject)
                activeObject=window.canvas.item(0);
            activeObject.setFill(e);
            canvas.renderAll();

}
    ,setTextArc:function(e){
            var activeObject=window.canvas.getActiveObject();
            if(!activeObject)
                activeObject=window.canvas.item(0);

    if(parseInt(e)<10 && parseInt(e)>-10 ){
        activeObject.set({
            effect:'STRAIGHT',
            spacing:0,

        });
        canvas.renderAll();
        return;
    }
    if(activeObject.effect=='STRAIGHT')
        activeObject.set({
            effect:'arc',
            spacing:-10,
            textAlign: 'center'
        });

            activeObject.set({
                textAlign: 'center',
                reverse:parseInt(e)<0,
                spacing:activeObject.spacing,
                radius:1000-Math.abs(e)*5
                });
            canvas.renderAll();
}

};

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