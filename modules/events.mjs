import { setAnimation } from './animations.mjs';
import { newUserPage, usersPage, userPage, overviewButtons, overviewTasks, overviewForms, overviewLinks, projectForm, tagsForm, editModal, notesSection, timestampsList, newModal, getPage } from './components.mjs';
import * as crud from './CRUD.mjs';
import { app, temp } from '/modules/global.mjs';

let taskTimer;
let user;

export function globalEvents() {
    app.addEventListener('click', appClickEvents, false);
    app.addEventListener('input', appInputEvents, false);
    app.addEventListener('submit', appSubmitEvents, false);
    app.addEventListener('mouseover', appMouseEvents, false);
}

export function newUserPageEvents() {
    globalEvents();
    app.removeEventListener('mouseover', appMouseEvents, false);
}

export function userPageEvents() {
    user = crud.getUser();
    globalEvents();
    app.removeEventListener('mouseover', appMouseEvents, false);
    app.addEventListener('change', appChangeEvents, false);
}



function appChangeEvents({ target, target: { dataset: { type, id }, value, checked, name } }) {
    //user preferences
    if (target.classList.contains('user-preferences')) {
        target.id === 'dark-mode-switch' ? toggleDark(target.checked) : ''
        let values = { key: name, value };
        preferencesTemp(values);
    }

    // choose just one project for a new tracking task (new task)
    if (target.classList.contains("input-checkbox-one") && type === 'projects' && !temp.editObj) {
        selectOnlyOne(target, '.list-projects');
        saveTaskProjectToTemp('trackTask', target.checked, id);
    }

    // save tags to temp (new task)
    if (target.classList.contains("input-checkbox-one") && type === 'tags' && !temp.editObj) {
        saveTaskTagsToTemp('trackTask', target.checked, target.value);
    }

    // choose just one type of task status: to do / on going / done
    if (target.classList.contains("input-checkbox-one") && type === "task-status") {
        selectOnlyOne(target, '.list-status', true);
    }

    // save editing object(task / notes / link) to temp variable (existing task)
    if (target.classList.contains('edit-field') && temp.editObj) {
        let values = new Object();
        values[name] = value;
        values.check = checked;
        editObjTemp(values, id, type);
        if (type === 'projects') {
            selectOnlyOne(target, '.list-projects');
            let projectLabel = app.querySelector('#task-list-projects-btn');
            projectLabel ? projectLabel.textContent = `@${temp.editObj.project ? user.getItemById(temp.editObj.project, 'projects').name : ''}` : '';
        }
    }

    // save new object(task / notes / link) to temp variable 
    if (target.classList.contains('new-field') && temp.newObj) {
        let values = { key: name, value, check: checked }
        newObjTemp(values, id, type);
    }
}

function appMouseEvents({ target }) {
    // hover on top of each user thumbnail, show user's name
    if (target.classList.contains('user__access')) {
        displayName(crud.getUser(target.dataset.id).name);
    }
    // remove user's name if hover is not on top
    else {
        displayName();
    }
}

function appSubmitEvents(e) {
    e.preventDefault();
    let { target, target: { dataset: { id, type }, name, value } } = e;
    let input = target.querySelector('input');

    if (target.id === "newUser__form") {
        let user = input.value;
        submitNewUser(user)
            .then(usersPage);
        return false;
    }

    user = crud.getUser();

    // start tracking new task
    if (target.classList.contains("add-form") && type === "tasks") {
        temp.trackTask.task = input.value;
        temp.trackTask.isInProgress = true;
        submitNewItem(type, temp.trackTask)
            .then(task => startClock(task.id))
            .then(updateComponents);
        return false
    }

    // add new projects or tags
    if (target.classList.contains("add-form") && type !== "tasks") {
        let values = new Object();
        values[name] = target.querySelector('input').value;
        submitNewItem(type, values)
            .then(() => updateComponents(type))
        target.reset();
        return false;
    }

    // new item or edit item
    if (target.id === 'modal') {
        if (temp.editObj) {
            saveUpdateModal(id, type, temp.editObj);
            closePopup();
            updateComponents();
        }
        if (temp.newObj) {
            submitNewItem(type, temp.newObj).then(closePopup).then(updateComponents)
        }
    }

    // save preferences
    if (target.id === "user-preferences") {
        updateUserPreferences();
        userPage();
    }
}


function appInputEvents({ target }) {
    if (target.id === "newUser__input") {
        displayName(target.value)
    }
}

function appClickEvents({ target }) {
    let { dataset: { id, type, page } } = target
    if (target.id === "newUser__add") {
        newUserPage();
    }

    if (target.classList.contains('user__access')) {
        loginUser(id);
    }

    if (target.id === "users__page") {
        usersPage();
    }

    if (target.classList.contains('user__delete')) {
        deleteUser(id, target.parentElement);
    }

    if (target.id === "user__logout") {
        return logoutUser();
    }

    if (target.id === "clock-btn") {
        stopClock(id);
        return updateComponents();
    }

    if (target.classList.contains('track-task')) {
        startClock(id);
        return updateComponents();
    }

    if (target.classList.contains('modal-edit-btn')) {
        return openEditPopup(id, type);
    }

    if (target.classList.contains('modal-close-btn')) {
        return closePopup();
    }

    if (target.classList.contains('delete-btn')) {
        deleteItem(id, type);
        return updateComponents();
    }

    // new item or edit item
    if (target.classList.contains('modal-btn-save')) {
        if (temp.editObj) {
            saveUpdateModal(id, type, temp.editObj);
        }
        if (temp.newObj) {
            submitNewItem(type, temp.newObj).then(closePopup).then(updateComponents).then(console.log(user))
        }
        closePopup();
        return updateComponents();
    }

    if (target.classList.contains('modal-btn-delete')) {
        deleteItem(id, type);
        closePopup();
        return updateComponents();
    }

    if (target.classList.contains('modal-wrapper')) {
        return closePopup();
    }

    if (target.classList.contains('add-new')) {
        openNewItemPopup(type);
    }

    if (page) {
        getPage(page);
    }

    if (target.id === "backup") {
        crud.backupFile();
    }
    if (target.id === "clearStorage") {
        crud.clearLocalStorage();
        usersPage();
    }
}


// ======================================================================= FUNCIONALIDADES

function displayName(name) {
    let heading = app.querySelector('.users__welcome');
    let span = app.querySelector('.users__welcome span');
    if (span) {
        span = app.querySelector('.users__welcome span');
    } else {
        span = document.createElement('span');
    }
    span.textContent = ' ' + name;
    name ? heading.appendChild(span) : span.remove();
    name ? document.title = `T R A C K Y - Welcome, ${name}` : '';
}

async function submitNewUser(fullName) {
    let user = { fullName };
    await crud.newUser(user);
}

function selectOnlyOne(target, list, forceChoice = false) {
    let check = target.checked;
    uncheckCheckboxes(list);
    if (check && !forceChoice) { return target.checked = true }
    else if (!check && !forceChoice) { return target.checked = false };
    return target.checked = true
}

function checkTracking(task, save = "true") {
    if (task.id === user.tracking && task.isChecked && save) {
        user.tracking = false;
        stopClock(task.id);
    } else if (task.id === user.tracking && !save) {
        user.tracking = false;
        stopClock(task.id);
    }
}

function updateComponents(type) {
    let overviewBtns = document.querySelectorAll('#overview-btns');
    let overviewTasksSection = document.querySelectorAll('#overview-tasks');
    let overviewFormsSection = document.querySelectorAll('#overview-forms');
    let overviewNotes = document.querySelectorAll('#user__notes');
    let linksSectionDesktop = document.querySelectorAll('#overview-links-desktop');
    let linksSectionMobile = document.querySelectorAll('#overview-links-mobile');

    if (type === 'projects') {
        let listProjects = app.querySelectorAll('.list-projects');
        listProjects.forEach(element => element.innerHTML = projectForm());
    }
    else if (type === 'tags') {
        let listTags = app.querySelectorAll('.list-tags');
        let tags = temp.editObj ? temp.editObj.tags : [];
        listTags.forEach(element => element.innerHTML = tagsForm(tags));
    }
    else if (type === 'timestamps') {
        let listTimestamps = document.getElementById('list-timestamps');
        return listTimestamps.innerHTML = timestampsList(temp.editObj);
    }
    else {
        overviewFormsSection.forEach(element => element.innerHTML = overviewForms(user.tracking));
        overviewTasksSection.forEach(element => element.innerHTML = overviewTasks());
        overviewBtns.forEach(element => element.innerHTML = overviewButtons());
        overviewNotes.forEach(element => element.innerHTML = notesSection());
        linksSectionDesktop.forEach(element => element.innerHTML = overviewLinks({ mobile: false }));
        linksSectionMobile.forEach(element => element.innerHTML = overviewLinks({ mobile: true }));
    };
    if (user.tracking) { updateClock(user.tracking) }
}

async function submitNewItem(type, values) {
    let list = [];
    if (type === "tags") {
        list = [...user.tags];
        console.log(values.tags)
        list = list.concat(values.tags.split(','));
        user.tags = list;
        return user.tags = [...list];
    }
    return await crud.newKeyItem(type, values);
}

function deleteUser(id, el) {
    crud.deleteUser(id);
    el.remove();
}

function logoutUser() {
    if (user.tracking) { clearInterval(taskTimer) }
    user = crud.updateCurrentSession(false, true);
    usersPage();
}

function loginUser(id) {
    user = crud.updateCurrentSession(id, true);
    userPage(id);
}

function uncheckCheckboxes(cssClass) {
    let elements = app.querySelectorAll(cssClass);
    elements.forEach(element => element.querySelectorAll('input[type="checkbox"]').forEach(el => el.checked = false));
}

function saveTaskProjectToTemp(key, checked, id) {
    if (checked) {
        return temp[key].project = id;
    }
    return temp[key].project = false;
}

function saveTaskTagsToTemp(key, checked, value) {
    if (checked) {
        return temp[key].tags = temp[key].tags.concat(value);
    }
    return temp[key].tags.splice(temp[key].tags.indexOf(value), 1);
}

function editObjTemp(values, id, type) {
    let { check } = values;
    if (type === "timestamp") {
        let timestamp = temp.editObj.timestamps.find(timestamp => timestamp.id === id);
        if (values.start) { timestamp.start = new Date(values.start) }
        if (values.finish) { timestamp.finish = new Date(values.finish) }

        timestamp.duration = Math.round((new Date(timestamp.finish) - new Date(timestamp.start)) / 1000);
        console.log(timestamp, user.tasks[user.tasks.length - 1].timestamps)
        return timestamp;
    }

    if (type === 'tags') {
        return saveTaskTagsToTemp('editObj', check, values.tags);
    }

    if (type === 'task-status') {
        values.isChecked = values.isChecked && check ? check : false;
        values.isInProgress = values.isInProgress && check ? check : false;
    }

    if (type === 'projects') {
        values.project = check ? id : false;
    }
    for (let key in temp.editObj) {
        temp.editObj[key] = values[key] != undefined ? values[key] : temp.editObj[key];
    }
}

function newObjTemp(values, id, type) {
    let { key, check, value } = values;
    if (type === 'tags') {
        temp.newObj.tags = temp.newObj.tags ? temp.newObj.tags : new Array();
        return saveTaskTagsToTemp('newObj', check, value);
    }

    if (type === 'task-status' && key === 'isChecked') {
        value = check ? check : false;
    }
    if (type === 'task-status' && key === 'isInProgress') {
        value = check ? check : false;
    }

    if (type === 'projects') {
        value = check ? id : false;
    }
    temp.newObj[key] = value;
}

// export function editObjTempTimestamp(timeID, { start, finish }) {
//     let timestamp = temp.editObj.timestamps.find(timestamp => timestamp.id === timeID);
//     if (start) { timestamp.start = new Date(start) }
//     if (finish) { timestamp.finish = new Date(finish) }
//     return timestamp;
// }

export function updateClock(taskID) {
    let task = user.getItemById(taskID, 'tasks');
    let clock = document.getElementById('clock-timer');
    let start = task.timestamps[task.timestamps.length - 1].start;
    let duration = new Date() - new Date(start);

    let hours = duration / (1000 * 60 * 60);
    let minutes = hours % 1 * 60;
    let seconds = Math.round(minutes % 1 * 60);
    hours = Math.floor(hours);
    minutes = Math.floor(minutes);
    let time = `${hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    clock.innerHTML = time;
    taskTimer = setInterval(() => {
        seconds = seconds === 59 ? 0 : seconds + 1;
        minutes = seconds === 0 ? minutes + 1 : minutes;
        minutes = minutes === 60 ? 0 : minutes;
        hours = minutes === 0 && seconds === 0 ? hours + 1 : hours;
        time = `${hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        clock.innerHTML = time;
    }, 1000)
}

function startClock(id) {
    // if the task is already being tracked, do nothing
    if (user.tracking === id) { return false }
    // if there's a task being tracked, stop it
    if (user.tracking) { stopClock(user.tracking) }
    // update the tracking section with the new task
    document.getElementById('overview-forms').innerHTML = overviewForms(id);
    // start the clock
    crud.taskClock(id, true);
    // start updating interval
    updateClock(id);
}

function stopClock(id) {
    document.getElementById('overview-forms').innerHTML = overviewForms();
    crud.taskClock(id, false);
    clearInterval(taskTimer);
    temp.trackTask = { project: false, tags: [] }
}

function openEditPopup(id = temp.editObj.id, type = temp.editObj.type) {
    let modal = app.querySelector('.modal-wrapper');
    modal.classList.remove('hidden');
    temp.editObj = JSON.parse(JSON.stringify(user.getItemById(id, type)));
    temp.editObj.type = type;
    modal.innerHTML = editModal(type);
}

function closePopup() {
    let modal = app.querySelector('.modal-wrapper');
    modal.classList.add('hidden');
    temp.editObj = false;
    temp.newObj = false;
}

function openNewItemPopup(type) {
    temp.newObj = new Object();
    let modal = app.querySelector('.modal-wrapper');
    modal.classList.remove('hidden');
    modal.innerHTML = newModal(type);
}

function saveUpdateModal(id, type, data) {
    let updated = crud.updateKeyItem(id, type, data);
    console.log(updated)
    type === 'tasks' ? checkTracking(updated) : '';
}


function deleteItem(id, type) {
    if (type === 'timestamp') {
        temp.editObj.timestamps = temp.editObj.timestamps.filter(time => time.id !== id);
        return updateComponents('timestamps');
    }
    if (type === 'tasks') {
        checkTracking({ id }, false);
    }
    crud.deleteKeyItem(id, type);
}


function toggleDark(check) {
    let body = document.body;
    if (check) {
        body.classList.add('dark');
        user.preferences.darkMode = true;

    } else {
        body.classList.remove('dark');
        user.preferences.darkMode = false;
    }
    crud.saveDataLocally();
}

function preferencesTemp(values) {
    let { key, value } = values;
    temp.preferences[key] = value;
}

function updateUserPreferences() {
    for (let key in temp.preferences) {
        if (key === 'fullName') { user.updateName(temp.preferences[key]) }
        else { user.preferences[key] = temp.preferences[key] };
    }
    crud.saveDataLocally();
}