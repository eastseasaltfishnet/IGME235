
function selectBreed(breed) {
    document.getElementById("breedInput").value = breed;
    fetchDogImage();
}


function fetchDogImage() {

    //check the breed
    const breed = document.getElementById("breedInput").value.trim().toLowerCase();

  

    //if user enter a breed the search it, if not random image
    if (breed) {
        apiUrl = `https://dog.ceo/api/breed/${breed}/images/random/20`;
    } else {
        apiUrl = 'https://dog.ceo/api/breeds/image/random/20';
    }

    fetch(apiUrl)
        .then(function(response) {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(function(data) {
            if (data.status === "success") {
                displayImages(data.message);
                document.getElementById('enterAlert').innerText = "Here are some images for " + (breed) + "!";
            }
        })
    
        .catch(function(error) {
            console.error('Error fetching dog images:', error);
            document.getElementById('content').innerHTML = '<p>Error fetching dog images. Please check if your breed is valid</p>';
            document.getElementById('enterAlert').innerText = "Oops somthing goes wrong";
        });
    
}


function displayImages(imgUrl){
    const contentDiv = document.getElementById('content');
    //clear
    contentDiv.innerHTML = '';

    //set img elemet
    imgUrl.forEach(url => {
        const imgElement = document.createElement('img');
        imgElement.src=url;
        imgElement.alt="Random dog image";

        contentDiv.appendChild(imgElement);
    });
}