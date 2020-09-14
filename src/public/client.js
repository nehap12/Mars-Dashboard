const store = Immutable.Map({
    user: Immutable.Map({ name: "Student" }),
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    curiosityData: {},
    opportunityData: {},
    spiritData: {},
    selectedTab: 'apod'
});

// add our markup to the page
const root = document.getElementById('root');

const updateStore = (store, newState) => {
    debugger;
    const newStore = store.merge(newState);
    render(root, newStore)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}

// create content
const App = (state) => {
    debugger;

    return `
        <header></header>
        <main>
        ${Greeting(state.getIn(['user','name']))}
            <section>
                <h3>Put things on the page!</h3>
                <p>Here is an example section.</p>
                <p>
                    One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of
                    the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.
                    This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other
                    applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image
                    explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;
                    but generally help with discoverability of relevant imagery.
                </p>
            </section>
            <section>
                <button class="tablink" onclick="selectTab('apod')">Image of the Day </button>
                <button class="tablink" onclick="selectTab('curiosity')">Curiosity Rover </button>
                <button class="tablink" onclick="selectTab('opportunity')"> Opportunity Rover </button>
                <button class="tablink" onclick="selectTab('spirit')"> Spirit Rover </button>
                <br>
            </section>
            <section>
                ${displayPage(state)}
            </section>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}

const filterRoverData = (rover) => {
    if(rover && rover.info) {
        return rover.info.photos.filter((obj, i) => i < 4);
    }

    return null;
}

/*
* Higher Order Function that takes an object froma n array as i/p and return 
* the src and the date of the image as o/p
*/
const imageInfoExtractor = (obj) => {
    return {
        imgSrc: obj.img_src,
        date: obj.earth_date
    }
}

const arrayOfImages = (rover) => {
    debugger;
    return rover.map(imageInfoExtractor);
}

/*
* Function to take the rover info as an i/p and display the information to the UI 
*/
const displayRoverData = (rover) => {
    const roverData = filterRoverData(rover);
    debugger;

    const roverDataInfo = roverData[0].rover;
    const roverImage = roverData[0].img_src;

    debugger;

    const imagesArray = arrayOfImages(roverData);

   return (`<div id="curiosity" class="tabcontent">
    <div class="row rover-info">
        <div class="col-md-4">
            <img src="${roverImage}" height="80px" width="40%" class="img">
        </div>
        <div class="col-md-4">
            Name: ${roverDataInfo.name}</br>
            Status: ${roverDataInfo.status}
        </div>
        <div class="col-md-4">
            Landing Date: ${roverDataInfo.landing_date}</br>
            Launch Date: ${roverDataInfo.launch_date}
        </div>
    </div>
    <p class="title">Recent mars images from ${roverDataInfo.name}</p></br>
   <div class="row rover-images">
    <div class="col-md-6 roverImages">
        <img src="${imagesArray[0].imgSrc}" height="100px" width="80%"></br>
        Date of picture taken: ${imagesArray[0].date}
    </div>
    <div class="col-md-6 roverImages">
        <img src="${imagesArray[1].imgSrc}" height="100px" width="80%"></br>
        Date of picture taken: ${imagesArray[1].date}
    </div>
   </div>
   <div class="row rover-images">
   <div class="col-md-6 roverImages">
       <img src="${imagesArray[2].imgSrc}" height="100px" width="80%"></br>
       Date of picture taken: ${imagesArray[2].date}
   </div>
   <div class="col-md-6 roverImages">
       <img src="${imagesArray[3].imgSrc}" height="100px" width="80%"></br>
       Date of picture taken: ${imagesArray[3].date}
   </div>
  </div>
 </div>`) ;
}

/*
* Function to check if the obj is empty or not 
*/
function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}

/*
* Function to take the store as an i/p and check the latest 
* value of selected tab to display the info to the UI
*/
const displayPage = (store) => {
    debugger;
    const storeObj = store.toJS();
    let { selectedTab, apod } = storeObj;
    if(selectedTab === 'apod') {
        const today = new Date()
        const photodate = new Date(apod.date)
        console.log(photodate.getDate(), today.getDate());
    
        console.log(photodate.getDate() === today.getDate());
        if (!apod || apod.date === today.getDate() ) {
            getImageOfTheDay(store)
        }
        debugger;
        // check if the photo of the day is actually type video!
        if(apod.media_type === "video") {
            return (`
                <div id="apod" class="tabcontent">
                    <p>See today's featured video <a href="${apod.url}">here</a></p>
                    <p>${apod.title}</p>
                    <p>${apod.explanation}</p>
                </div>
            `)
        } else {
            if(apod && apod.image) {
                return (`
                <div id="apod" class="tabcontent">
                    <img src="${apod.image.url}" height="350px" width="100%" />
                    <p>${apod.image.explanation}</p>
                </div>
            `)
            } else {
                return (`
                <div id="apod" class="tabcontent">
                 <p>Please Wait..</p>
                </div>
                `)
            }
        }
    } else if(selectedTab === 'curiosity') {
        debugger;
        let { curiosityData } = storeObj;
        if(!isEmpty(curiosityData)) {
            return (displayRoverData(curiosityData));
        } else {
            getCuriosityRoverData(store);
            if(isEmpty(curiosityData)) {
                return (`<div>Loading...</div>`);
            } 
        }
    } else if(selectedTab === 'opportunity') {
        debugger;
        let { opportunityData } = storeObj;
        if(!isEmpty(opportunityData)) {
            return (displayRoverData(opportunityData));
        } else {
            getOpportunityRoverData(store);
            if(isEmpty(opportunityData)) {
                return (`<div>Loading...</div>`);
            } 
        }
    } else if(selectedTab === 'spirit') {
        debugger;
        let { spiritData } = storeObj;
        if(!isEmpty(spiritData)) {
            return (displayRoverData(spiritData));
        } else {
            getSpiritRoverData(store);
            if(isEmpty(spiritData)) {
                return (`<div>Loading...</div>`);
            } 
        }
    } else {
        return (`<div>Loading...</div>`)
    }
}

/*
* Function to determine which tab has been selected
*/
const selectTab = (tabName) => {
    debugger;
    if(tabName === 'apod') {
        updateStore(store, { selectedTab: 'apod' })
    } else if(tabName === 'curiosity') {
        updateStore(store, { selectedTab: 'curiosity' })
    } else if(tabName === 'opportunity') {
        updateStore(store, { selectedTab: 'opportunity' })
    } else if(tabName === 'spirit') {
        updateStore(store, { selectedTab: 'spirit' })
    }
}

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
    const stateObj = state.toJS();
    let { apod } = stateObj;
    debugger;

    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => updateStore(state, { apod }))
}

const getCuriosityRoverData = (state) => {
    const stateObj = state.toJS();
    let { rovers } = stateObj;
    let curiosityRover = rovers[0].toLowerCase();

    fetch(`http://localhost:3000/roverData/${curiosityRover}`)
        .then(res => res.json())
        .then(curiosityData => updateStore(state, { curiosityData }))
}

const getOpportunityRoverData = (state) => {
    const stateObj = state.toJS();
    let { rovers } = stateObj;
    let opportunityRover = rovers[1].toLowerCase();

    fetch(`http://localhost:3000/roverData/${opportunityRover}`)
        .then(res => res.json())
        .then(opportunityData => updateStore(state, { opportunityData }))
}

const getSpiritRoverData = (state) => {
    const stateObj = state.toJS();
    let { rovers } = stateObj;
    let spiritRover = rovers[2].toLowerCase();

    fetch(`http://localhost:3000/roverData/${spiritRover}`)
        .then(res => res.json())
        .then(spiritData => updateStore(state, { spiritData }))
}