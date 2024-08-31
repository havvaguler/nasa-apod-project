
const resultNav = document.querySelector('.result-nav');
const favoritesNav = document.querySelector('.favorites-nav');
const cardContainer = document.querySelector('.card-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

//API
const count = 10;
const apiKey = 'DEMO_KEY';
const apiURL = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

//Datas
let resultArr = [];
let favorites = {};


// Scroll to Top, Remove Loader, Show Content
const showContent = (page) => {
    loader.classList.add('hidden');
    if (page === 'results') {
        resultNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
    } else {
        favoritesNav.classList.remove('hidden');
        resultNav.classList.add('hidden');
    }
}

// Create DOM Nodes
const createDOM = (page) => {
    const currentArr = page === 'results' ? resultArr : Object.values(favorites);
    currentArr.forEach(result => {
        //Card
        const card = document.createElement('div');
        card.classList.add('card');
        // Link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';
        // Image
        const img = document.createElement('img');
        img.src = result.url;
        img.alt = "NASA Picture of the Day";
        img.loading = 'lazy';
        img.classList.add('card-img');
        //Card Body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        //Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        //saveText
        const saveText = document.createElement('a');
        if (page === 'results') {
            saveText.textContent = 'Add To Favorites';
            saveText.addEventListener('click', () => saveFavorites(result.url));
        } else {
            saveText.textContent = 'Remove To Favorites';
            saveText.addEventListener('click', () => removeFavorites(result.url));
        }
        // Card Text
        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.textContent = result.explanation;
        // Footer
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        // Date
        const date = document.createElement('strong');
        date.textContent = result.date;
        // Copyright
        const copyright = document.createElement('span');
        const copyrightResult = result.copyright === undefined ? '' : result.copyright;
        copyright.textContent = copyrightResult;

        cardContainer.append(card);
        card.append(link, cardBody);
        link.appendChild(img);
        cardBody.append(cardTitle, saveText, cardText, footer);
        footer.append(date, copyright);
    })
}

// Update DOM
const updateDOM = (page) => {
    if (localStorage.getItem('nasaFavorites')) {
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
    }
    cardContainer.textContent = '';
    showContent(page);
    createDOM(page);
}


const getNasaPictures = async () => {
    // Show to loader:
    loader.classList.remove('hidden');
    try {
        const res = await fetch(apiURL);
        resultArr = await res.json();
        updateDOM('results');
    } catch (err) {
        console.log(err);
    }
}


const saveFavorites = (itemUrl) => {
    resultArr.forEach(result => {
        if (result.url.includes(itemUrl) && !favorites[itemUrl]) {
            favorites[itemUrl] = result;
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
            showConfirmation();
        }
    })
}


const showConfirmation = () => {
    saveConfirmed.hidden = false;
    setTimeout(() => {
        saveConfirmed.hidden = true;
    }, 2000);
}



const removeFavorites = (itemUrl) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (favorites[itemUrl]) {
        delete favorites[itemUrl];
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        updateDOM('favorites');
    }
}


getNasaPictures();



