//$(function () {
//    var canvas = document.getElementById('FrontViewCanvas'),
//        context = canvas.getContext('2d');
//    make_base();
//
//
//    function make_base() {
//       // base_image = new Image();
//      //  base_image.src = 'img/front.png';
//       // base_image.onload = function () {
//        //    context.drawImage(base_image, 0, 0);
//       // }
//    }
//
//    /**
//     * Created by BS-92 on 10/5/2015.
//     */
//});
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

        var hi = new fabric.Text('hello, world.', {
            left: canvas.getWidth() / 2,
            top: canvas.getHeight() / 2
        });


        canvas.add(hi);
      //  canvas.setWidth($('#FrontViewDiv').width());
      //  canvas.setHeight($('#FrontViewDiv').height());

    }
};

$(document).ready(function()
{
   TShirtDesignTool.init();
});