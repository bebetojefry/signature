var wrapper = document.getElementById("signature-pad"),
clearButton = wrapper.querySelector("[data-action=clear]"),
saveButton = wrapper.querySelector("[data-action=save]"),
canvas = wrapper.querySelector("canvas"),
signaturePad;

function resizeCanvas() {
    var ratio =  Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);
    
    $('.signature-list').css('height', $(window).height()+'px');
}

window.onresize = resizeCanvas;
resizeCanvas();

signaturePad = new SignaturePad(canvas, {
    penColor: '#000'
});

// added prototype function to remove signature whitespace
SignaturePad.prototype.removeBlanks = function () {
    var imgWidth = this._ctx.canvas.width;
    var imgHeight = this._ctx.canvas.height;
    var imageData = this._ctx.getImageData(0, 0, imgWidth, imgHeight),
    data = imageData.data,
    getAlpha = function(x, y) {
        return data[(imgWidth*y + x) * 4 + 3]
    },
    scanY = function (fromTop) {
        var offset = fromTop ? 1 : -1;

        // loop through each row
        for(var y = fromTop ? 0 : imgHeight - 1; fromTop ? (y < imgHeight) : (y > -1); y += offset) {

            // loop through each column
            for(var x = 0; x < imgWidth; x++) {
                if (getAlpha(x, y)) {
                    return y;                        
                }      
            }
        }
        return null; // all image is white
    },
    scanX = function (fromLeft) {
        var offset = fromLeft? 1 : -1;

        // loop through each column
        for(var x = fromLeft ? 0 : imgWidth - 1; fromLeft ? (x < imgWidth) : (x > -1); x += offset) {

            // loop through each row
            for(var y = 0; y < imgHeight; y++) {
                if (getAlpha(x, y)) {
                    return x;                        
                }      
            }
        }
        return null; // all image is white
    };

    var cropTop = scanY(true),
    cropBottom = scanY(false),
    cropLeft = scanX(true),
    cropRight = scanX(false);

    var relevantData = this._ctx.getImageData(cropLeft, cropTop, cropRight-cropLeft, cropBottom-cropTop);
    this._canvas.width = cropRight-cropLeft;
    this._canvas.height = cropBottom-cropTop;
    this._ctx.clearRect(0, 0, cropRight-cropLeft, cropBottom-cropTop);
    this._ctx.putImageData(relevantData, 0, 0);
};

clearButton.addEventListener("click", function (event) {
    signaturePad.clear();
});

$('#frmSign').on('submit', function(){
    if (signaturePad.isEmpty()) {
        alert("Please provide signature first.");
    } else {
        $('[data-action=save]').text('Saving...');
        $('[data-action=save]').attr('disabled', 'disabled');
        
        // remove signature whitespace
        signaturePad.removeBlanks();
        var sign = signaturePad.toDataURL();
        var name = $('#txtName').val();
        
        //clear pad
        signaturePad.clear();
        $('#txtName').val('');
        
        // ajax call to save sign
        $.ajax('app_dev.php/save', {
            type: 'POST',
            data: {
                name: name,
                sign: sign
            },
            success: function(response){
                $('[data-action=save]').text('Save');
                $('[data-action=save]').removeAttr('disabled');
                var sign_html = '<div class="sign"><img src="'+sign+'" width="200"><span>'+name+'</span></div>';
                $('.signature-list').append(sign_html);
                alert(response);
                resizeCanvas();
            }
        });
    }
    
    return false;
});