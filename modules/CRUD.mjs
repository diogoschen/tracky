import { User } from '/modules/classes.mjs'

// FEATURES DETECTION

export function featureDetection(api) {
    return Modernizr[api] ? true : false
}


// READ/GET DATA
export let appData = { users: [], currentSession: false };
let user;

async function getDataFromFile() {
    let fileData;
    await fetch('./data/backup.json')
        .then(data => data.json())
        .then(data => fileData = data)
        .catch(e => console.error('Backup file is not available', e))
    return fileData
}

async function getDataFromStorage() {
    try {
        return JSON.parse(localStorage.appData);
    }
    catch (e) {
        console.error('Unable to read localStorage data. Will try to read the backup file', e);
        let data = await getDataFromFile();
        return data;
    }
}

export async function getData() {
    try {
        let data
        if (featureDetection('localstorage') && localStorage.appData) {
            console.log('reading local')
            data = await getDataFromStorage();
        } else {
            console.log('reading file')
            data = await getDataFromFile();
        }
        if (!data) { console.error("There's no available data", e) }
        appData = await assignObjIds(data);
        saveDataLocally(data);
        updateCurrentSession();
    }
    catch (e) {
        throw new Error('Unable to get any data, either from the file or localStorage')
    }
}

function getLocation() {
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(
            (position) => resolve(position.coords),
            (error) => reject(error)
        );
    });
};

export async function getWeather() {
    let weather, lat, lon, city, description, icon;
    await getLocation()
        .then(data => { lat = data.latitude; lon = data.longitude; })
        .catch(e => { throw new Error('Location unavailable', e) });

    await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=c3e2e26d276d81e70a8b3409c17c563d`)
        .then(data => data.json())
        .then(data => {
            weather = data.main.temp;
            city = data.name;
            icon = data.weather[0].icon;
            description = data.weather[0].description;
        })
        .catch(e => { throw new Error('No weather available', e) })

    return { weather: Math.floor(weather), city, icon, description }
}

export async function getQuote() {
    let quote
    await fetch('https://type.fit/api/quotes')
        .then(data => data.json())
        .then(data => quote = data[Math.round(Math.random() * data.length)])
        .catch(e => { throw new Error('No quote available', e) })
    return quote
}

async function assignObjIds(data) {
    // in case there are any key items with no ids, assign Ids.
    try {
        let users = data.users;
        let keys = ['tasks', 'links', 'notes', 'projects'];
        for (let [i, user] of users.entries()) {
            user.id = !user.id ? await getId() : user.id
            console.log(user)
            for (let key of keys) {
                for (let item of user[key]) {
                    item.id = !item.id ? await getId() : item.id
                }
            }
            users[i] = new User(user);
        }
        return data
    }
    catch (e) { console.error(new Error('Unable to assign IDs')) }
}

async function getId() {
    let id;
    await fetch('https://www.uuidgenerator.net/api/version1')
        .then(data => data.text())
        .then(data => id = data)
        .catch(e => {
            id = `${new Date().getTime()}`;
            console.error(new Error('Unable to get an ID from uuid generator. A time based id was created'));
        })
    return id
}

// UPDATE DATA
export function getUser(userID = appData.currentSession) {
    let users = appData.users;
    let user = users.find(user => user.id === userID);
    if (user == undefined) {
        new Error(`No user found with ID: ${userID}`);
        return false
    }
    return user
}

export function updateCurrentSession(userID, switchUser = false) {
    let session;
    // se existir um user com esse id e não tiver sido indicado nenhum userID então considerar o userID como o atual
    if (!userID) {
        session = appData.currentSession;
    } if (switchUser) {
        session = userID ? userID : false;
        appData.currentSession = session;
        saveDataLocally();
    }
    user = getUser();
    return user;
}

export function updateKeyItem(id, key, updateValues) {
    let updated = user.updateItemById(id, key, updateValues);
    saveDataLocally();
    return updated;
}



// CREATE DATA
export async function newUser(newUser) {
    newUser.id = await getId();
    let user = new User(newUser);
    appData.users.push(user);
    updateCurrentSession(newUser.id);
    saveDataLocally();
    return user
}

export async function newKeyItem(key, values) {
    let user = getUser();
    values.id = await getId();
    let item = user.newItem(key, values);
    saveDataLocally();
    return item;
}

export function taskClock(taskID, start = true) {
    let task = user.getItemById(taskID, "tasks")
    if (start) {
        task.startTask();
        user.tracking = task.id;
    } else {
        task.stopTask();
        user.tracking = false;
    }
    saveDataLocally();
}

// DELETE DATA
export function deleteUser(userID = currentSession) {
    appData.users = appData.users.filter(user => user.id !== userID);
    updateCurrentSession();
    saveDataLocally();
    return appData.users
}

export function deleteKeyItem(id, key) {
    let user = getUser();
    user.deleteItemById(id, key);
    saveDataLocally();
}

export function deleteTimestamp(taskID, timeID) {
    let user = getUser();
    let task = user.getItemById(taskID, 'tasks');
    console.log(task)
    task.deleteTimestampById(timeID);
    saveDataLocally();
}

// SAVE DATA

export function saveDataLocally(data = appData) {
    localStorage.setItem('appData', JSON.stringify(data));
}

// BACKUP DATA

export function backupFile() {
    try {
        let data = localStorage.appData;
        let blob = new Blob([data], { type: "text/plain" })
        let blobURL = window.URL.createObjectURL(blob);

        let a = document.createElement('a');
        a.href = blobURL;
        a.setAttribute('download', 'backup.json');

        a.click();

        a.remove();
        return blobURL;
    }
    catch (e) { throw new Error('There was an error saving the backup file') }
}


export function clearLocalStorage() {
    localStorage.clear();
    appData = { users: [], currentSession: false };
}