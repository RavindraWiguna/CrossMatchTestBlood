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
// const useSegmentationCheck = document.getElementById('useSegmentationCheck');
// useSegmentationCheck.addEventListener('change', function () {
//   // if checked then disable the classification input
//   classificationInputField = document.getElementById('classificationInputField');
//   if(this.checked){
//     classificationInputField.disabled = true;
//   } else {
//     classificationInputField.disabled = false;
//   }
// });

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
      let classificationProbability = document.getElementById('classificationProbability');
      classificationResult.innerHTML = data['prediction'];
      // now add un ordered list for the probability
      classificationProbability.innerHTML = '';
      let probabilityList = document.createElement('ul');
      for (const [key, value] of Object.entries(data['probability'])) {
        let probabilityListItem = document.createElement('li');
        probabilityListItem.innerHTML = `${key}: ${value}`;
        probabilityList.appendChild(probabilityListItem);
      }
      classificationProbability.appendChild(probabilityList);
  })
  .catch(error => {
      console.error('Error:', error);
      // Handle errors
      alert('Error:', error);
  });

}

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  var sliceSize = 1024;
  var byteCharacters = atob(base64Data);
  var bytesLength = byteCharacters.length;
  var slicesCount = Math.ceil(bytesLength / sliceSize);
  var byteArrays = new Array(slicesCount);

  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      var begin = sliceIndex * sliceSize;
      var end = Math.min(begin + sliceSize, bytesLength);

      var bytes = new Array(end - begin);
      for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
          bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
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
      let base64str = 'data:image/png;base64,' + data['image'];
      let container = new DataTransfer();
      let blob = base64toBlob(data['image'], 'image/png');
      let file = new File([blob], "img.jpg",{type:"image/jpeg", lastModified:new Date().getTime()});
      container.items.add(file);
      imgToBeClassified.files = container.files;
      setImgPreview(file, imgToBeClassifiedPreview);
  })
  .catch(error => {
      console.error('Error:', error);
      // Handle errors
      alert('Error:', error);
  });

}