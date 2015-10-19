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
            var Text = $('#text-panel textarea').val();
            if(Text==="")
                return;
            var SampleText = new fabric.Text("Fabric Text", {
                left: canvas.getWidth() / 2,
                top: canvas.getHeight() / 2,
                //left: 380,
                //top:370,
                fontFamily: 'sans-serif',
                fontSize:30,
                letterSpacing: 8
            });
            var _canvas=window.canvas;
            var curveText= new fabric.CurvedText(Text,{
                textAlign: 'left',
                fontFamily: 'sans-serif'
            });
            var left=_canvas.getWidth() / 2- curveText.getWidth()/2;
            var top=_canvas.getHeight() / 2- curveText.getHeight();
            curveText.set({'left':left,
                            'top':top,
                letterSpacing: 10
                        });

            curveText.on('selected', function() {
                TShirtDesignTool.changeToEditorPanel();
            });

    SampleText.on('selected', function() {
        TShirtDesignTool.changeToEditorPanel();
    });

            window.canvas.add(curveText);
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
    console.log(selectedObject.get('letterSpacing'));
            TShirtDesignTool.showPanel('#editor-panel');



            $('#editor-panel textarea').val(selectedObject.text);
            $('#editor-panel input[type=color]').val(selectedObject.fill);
            $('#editor-panel input[type=range]').val(selectedObject.radius);
            $('#editor-panel input[type=number]').val(selectedObject.spacing);
            //$('#text-arc-slider').slider('value', selectedObject.radius);
            $('#text-outline-slider').slider('value', selectedObject.strokeWidth);
            $('#editor-panel select option').each(function(){
                $this=$(this);
                var value=$this.val();
                if(value==selectedObject.fontFamily){
                    $this.attr('selected','selected');
                }
            });
            $('#outline-properties input[type=color]').val(selectedObject.stroke);

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
            //activeObject.set('spacing', parseInt(e));

            if(activeObject.effect=='arc')
                activeObject.set({
                spacing:-10+parseInt(e)*2});

            if(activeObject.effect=='STRAIGHT')
               var ctext=activeObject.text.split("").join(String.fromCharCode(8239));

            activeObject.setText(ctext);
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
        var e=$( "#text-arc-slider" ).slider( "value" );
        if(activeObject)
        {
            if(parseInt(e)<10 && parseInt(e)>-10 )
            {
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
   // console.log(e);

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

        $("#text-arc-slider").slider({
            orientation: "horizontal",
            range: "min",
            max: 180,
            //slide: refreshSwatch,
            change: TShirtDesignTool.setTextArc
        });
        $("#text-arc-slider").slider("value", 0);

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

fabric.util.object.extend(fabric.Text.prototype, {
    _renderChars: function(method, ctx, chars, left, top) {
        var characters = String.prototype.split.call(chars, ''),
            index = 0,
            current,
            currentPosition = left,
            y = top,
            align = 1,
            ls = 0;

        if (this.letterSpacing !== undefined)
            ls = this.letterSpacing;

        if (this.textAlign === 'right') {
            characters = characters.reverse();
            align = -1;
        } else if (this.textAlign === 'center') {
            var totalWidth = 0;
            for (var i = 0; i < characters.length; i++) {
                totalWidth += (ctx.measureText(characters[i]).width + ls);
            }
            //currentPosition = x - (totalWidth / 2); //original
            currentPosition = left - (totalWidth / 2); //just randomly replaced x with 'left' to avoid error, should be taken care of before finalizing
        }

        while (index < chars.length) {
            current = characters[index++];
            ctx.fillText(current, currentPosition, y);
            currentPosition += (align * (ctx.measureText(current).width + ls));
        }
    },

})

fabric.util.object.extend(fabric.IText.prototype, {
    letterSpacing : 0,
    _getTextWidth: function(ctx, textLines) {
        var maxWidth = ctx.measureText(textLines[0] || '|').width;
        var maxLineLength = textLines[0].length;
        for (var i = 1, len = textLines.length; i < len; i++) {
            var currentLineWidth = ctx.measureText(textLines[i]).width;
            if (currentLineWidth > maxWidth) {
                maxWidth = currentLineWidth;
                maxLineLength = textLines[i].length;
            }
        }

        return maxWidth + (this.letterSpacing * maxLineLength);
    },
    _getWidthOfChar: function(ctx, _char, lineIndex, charIndex) {
        if (this.textAlign === 'justify' && /\s/.test(_char)) {
            return this._getWidthOfSpace(ctx, lineIndex);
        }

        var styleDeclaration = this._getStyleDeclaration(lineIndex, charIndex);
        this._applyFontStyles(styleDeclaration);
        var cacheProp = this._getCacheProp(_char, styleDeclaration);

        if (this._charWidthsCache[cacheProp] && this.caching) {
            return this._charWidthsCache[cacheProp] + this.letterSpacing;
        }
        else if (ctx) {
            ctx.save();
            var width = this._applyCharStylesGetWidth(ctx, _char, lineIndex, charIndex);
            ctx.restore();
            return width + this.letterSpacing;
        }
    },
    _getWidthOfSpace: function (ctx, lineIndex) {
        var lines = this.text.split(this._reNewline),
            line = lines[lineIndex],
            words = line.split(/\s+/),
            wordsWidth = this._getWidthOfWords(ctx, line, lineIndex),
            widthDiff = this.width - wordsWidth,
            numSpaces = words.length - 1,
            width = widthDiff / numSpaces;

        return width + this.letterSpacing;
    }

});