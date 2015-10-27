var TShirtDesignTool =
{
     panels:['#text-panel', '#editor-panel', '#clip-art-panel']
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

    //fabric.Image.fromURL('http://i2.ooshirts.com/images/lab_shirts/Cobalt-1-F.jpg', function(oImg) {
    //    // scale image down, and flip it, before adding it onto canvas
    //    oImg.scale(0.5).setFlipX(true);
    //    canvas.add(oImg);
    //});



        //canvas.renderAll();

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
        document.onkeydown = function(e) {
            if (46 === e.keyCode || e.keyCode===110) {
                var activeObject=window.canvas.getActiveObject();
                if(activeObject!==null){
                    window.canvas.remove(activeObject);
                }
                window.canvas.renderAll();
                TShirtDesignTool.changeToAddTextPanel();
            }
        }

    }
    , drawText: function () {
            var _canvas=window.canvas;
            var Text = $('#text-panel textarea').val();
            if(Text==="")
                return;
            var SampleText = new fabric.Text(Text, {
                //fontFamily: 'squealer',
                fontSize:30,
                letterSpacing: 0
            });
            var left=_canvas.getWidth() / 2- SampleText.getWidth()/2;
            var top=_canvas.getHeight() / 2- SampleText.getHeight();
            SampleText.set({'left':left,'top':top});
            SampleText.on('selected', function() {
                TShirtDesignTool.changeToEditorPanel();
            });

            //var curveText= new fabric.CurvedText(Text,{
            //    textAlign: 'left',
            //    fontFamily: 'sans-serif'
            //});
            //curveText.on('selected', function() {
            //    TShirtDesignTool.changeToEditorPanel();
            //});
            //window.canvas.add(curveText);
            window.canvas.add(SampleText);
            canvas.renderAll();
            TShirtDesignTool.changeToEditorPanel();
            return;
    }
    , showPanel: function(panelToshow){
            var _this=TShirtDesignTool;
            $(_this.panels).each(function(){
                var value=this.concat();
                value===panelToshow ? $(value).fadeIn(500):$(value).hide();
            });
}
    , changeToEditorPanel: function(){
            var selectedObject=window.canvas.getActiveObject();
            if(!selectedObject){
                selectedObject=window.canvas.item(0);
            }
            TShirtDesignTool.showPanel('#editor-panel');
            $('#editor-panel textarea').val(selectedObject.text);
            $('#editor-panel input[type=color]').val(selectedObject.fill);
            $('#editor-panel input[type=range]').val(selectedObject.radius);
            $('#editor-panel input[type=number]').val(selectedObject.spacing);
            //$('#text-arc-slider').slider('value', selectedObject.radius);
            $('#text-outline-slider').slider('value', selectedObject.strokeWidth);
            $('#editor-panel select option').each(function(){
                //$this=$(this);
                //var value=$this.val();
                if($(this).val()==selectedObject.fontFamily)
                    $(this).attr('selected','selected');

            });
            $('#outline-properties input[type=color]').val(selectedObject.stroke);
            $('#text-spacing').val(selectedObject.letterSpacing);
            $('#font-sizing').val(selectedObject.fontSize);

            //$(document).foundation('slider', 'reflow');
    }
    , changeToAddTextPanel: function(){
        TShirtDesignTool.showPanel('#text-panel');
        $('#text-panel textarea').val('');
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
        var e=$("#text-arc-slider").slider("value");

            if(!activeObject)
                return;

        if(parseInt(e)>=10 && activeObject.type==='text')
            {
                var curveText= new fabric.CurvedText(activeObject.text,{
                    top:activeObject.top,
                    left:activeObject.left,
                    fontFamily: activeObject.fontFamily,
                    //width:activeObject.width,
                    //height:activeObject.height,
                    radius:900,
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
        if(parseInt(e)<10 && activeObject.type==='curvedText')
        {
            var SampleText= new fabric.Text(activeObject.text,{
                top:activeObject.top,
                left:activeObject.left,
                textAlign: 'left',
                fontFamily: 'sans-serif',
                fontSize:activeObject.fontSize,
                letterSpacing:activeObject.spacing,
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
                     textAlign: 'center',
                     reverse:parseInt(e)<0,
                     radius:950-Math.abs(e)*5
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
    , setFontStyle: function(e){

}
    , changeToClipartPanel: function(){
        TShirtDesignTool.showPanel('#clip-art-panel');
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
    , saveDesign: function(){
        var _canvas=window.canvas;
        var img = new Image();
        img.setAttribute('crossOrigin', 'anonymous');
        img=_canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        window.open(img);
}
    , setOutline: function(e){
            $("#outline-properties").toggle();
            var activeObject=window.canvas.getActiveObject();
            if(!activeObject)
                activeObject=window.canvas.item(0);
            if(activeObject)
                activeObject.setStrokeWidth(0);
            $('#text-outline-slider .ui-slider-range').css('background','#d8d8d8');
            $('#text-outline-slider .ui-slider-handle').css('background','#fff');
            $('#outline-properties input[type=color]').val('#d8d8d8');
            window.canvas.renderAll();
}
    , setOutlineColor: function(e){
            var activeObject=window.canvas.getActiveObject();
            if(!activeObject)
                activeObject=window.canvas.item(0);
            if(activeObject)
                activeObject.setStroke(e);
            $('#text-outline-slider .ui-slider-range').css('background',e);
            //$('#text-outline-slider .ui-slider-handle').css('background',e);
            window.canvas.renderAll();
}
    , setOutlineWidth: function(){
            var e=$( "#text-outline-slider" ).slider( "value" );
            var activeObject=window.canvas.getActiveObject();
            if(!activeObject)
                activeObject=window.canvas.item(0);
            if(activeObject)
                 activeObject.setStrokeWidth(e);
            window.canvas.renderAll();
}
};

$(document).ready(function () {
    TShirtDesignTool.init();

        $('#text-arc-slider').slider({
            orientation: "horizontal",
            range: "min",
            max: 180,
            //slide: refreshSwatch,
            change: TShirtDesignTool.setTextArc
        });
        $('#text-arc-slider').slider("value", 0);

        $("#text-outline-slider").slider({
            orientation: "horizontal",
            range: "min",
            max: 5,
            //slide: refreshSwatch,
            change: TShirtDesignTool.setOutlineWidth
        });
        $("#text-outline-slider").slider("value", 0);

    $(document).foundation();
});
