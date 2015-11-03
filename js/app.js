var TShirtDesignTool =
{
     panels:['text-panel','editor-panel','clip-art-panel','upload-image-panel']
    , fontStyleDropdownData:[
    {
        text: "normal",
        value: 1,
        selected: false,
        description: "                     ",
        imageSrc: "http://dl.dropbox.com/u/40036711/Images/facebook-icon-32.png"
    },
    {
        text: "bold",
        value: 2,
        selected: false,
        description: "                      ",
        imageSrc: "http://dl.dropbox.com/u/40036711/Images/twitter-icon-32.png"
    },
    {
        text: "italic",
        value: 3,
        selected: false,
        description: "                      ",
        imageSrc: "http://dl.dropbox.com/u/40036711/Images/linkedin-icon-32.png"
    },
    {
        text: "oblique",
        value: 4,
        selected: false,
        description: "                      ",
        imageSrc: "http://dl.dropbox.com/u/40036711/Images/foursquare-icon-32.png"
    }
]
    , init: function () {
        var _this = TShirtDesignTool;
        _this.canvasInit();
    }
    , canvasInit: function () {
            window.canvas = new fabric.Canvas('canvas');
            canvas.setHeight($('#canvas-container').height());
            canvas.setWidth($('#canvas-container').width());
            var img = new Image();
            img.src = '/TshirtDesignTool/img/White-1-F.jpg';
            img.onload = function(){
                canvas.setBackgroundImage(img.src, canvas.renderAll.bind(canvas), {
                    originX: 'left',
                    originY: 'top',
                    left: 0,
                    top: 0,
                    width:canvas.getWidth(),
                    height:canvas.getHeight()
                });
            };

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
            //document.onkeydown = function(e) {
            //    if (46 === e.keyCode || e.keyCode===110) {
            //        var activeObject=window.canvas.getActiveObject();
            //        if(activeObject!==null){
            //            window.canvas.remove(activeObject);
            //        }
            //        window.canvas.renderAll();
            //        TShirtDesignTool.changeToAddTextPanel();
            //    }
            //}

    }
    , drawText: function () {
            var _canvas=window.canvas;
            var Text = $('#text-panel textarea').val();
            if(Text==="")
                return;
            var SampleText = new fabric.Text(Text, {
                //fontFamily: 'squealer',
                //textAlign:'center',
                fontSize:30,
                letterSpacing: 0
            });
            var left=_canvas.getWidth() / 2- SampleText.getWidth()/2;
            var top=_canvas.getHeight() / 2- SampleText.getHeight();
            SampleText.set({'left':left,'top':top});
            SampleText.on('selected', function() {
                TShirtDesignTool.changeToEditorPanel();
            });
            window.canvas.add(SampleText);
            canvas.renderAll();
            TShirtDesignTool.changeToEditorPanel();
            return;
    }
    , showPanel: function(panelToshow){
            TShirtDesignTool.panels.forEach(function(panel){
                panel===panelToshow ? $('#'+panel).fadeIn(500): $('#'+panel).hide();
            });
}
    , changeToEditorPanel: function(){
            var selectedObject=window.canvas.getActiveObject();
            if(!selectedObject){
                selectedObject=window.canvas.item(0);
            }
            TShirtDesignTool.showPanel('editor-panel');
            $('#editor-panel textarea').val(selectedObject.text);
            $('#editor-panel input[type=color]').val(selectedObject.fill);
            $('#editor-panel input[type=range]').val(selectedObject.radius);
            $('#editor-panel input[type=number]').val(selectedObject.spacing);
            //$('#text-arc-slider').slider('value', selectedObject.radius);
            $('#text-outline-slider').slider('value', selectedObject.strokeWidth);
            $('#editor-panel select option').each(function(){
                if($(this).val()==selectedObject.fontFamily)
                    $(this).attr('selected','selected');
            });
            $('#outline-properties input[type=color]').val(selectedObject.stroke);
            $('#text-spacing').val(selectedObject.letterSpacing);
            $('#font-sizing').val(selectedObject.fontSize);
    }
    , changeToAddTextPanel: function(){
        TShirtDesignTool.showPanel('text-panel');
        $('#text-panel textarea').val('');
    }
    , changeToClipartPanel: function(){
            TShirtDesignTool.showPanel('clip-art-panel');
}
    , changeToUploadImagePanel: function(){
            TShirtDesignTool.showPanel('upload-image-panel');
}
    , changeTshirtSide: function(side){
        var _canvas=window.canvas;
        var imageSrc='/TshirtDesignTool/img/White-1-'+side+'.jpg';
        var img = new Image();
        img.src = imageSrc;
        img.onload = function(){
            _canvas.setBackgroundImage(img.src, _canvas.renderAll.bind(canvas), {
                originX: 'left',
                originY: 'top',
                left: 0,
                top: 0,
                width:canvas.getWidth(),
                height:canvas.getHeight()
            });
        }
        _canvas.clear();
}
    , updateText: function(e){
            var activeObject=window.canvas.getActiveObject();
            if(!activeObject)
                activeObject=window.canvas.item(0);
            activeObject.setText(e);
            canvas.renderAll();
    }
    , setTextFont: function(e){
            var activeObject=window.canvas.getActiveObject();
            if(!activeObject)
                activeObject=window.canvas.item(0);
            activeObject.set('fontFamily',e);
            canvas.renderAll();
    }
    , setTextSpacing: function(e){
            var activeObject=window.canvas.getActiveObject();
            if(!activeObject)
                activeObject=window.canvas.item(0);


             if(activeObject.type=='text'){
                 activeObject.set('letterSpacing', parseInt(e));
             }

            if(activeObject.effect=='arc')
                activeObject.set({
                spacing:-10+parseInt(e)*2});

            //if(activeObject.effect=='STRAIGHT')
            //   var ctext=activeObject.text.split("").join(String.fromCharCode(8239));
            //activeObject.setText(ctext);

            canvas.renderAll();
    }
    , setTextColor: function(e){
            var activeObject=window.canvas.getActiveObject();
            if(!activeObject)
                activeObject=window.canvas.item(0);
            activeObject.setFill(e);
            canvas.renderAll();

    }
    , setTextArc: function(){
        var activeObject=window.canvas.getActiveObject();
        if(!activeObject)
            activeObject=window.canvas.item(0);
        if(!activeObject)
                return;
        var arcSliderValue=parseInt($("#text-arc-slider").slider("value"));

        if( (arcSliderValue <-10 || arcSliderValue >10) && activeObject.type==='text')
            {
                var curveText= new fabric.CurvedText(activeObject.text,{
                    top:activeObject.top,
                    left:activeObject.left,
                    fontFamily:'Times New Roman',
                    //width:activeObject.width,
                    //height:activeObject.height,
                    reverse:arcSliderValue <0,
                    radius:550,
                    effect:'arc',
                    fontSize:activeObject.fontSize,
                    spacing:activeObject.letterSpacing-10,
                    fill:activeObject.fill,
                    textAlign: 'center',
                    stroke:activeObject.stroke,
                    strokeWidth:activeObject.strokeWidth,
                    angle:activeObject.angle
                });
                window.canvas.remove(activeObject);
                window.canvas.add(curveText);
            }
        if( (arcSliderValue>-11 &&arcSliderValue <11) && activeObject.type==='curvedText')
        {
            var SampleText= new fabric.Text(activeObject.text,{
                top:activeObject.top,
                left:activeObject.left,
                textAlign: 'left',
                fontFamily: activeObject.fontFamily,
                fontSize:activeObject.fontSize,
                letterSpacing:activeObject.spacing+10,
                fill:activeObject.fill,
                //stroke:activeObject.stroke,
                strokeWidth:activeObject.strokeWidth
            });
            window.canvas.remove(activeObject);
            window.canvas.add(SampleText);
            window.canvas.setActiveObject(SampleText);
        }
            //if(activeObject.effect=='STRAIGHT')
            //    activeObject.set({
            //        effect:'arc',
            //        spacing:-10,
            //        textAlign: 'center'
            //    });
             if(activeObject.type==='curvedText'){
                 activeObject.set({
                     //textAlign: 'center',
                     reverse:arcSliderValue<0,
                     radius:550-Math.abs(arcSliderValue)*5
                 });
             }

            canvas.renderAll();

    }
    , setTextCircular: function(){
            var activeObject=window.canvas.getActiveObject();
            if(!activeObject)
                activeObject=window.canvas.item(0);
            if(!activeObject)
                return;
            var isChecked=$('#text-circular').is(':checked');
            //console.log(isChecked);
            if(isChecked && activeObject.type!=='curvedText'){
                $( '#text-arc-slider' ).slider({disabled: true});
                var curveText= new fabric.CurvedText(activeObject.text,{
                    top:activeObject.top,
                    left:activeObject.left,
                    fontFamily: activeObject.fontFamily,
                    width:activeObject.width,
                    height:activeObject.height,
                    radius:((activeObject.width/2/3.14)+activeObject.height/2),
                    effect:'circular',
                    fontSize:activeObject.fontSize,
                    //spacing:activeObject.letterSpacing,
                    fill:activeObject.fill,
                    textAlign: 'center',
                    stroke:activeObject.stroke,
                    strokeWidth:activeObject.strokeWidth,
                    angle:activeObject.angle
                });
                window.canvas.remove(activeObject);
                window.canvas.add(curveText);
                window.canvas.setActiveObject(curveText);
            }

            if(!isChecked && activeObject.type!=='text'){
                $( '#text-arc-slider' ).slider({disabled: false});
                var SampleText= new fabric.Text(activeObject.text,{
                    top:activeObject.top,
                    left:activeObject.left,
                    textAlign: 'left',
                    fontFamily: 'sans-serif',
                    fontSize:activeObject.fontSize,
                    letterSpacing:0,
                    fill:activeObject.fill,
                    stroke:activeObject.stroke,
                    strokeWidth:activeObject.strokeWidth
                });
                window.canvas.remove(activeObject);
                window.canvas.add(SampleText);
                window.canvas.setActiveObject(SampleText);
            }
                window.canvas.renderAll();
}
    , setFontSize: function(e){
            var activeObject=window.canvas.getActiveObject();
            if(!activeObject)
                activeObject=window.canvas.item(0);
            if(!activeObject)
                return;
            activeObject.set('fontSize',parseInt(e));
            window.canvas.renderAll();
}
    , setFontStyle: function(fontStyle){
            var activeObject;
            window.canvas.getActiveObject()!== null ? activeObject=window.canvas.getActiveObject():activeObject=window.canvas.item(0);
            if(!activeObject)
                return;
            //alert(fontStyle);
            fontStyle==='bold'
                ?activeObject.set('fontWeight',fontStyle)
                :activeObject.set('fontStyle',fontStyle);
            window.canvas.renderAll();

}
    , addClipartToCanvas: function(imageSrc){
        var img = new Image();
        img.src = imageSrc;
            var imgInstance = new fabric.Image(img, {
                left: 100,
                top: 100,
                angle: 0,
                width:85,
                height:90
            });
        window.canvas.add(imgInstance);
    }
    , uploadImage: function(e){
        //console.log(e);
        var reader = new FileReader();
        reader.onload = function (event)
        {
            var img = new Image();
            img.src = event.target.result;
            var json=event.target.result;
            console.log(json);
            window.canvas.loadFromJSON(json);
            img.onload = function () {
                var image = new fabric.Image(img);
                image.set({
                    left:canvas.getWidth()/2-90,
                    top:canvas.getHeight()/2-90,
                    width:180,
                    height:180,
                    angle: 0,
                    padding:0
                });
                canvas.add(image);
            }
        }
        reader.readAsDataURL(e.target.files[0]);
        window.canvas.renderAll();

}
    , importDesign: function(e){
    //console.log(e);
    alert('on import design')
    var json;
    var reader = new FileReader();
    reader.onload = function (event)
    {
        var img = new Image();
        img.src = event.target.result;
        console.log(event.target.result);
        json=event.target.result;

    }
    //reader.readAsDataURL(e.target.files[0]);
    window.canvas.loadFromJSON(json);
    window.canvas.renderAll();

}
    , saveDesign: function(){
        var _canvas=window.canvas;
        var img = new Image();
        img.setAttribute('crossOrigin', 'anonymous');
        img=_canvas.toDataURL("image/png");
        //img==_canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        //console.log(img);
        //img=img.replace("image/octet-stream", "image/jpeg");
        //console.log(img);
        //img=img.replace("image/jpeg", "image/gif");
        //console.log(img);
        //img=img.replace("image/gif", "image/bmp");
        //console.log(img);
        window.open(img);
}
    , setOutline: function(){
            var activeObject;
            window.canvas.getActiveObject()!== null ? activeObject=window.canvas.getActiveObject():activeObject=window.canvas.item(0);
            if(!activeObject)
                return;

            var isChecked=$('#text-outline').is(':checked');
            if(isChecked)
            {
                $("#outline-properties").fadeIn(200);
                $('#text-outline-slider .ui-slider-range').css('background','#d8d8d8');
                $('#text-outline-slider .ui-slider-handle').css('background','#fff');
                $('#text-outline-color').val('#d8d8d8');
                return;
            }
            else{
                activeObject.setStrokeWidth(0);
                $("#outline-properties").hide();
            }
            window.canvas.renderAll();
}
    , setOutlineColor: function(strokeColor){
            var activeObject;
            window.canvas.getActiveObject()!== null ? activeObject=window.canvas.getActiveObject():activeObject=window.canvas.item(0);
            if(!activeObject)
                return;
            activeObject.setStroke(strokeColor);
            var strokeWidth=$( "#text-outline-slider" ).slider( "value" );
            activeObject.setStrokeWidth(strokeWidth);
            $('#text-outline-slider .ui-slider-range').css('background',strokeColor);
            window.canvas.renderAll();
}
    , setOutlineWidth: function(){
            var strokeWidth=$( "#text-outline-slider" ).slider( "value" );
            var activeObject;
            window.canvas.getActiveObject()!== null ? activeObject=window.canvas.getActiveObject():activeObject=window.canvas.item(0);
            if(!activeObject)
                return;
            activeObject.setStrokeWidth(strokeWidth);
            window.canvas.renderAll();
}
};

$(document).ready(function () {
    TShirtDesignTool.init();

        $('#text-arc-slider').slider({
            orientation: "horizontal",
            range: "min",
            min:-100,
            max: 100,
            change: TShirtDesignTool.setTextArc
        });
        $('#text-arc-slider').slider("value", 0);

        $("#text-outline-slider").slider({
            orientation: "horizontal",
            range: "min",
            max: 3,
            change: TShirtDesignTool.setOutlineWidth
        });
        $("#text-outline-slider").slider("value", 0);

    $("#text-color,#text-outline-color").kendoColorPicker({
        palette: "basic",
        tileSize: 4
    });
    $( "#upload-image" ).change(function(e) {
        TShirtDesignTool.uploadImage(e);
    });
    $("#import-design" ).change(function(e) {
        alert('implementation is in process');
        return;
        TShirtDesignTool.importDesign(e);
    });

    $('#font-style').ddslick({
        data: TShirtDesignTool.fontStyleDropdownData,
        width:190,
        imagePosition: "left",
        selectText: "Select font style",
        onSelected: function (data) {
            //console.log(data);
            TShirtDesignTool.setFontStyle(data.selectedData.text);
        }
    });
/*
    $('#fonts-standard').ddslick({
        data: TShirtDesignTool.fontStyleDropdownData,
        width:190,
        imagePosition: "left",
        selectText: "Select font style",
        onSelected: function (data) {
            //console.log(data);
            TShirtDesignTool.setFontStyle(data.selectedData.text);
        }
    });*/

    $(document).foundation();
});