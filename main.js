const imgToBeSegmented = document.getElementById('imgToBeSegmented');
const imgToBeSegmentedPreview = document.getElementById('imgToBeSegmentedPreview');

imgToBeSegmented.addEventListener('change', function () {
  const file = this.files[0];
  if(file){
    const reader = new FileReader();
    reader.addEventListener('load', function () {
      imgToBeSegmentedPreview.src = reader.result;
      imgToBeSegmentedPreview.style.display = 'block';
    });
    reader.readAsDataURL(file);
  }
});

const segmentationForm = document.getElementById('segmentationForm');
segmentationForm.addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent the default form submission

  // Call your function to handle the API request here
  segmentationApiRequest();
});

function classificationRequest() {
  const apiUrl = 'https://ravindrawiguna-classification-coagulation.hf.space/upload';
  fetch(apiUrl, {
    method: 'POST',
    body: new FormData(segmentationForm),
  })
  .then(response => response.json())
  .then(data => {
      console.log('API Response:', data);
      // Handle the response as needed
  })
  .catch(error => {
      console.error('Error:', error);
      // Handle errors
  });

}