// -------------------------------------------------------------------------
// <copyright company="BrainStation 23 Ltd.">
//     Copyright (c) 2016 [BrainStation 23 Ltd.](http://brainstation-23.com/)
// </copyright>
// <updated>29-04-2016</updated>
// <author>Mahbubur Rahman Manik</author>
// -------------------------------------------------------------------------

(function (extend) {
    extend.uploadImage = function (e) {
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
    extend.importDesign = function (e) {
        var reader = new FileReader();
        reader.onload = function (event) {
            //console.log(event.target.result);
            window.canvas.loadFromJSON(event.target.result);
        }
        reader.readAsText(e.target.files[0]);
        window.canvas.renderAll();

    };
})(TShirtDesignTool);