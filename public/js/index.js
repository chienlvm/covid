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
  // let inputTag = data.map((item, index) => `<input type="hidden" name="content_${index}" value="${item.insert}">`).join('');
  // let inputTagLength = `<input type="hidden" name="length" value="${data.length}">`;
  // document.querySelectorAll('.js-formSubmit')[0].insertAdjacentHTML("beforeend", inputTagLength);
  // console.log('xxx', quill.getContents());
  console.log(data);
  data.map((item, index) => {
    console.log(item);
    $(`input[name=content_${index + 1}]`).val(item.insert);
  })
  // return document.querySelectorAll('.js-formSubmit')[0].insertAdjacentHTML("beforeend", inputTag);
}
$('#form-submit').submit(function (e) {
 //  e.preventDefault();
  getSignaturePad();
  getContentQuill();// call this function here, sets the imageData right before submitting the form.
  return true; // returning true submits the form.
});
