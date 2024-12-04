//press enter to search
window.onload = function () {
    const breedInput = document.querySelector('#breedInput');
    const lastSearch = localStorage.getItem('lastSearch');
    if (lastSearch) {
        breedInput.value = lastSearch;
    }

    //press enter to search
    document.onkeydown = function (event) {
        if (event.key === 'Enter') {
            fetchDogImage();
        }
    };

};

// help to reset to default page after using show all breed
function selectBreed(breed) {
    document.querySelector('#breedInput').value = breed;
    fetchDogImage();
    resetToInitialView();
}

// fecth dog image!
function fetchDogImage() {
    const breed = document.querySelector('#breedInput').value.trim().toLowerCase();
    let apiUrl = '';

    if (breed) {
        apiUrl = `https://dog.ceo/api/breed/${breed}/images/random/50`;
        localStorage.setItem('lastSearch', breed);
    } else {
        apiUrl = 'https://dog.ceo/api/breeds/image/random/50';
    }

    fetch(apiUrl)
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(function (data) {
            if (data.status === 'success') {
                displayImages(data.message);
                const alertText = breed
                    ? `Here are some images for ${breed}!`
                    : 'Here are some images for random dogs!';
                document.querySelector('#enterAlert').innerText = alertText;
            }
        })
        .catch(function (error) {
            document.querySelector('#content').innerHTML =
                '<p>Error fetching dog images.<br></p>';

            document.querySelector('#enterAlert').innerText = 'Please check if your breed is valid';
        });
}

// see all the breed of the dog
function seeAllBreeds() {
    const apiUrl = 'https://dog.ceo/api/breeds/list/all';

    fetch(apiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.status === 'success') {
                displayBreeds(data.message);
            }
        })
        .catch(function () {
            document.querySelector('#enterAlert').innerText =
                'Error fetching breed list. Please try again later.';
        });
}

// disaply all the breed by button
function displayBreeds(breeds) {
    const breedButtonsContainer = document.querySelector('#breedButtons');

    breedButtonsContainer.innerHTML = '';

    for (let breed in breeds) {
        if (breeds.hasOwnProperty(breed)) {
            // permutation  all the sub breed
            if (breeds[breed].length > 0) {

                for (let i = 0; i < breeds[breed].length; i++) {
                    const subBreed = breeds[breed][i];
                    const subBreedName = subBreed + ' ' + breed;
                    const button = document.createElement('button');


                    button.textContent = subBreedName;
                    button.onclick = function () {
                        selectBreed(breed + '/' + subBreed);
                    };
                    breedButtonsContainer.appendChild(button);
                }
                //if no sub breed
            } else {
                const button = document.createElement('button');
                //make a capptile for first letter here
                const firstLetter = breed.charAt(0).toUpperCase();
                const restOfName = breed.slice(1);
                button.textContent = firstLetter + restOfName;

                button.onclick = function () {
                    selectBreed(breed);
                };

                breedButtonsContainer.appendChild(button);
            }
        }
    }

    //return to the deafualt format
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Return to Initial View';
    resetButton.onclick = resetToInitialView;
    breedButtonsContainer.appendChild(resetButton);
}


// reset to the default layout
function resetToInitialView() {
    const breedButtonsContainer = document.querySelector('#breedButtons');
    breedButtonsContainer.innerHTML = `
        <button onclick="selectBreed('akita')">Akita</button>
        <button onclick="selectBreed('beagle')">Beagle</button>
        <button onclick="selectBreed('boxer')">Boxer</button>
        <button onclick="selectBreed('bulldog')">Bulldog</button>
        <button onclick="selectBreed('husky')">Husky</button>
        <button onclick="selectBreed('poodle')">Poodle</button>
        <button onclick="selectBreed('retriever')">Retriever</button>
        <button onclick="selectBreed('spaniel')">Spaniel</button>
        <button onclick="selectBreed('terrier')">Terrier</button>
    `;
}

//  display the image and show the favourite star while hover
function displayImages(imgUrls) {
    const contentDiv = document.querySelector('#content');
    if (!contentDiv) return;

    contentDiv.innerHTML = '';

    imgUrls.forEach(function (url) {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'img-container';
        const imgElement = document.createElement('img');
        imgElement.src = url;
        imgElement.alt = 'Random dog image';

        // favourite button
        const favButton = document.createElement('span');
        favButton.className = 'fav-button';

        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favButton.textContent = favorites.includes(url) ? '★' : '☆';

        // favourite
        favButton.onclick = function () {
            addToFavorites(url);
            favButton.textContent = '★';
        };

        imgContainer.appendChild(imgElement);
        imgContainer.appendChild(favButton);
        contentDiv.appendChild(imgContainer);
    });
}


// add to favourite
function addToFavorites(url) {
    let favorites = localStorage.getItem('favorites');
    if (!favorites) {
        favorites = [];
    } else {
        favorites = JSON.parse(favorites);
    }

    if (!favorites.includes(url)) {
        favorites.push(url);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}

// check favourite
function viewFavorites() {
    let favorites = localStorage.getItem('favorites');
    if (!favorites) {
        favorites = [];
    } else {
        favorites = JSON.parse(favorites);
    }

    const contentDiv = document.querySelector('#content');
    contentDiv.innerHTML = '';

    if (favorites.length > 0) {
        favorites.forEach(function (url) {
            const imgElement = document.createElement('img');
            imgElement.src = url;
            imgElement.alt = 'Favorite dog image';
            contentDiv.appendChild(imgElement);
        });
    } else {
        contentDiv.innerHTML = '<p>No favorite images yet. Start adding some!</p>';
    }
}
