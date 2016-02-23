/**
 * Created by bs062 on 2/16/2016.
 */

TShirtDesignTool.prototype.uploadImage = function (e) {
    //console.log(e);
    var reader = new FileReader();
    reader.onload = function (event) {
        var img = new Image();
        img.src = event.target.result;
        img.onload = function () {
            var image = new fabric.Image(img);
            image.set({
                left: canvas.getWidth() / 2 - 90,
                top: canvas.getHeight() / 2 - 90,
                width: 180,
                height: 180,
                angle: 0,
                padding: 0
            });
            canvas.add(image);
        }
    }
    reader.readAsDataURL(e.target.files[0]);
    window.canvas.renderAll();

};

TShirtDesignTool.prototype.importDesign = function (e) {
    var reader = new FileReader();
    reader.onload = function (event) {
        //console.log(event.target.result);
        window.canvas.loadFromJSON(event.target.result);
    }
    reader.readAsText(e.target.files[0]);
    window.canvas.renderAll();

};