var panels = [ '#text-panel', '#editor-panel', '#clip-art-panel' ];


function addPanel(panelToAdd) {

    for(i=0; i< panels.length; i++)
    {
        $(panelToAdd).fadeIn(500);

        if(panels[i] !== panelToAdd)
        {
            $(panels[i]).hide();
        }
    }
}

var TShirtDesignTool =
{
    init: function () {
        var _this = TShirtDesignTool;
        _this.canvasInit();
    }
    , canvasInit: function () {
        window.canvas = new fabric.Canvas('canvas');
        canvas.setHeight(430);
        canvas.setWidth(440);

    var img = new Image();
    img.src = '/TshirtDesignTool/img/White-1-F.jpg';
    img.onload = function(){
        canvas.setBackgroundImage(img.src, canvas.renderAll.bind(canvas), {
            originX: 'left',
            originY: 'top',
            left: 0,
            top: 0,
            width:440,
            height:430
        });
    };



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
                textAlign: 'center',
                id:'CT'
            });

            curveText.on('selected', function() {
                TShirtDesignTool.changeToEditorPanel();
            });

            window.canvas.add(curveText);
            canvas.renderAll();
            TShirtDesignTool.changeToEditorPanel();
            return;
    }
    , changeToEditorPanel: function(){
            var selectedObject=window.canvas.getActiveObject();
            if(!selectedObject){
                selectedObject=window.canvas.item(0);
            }

            addPanel('#editor-panel');

            $('#editor-panel textarea').val(selectedObject.text);
            $('#editor-panel input[type=color]').val(selectedObject.fill);
            $('#editor-panel input[type=range]').val(selectedObject.radius);
            $('#editor-panel input[type=number]').val(selectedObject.spacing);

            $('#editor-panel select option').each(function(){
                $this=$(this);
                var value=$this.val();
                if(value==selectedObject.fontFamily){
                    $this.attr('selected','selected');
                }
            });
    }
    , changeToAddTextPanel: function(){

        addPanel('#text-panel');

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
    , setTextArc: function(e){
        var activeObject=window.canvas.getActiveObject();

        if(!activeObject)
            activeObject=window.canvas.item(0);

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
    , changeToClipartPanel: function(){
        //$('#text-panel').removeAttr('style');

        addPanel('#clip-art-panel');

}
    , addClipartToCanvas: function(ImageId){
        var imgElement = document.getElementById(ImageId);
        var imgInstance = new fabric.Image(imgElement, {
            left: 100,
            top: 100,
            angle: 0
        });
        window.canvas.add(imgInstance);
    }
    , changeTshirtSide: function(side){
            var imageSrc='/TshirtDesignTool/img/White-1-'+side+'.jpg';
            var img = new Image();
            img.src = imageSrc;
            img.onload = function(){
                window.canvas.setBackgroundImage(img.src, window.canvas.renderAll.bind(canvas), {
                    originX: 'left',
                    originY: 'top',
                    left: 0,
                    top: 0,
                    width:440,
                    height:430
                });
            }
}

};

$(document).ready(function () {
    $(document).foundation({
        slider: {
            on_change: function(e){
                // do something when the value changes
                //alert('changed');
            }
        }
    });
    TShirtDesignTool.init();

});