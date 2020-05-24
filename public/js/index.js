var canvas = document.querySelector("canvas");
var parentWidth = $(canvas).parent().outerWidth();

canvas.setAttribute("width", parentWidth);
var signaturePad = new SignaturePad(document.getElementById('signature-pad'), {
  backgroundColor: 'rgba(255, 255, 255, 0)',
  penColor: 'rgb(0, 0, 0)'
});
var cancelButton = document.getElementById('clear');
cancelButton.addEventListener('click', function (event) {
  event.preventDefault();
  signaturePad.clear();
});
function getSignaturePad() {
  var imageData = signaturePad.toDataURL();
  document.getElementsByName('signature')[0].setAttribute('value', imageData);
}
var quill = new Quill('#quill-container', {
  modules: {
    toolbar: false,
  },
  scrollingContainer: '#scrolling-container',
  placeholder: 'Compose an epic...',
  theme: 'bubble'
});
function getContentQuill() {
  var data  = quill.getContents().ops;
  data.map((item, index) => {
    $(`input[name=content_${index + 1}]`).val(item.insert);
  })
}
$('#form-submit').submit(function (e) {
  getSignaturePad();
  getContentQuill();
  return true;
});
