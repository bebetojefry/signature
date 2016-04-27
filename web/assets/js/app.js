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
}

window.onresize = resizeCanvas;
resizeCanvas();

signaturePad = new SignaturePad(canvas, {
    penColor: '#000'
});

clearButton.addEventListener("click", function (event) {
    signaturePad.clear();
});

saveButton.addEventListener("click", function (event) {
    if (signaturePad.isEmpty()) {
        alert("Please provide signature first.");
    } else {
        $('[data-action=save]').text('Saving...');
        $('[data-action=save]').attr('disabled', 'disabled');
        
        $.ajax('app_dev.php/save', {
            type: 'POST',
            data: {
                sign: signaturePad.toDataURL()
            },
            success: function(response){
                $('[data-action=save]').text('Save');
                $('[data-action=save]').removeAttr('disabled');
                alert(response);
                signaturePad.clear();
            }
        });
    }
});