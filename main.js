/*
Preview Images For Segmentation & Classification
*/
const imgToBeSegmented = document.getElementById('imgToBeSegmented');
const imgToBeSegmentedPreview = document.getElementById('imgToBeSegmentedPreview');
const imgToBeClassified = document.getElementById('imgToBeClassified');
const imgToBeClassifiedPreview = document.getElementById('imgToBeClassifiedPreview');

function setImgPreview(file, elemen) {
  if(file){
    const reader = new FileReader();
    reader.addEventListener('load', function () {
      elemen.src = reader.result;
      elemen.style.display = 'block';
    });
    reader.readAsDataURL(file);
  }
}

imgToBeSegmented.addEventListener('change', function () {
  const file = this.files[0];
  setImgPreview(file, imgToBeSegmentedPreview);
});

imgToBeClassified.addEventListener('change', function () {
  const file = this.files[0];
  setImgPreview(file, imgToBeClassifiedPreview);
});

/*
Tiny itsy bitsy teeny weeny checkbox classification based on segmentation
*/
const useSegmentationCheck = document.getElementById('useSegmentationCheck');
useSegmentationCheck.addEventListener('change', function () {
  // if checked then disable the classification input
  classificationInputField = document.getElementById('classificationInputField');
  if(this.checked){
    classificationInputField.disabled = true;
  } else {
    classificationInputField.disabled = false;
  }
});

/*
Form Handler For Segmentation & Classification
*/
const segmentationForm = document.getElementById('segmentationForm');
const classificationForm = document.getElementById('classificationForm');
segmentationForm.addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent the default form submission
  segmentationRequest();
});

classificationForm.addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent the default form submission
  classificationRequest();
});


/*
Classification & Segmentation API Request
*/
function classificationRequest() {
  const apiUrl = 'https://ravindrawiguna-classification-coagulation.hf.space/upload';
  const formData = new FormData(classificationForm);
  fetch(apiUrl, {
    method: 'POST',
    body: formData,
  })
  .then(response => response.json())
  .then(data => {
      // Handle the response as needed
      let classificationResult = document.getElementById('classificationResult');
      classificationResult.innerHTML = data['prediction'];
  })
  .catch(error => {
      console.error('Error:', error);
      // Handle errors
      alert('Error:', error);
  });

}

function segmentationRequest() {
  const apiUrl = 'https://januarevan-crossmatch-segmentation.hf.space/segmentation';
  const formData = new FormData(segmentationForm);
  fetch(apiUrl, {
    method: 'POST',
    body: formData,
  })
  .then(response => response.json())
  .then(data => {
      // Handle the response as needed
      let imgToBeClassified = document.getElementById('imgToBeClassified');
      imgToBeClassified.value = data['result'];
  })
  .catch(error => {
      console.error('Error:', error);
      // Handle errors
      alert('Error:', error);
  });

}