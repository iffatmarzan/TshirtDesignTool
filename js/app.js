var TShirtDesignTool =
{
    init: function () {
        var _this = TShirtDesignTool;
        _this.canvasInit();
    }
    , canvasInit: function () {
    window.canvas = new fabric.Canvas('FrontViewCanvas');
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

    window.canvas.add(SampleText);
    return;

}
};

$(document).ready(function () {
    TShirtDesignTool.init();

    $('#add-text-form a').bind("click", function () {

        var Text = $('#add-text-form textarea').val();
        TShirtDesignTool.drawText(Text);

    });
});