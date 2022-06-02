import { app, temp } from '/modules/global.mjs';
import { updateClock, userPageEvents, newUserPageEvents, globalEvents } from '/modules/events.mjs';
import { getUser, appData, getWeather, getQuote, featureDetection } from '/modules/CRUD.mjs';

let user;
export function usersPage() {
    globalEvents();
    document.title = `T R A C K Y - Welcome`;
    app.innerHTML = '';
    app.className = 'app users_page';
    let main = `
    <header>
        <h1 class="logo">tracky</h1>
    </header>
    <main class="users">
        <h2 class="users__welcome">Welcome</h2>
        <ul class="users__list no-scrollbar">${listItems({ array: appData.users, type: 'users' })}
        <li class="users__thumb-big"><button type="button" id="newUser__add" class="users__btn-add">+</button></li>
        </ul>
    </main>`;
    app.innerHTML = main;
}

export function newUserPage() {
    newUserPageEvents();
    document.title = "T R A C K Y - Welcome";
    app.innerHTML = '';
    app.className = 'app users_page';
    let main = `
        <header>
        <h1 class="logo">tracky</h1>
        </header>
            <main class="users">
                <h2 class="users__welcome">Welcome</h2>
                <form class="newUser" id="newUser__form">
                    <label for="newUser__input" class="newUser__input">
                        <input autocomplete="off" type="text" id="newUser__input" name="fullname" placeholder="first and last" required>
                    </label>
                    <button type="submit" id="newUser__submit" class="newUser__btn-add">Add me</button>
                    <button type="button" id="users__page" class="newUser__btn-back">Go back</button>
                </form>
            </main>
    `
    app.innerHTML = main;
}

export function userPage(id) {
    user = getUser(id);
    userPageEvents();
    app.className = 'app user_page';
    document.title = `T R A C K Y - Welcome, ${user.name}`;
    app.innerHTML = '';

    let header = `
        <header class="userMain" aria-label="Header">
            <section class="links" id="overview-links-desktop" aria-label="Links Overview">
                ${overviewLinks({ mobile: false })}
            </section>

            <section class="weather" id="weather" aria-label="Weather">
            </section>
            <section class="profile"  aria-label="Profile thumbnail">
                <div class="profile__thumb">${user.name[0]}</div>
                <ul class="profile__opts">
                    <li class="profile__opts-preferences">
                        <button type="button" class="preferences__btn" aria-label="preferences"><i aria-hidden="true" class="i material-symbols:settings"></i></button>
                        <section class="preferences__list transition-shadow" aria-label="User preferences">
                            <form id="user-preferences" class="preferences__form">
                                <label aria-label="User's name">
                                    <span>User's name:</span>
                                    <input class="user-preferences" name="fullName" type="text" value="${user.fullName}">
                                </label>
                                <br>
                                <label aria-label="Number of tasks on dashboard">
                                    <span>Number of tasks on dashboard:</span>
                                    <input class="user-preferences" min="1" name="nTasksDash" type="number" value="${user.preferences.nTasksDash ? user.preferences.nTasksDash : 7}">
                                </label>
                                <button type="submit">Save</button>
                            </form>
                            <div class="modal__group">
                            <button type="button" id="clearStorage">Clear browser</button>
                            <button type="button" id="backup">Backup file</button>
                            <label aria-label="dark mode switch">
                                <input id="dark-mode-switch" class="user-preferences" type="checkbox" ${user.preferences.darkMode ? 'checked' : ''}>
                                <span class="checkbox-toggle">
                                    <i aria-hidden="true" class="i fluent:weather-sunny-20-regular"></i>
                                    <i aria-hidden="true" class="i fluent:weather-moon-16-regular"></i>                            
                                </span>
                            </label>
                            </div>
                        </section>
                    </li>
                    <li><button type="button" id="user__logout" aria-label="logout"><i aria-hidden="true" class="i ri:logout-circle-r-line"></i></button></li>
                </ul>
            </section>
        </header>
    `;
    let main = `<main class="userMain"></main>`

    let nav = `
        <nav class="nav-wrapper">
            <section class="nav" aria-label="Pages">
                <h1 class="logo">tracky</h1>
                <button type="button" data-page="userDashboardPage"><i aria-hidden="true" class="i ri:home-4-line"></i><span>Home</span></button>
                <button type="button" data-page="userNotesPage"><i aria-hidden="true" class="i ri:sticky-note-line"></i><span>Notes</span></button>
                <section class="nav__add">
                    <button type="button" class="nav__btn-add"><i aria-hidden="true" class="i ri:add-line"></i></button>
                    <ul class="nav__opts">
                        <li>
                            <button type="button" class="nav__opts-btn add-new" data-type="tasks" aria-label="Add new task"><i aria-hidden="true" class="i ri:add-line"></i>Task</button>
                        </li>
                        <li>
                            <button type="button" class="nav__opts-btn add-new" data-type="links" aria-label="Add new link"><i aria-hidden="true" class="i ri:add-line"></i>Link</button>
                        </li>
                        <li>
                            <button type="button" class="nav__opts-btn add-new" data-type="notes" aria-label="Add new note"><i aria-hidden="true" class="i ri:add-line"></i>Note</button>
                        </li>
                    </ul>
                </section>
                
                <button type="button" data-page="userTasksPage"><i aria-hidden="true" class="i ri:checkbox-multiple-line"></i><span>Tasks</span></button>
                <button type="button" data-page="userProjectsPage"><i aria-hidden="true" class="i ri:at-line"></i><span>Projects</span></button>
            </section>
            <div class="buttons">
                <button type="button" aria-hidden="true" class="buttons__btn-add" aria-label="add new item"><i aria-hidden="true" class="i ri:add-line"></i></button>

                <ul class="buttons__btn-list" aria-label="Add new items">
                    <li> <button type="button" class="buttons__btn-add add-new" aria-label="add new task" data-type="tasks"><i aria-hidden="true" class="i ri:checkbox-multiple-line"></i></button>
                    </li>
                    <li> <button type="button" class="buttons__btn-add add-new" aria-label="add new note" data-type="notes"><i aria-hidden="true" class="i ri:sticky-note-line"></i></button></li>
                    <li> <button type="button" class="buttons__btn-add add-new" aria-label="add new project" data-type="projects"><i aria-hidden="true" class="i ri:at-line"></i></button></li>
                </ul>
            </div>
        </nav>
    `
    let modal = `<section class="modal-wrapper hidden"></section>`;

    let html = nav + header + main + modal;
    app.innerHTML = html;
    userDashboardPage();
    if (featureDetection('geolocation')) { displayWeather(); }
}

export function getPage(page) {
    if (page === 'userDashboardPage') { return userDashboardPage() }
    else if (page === 'userProjectsPage') { return userProjectsPage() }
    else if (page === 'userNotesPage') { return userNotesPage() }
    else if (page === 'userTasksPage') { return userTasksPage() };
}

function userDashboardPage() {
    let main = app.querySelector('main');
    let html = `
        <section class="userMain__welcome" aria-label="Welcome ${user.name}">
            <h2 class="userMain__welcome-heading"><span id="time-of-day">
            ${displayTimeDay()},</span> ${user.name}</h2>
            <p class="userMain__welcome-quote" id="quote"></p>
        </section>
        <ul class="links no-scrollbar" aria-label="Links" id="overview-links-mobile">
        ${overviewLinks({ mobile: true })}
        </ul>

        <section class="overview" aria-label="Productivity Dashboard">
            <div class="overview__wrapper-btns" id="overview-btns" aria-label="Productivity Overview">
                ${overviewButtons(user)}
            </div>

            <section class="overview__forms" id="overview-forms" aria-label="Start tracking a new task">
                ${overviewForms(user.tracking)}
            </section>
            
            <section class="overview__tasks" aria-label="Tasks Overview" id="overview-tasks">
                ${overviewTasks()}
            </section>
        </section>
        <section id="user__notes" aria-label="Notes">${notesSection()}</section>
    `;
    main.innerHTML = html;

    if (user.tracking) { updateClock(user.tracking) }
    displayQuote();
    if (user.preferences.darkMode) { document.body.classList.add('dark'); }
    else { document.body.classList.remove('dark') }
}

function userProjectsPage() {
    user = getUser();
    let main = app.querySelector('main');
    let html = `
    <ul class="projects__overview">
        ${listItems({ array: user.projects, type: 'projects', page: 'userProjectsPage' })}
    <ul>
    `
    main.innerHTML = html;
}

function userNotesPage() {
    user = getUser();
    let main = app.querySelector('main');
    let html = `
    <ul class="notes" id="user__notes">
        ${listItems({ array: user.notes, type: 'notes' })}
    <ul>`
    main.innerHTML = html;
}

function userTasksPage() {
    user = getUser();
    let main = app.querySelector('main');


    let numDisplayTasksOnDashboard = user.preferences.nTasksDash ? user.preferences.nTasksDash : 7;
    let todo = user.getTasksByStatus('todo').reverse().filter((item, i) => i < numDisplayTasksOnDashboard);
    let progress = user.getTasksByStatus('progress').reverse().filter((item, i) => i < numDisplayTasksOnDashboard);
    let done = user.getTasksByStatus('done').reverse().filter((item, i) => i < numDisplayTasksOnDashboard);
    let todoPlaceholder = `<section class="tasks__placeholder"><h1>Your to do tasks notes go here</h1><p><button type="button" class="button-simple add-new" data-type="tasks">Add one now</button></p></section>`

    let html = todo.length > 0 ? `
        <section class="overview__tasks-todo  transition-shadow" >
            ${listItems({ array: todo, type: "tasks", page: 'userTasksPage' })}
        </section >`: todoPlaceholder;

    html += progress.length > 0 ? `
        <section class="overview__tasks-inprogress  transition-shadow">
            ${listItems({ array: progress, type: "tasks", page: 'userTasksPage' })}
        </section>`: '';

    html += done.length > 0 ? `
        <section class="overview__tasks-done  transition-shadow">
            ${listItems({ array: done, type: "tasks", page: 'userTasksPage' })}
        </section>`: '';

    html = `<section class="overview__tasks tasksPage" aria-label="Tasks Overview" id="overview-tasks">${html}</section>`

    main.innerHTML = html;
}

export function overviewLinks({ mobile }) {
    if (mobile) {
        let html = `${listItems({ array: user.links, type: "links" })}<li><button type="button" class="links__add-btn add-new" aria-label="Add new link" data-type="links"><i aria-hidden="true" class="i ri:add-line"></i></button></li>`
        return html
    }
    let linksPlaceholder = `<li class="links__placeholder"><h1>Your links go here. <button type="button" class="button-simple add-new" data-type="links">Add one now</button></h1></li>`
    let html = `
        <ul class="overview__links" aria-label="Links">
        
            ${user.links.length > 0 ? `${listItems({ array: user.links, type: "links" })}` : linksPlaceholder}
        </ul>
        <section class="links__list-wrapper" aria-label="Check all links">
            <button type="button" class="button-plain links__list-btn" data-type="linksList" aria-label="Check all links"><i aria-hidden="true" class="i material-symbols:expand-circle-down-outline-rounded"></i></button>
            <ul class="links__list transition-shadow">
            ${listItems({ array: user.links, type: "links" })}
            <li><button type="button" class="links__add-btn add-new" aria-label="Add new link" data-type="links"><i aria-hidden="true" class="i ri:add-line"></i></button></li>
            </ul>
        </section>
    `;
    return html
}

export function overviewForms(taskID) {
    let html;
    if (taskID) {
        html = taskClockComponent(taskID);
        return html
    }
    html = taskForm();
    html += `
        <div class="transition-fade-in options-hidden" >
            <button type="button" id="task-list-tags-btn"  class="button-default" aria-label="Task tags"><i aria-hidden="true" class="i clarity:hashtag-solid"></i></button>
            <ul class="list-tags">
                ${tagsForm()}
            </ul>
        </div > `;
    html += `
        <div class="transition-fade-in options-hidden" >
            <button type="button" class="button-default" aria-label="Task projects"><i aria-hidden="true" class="i ri:at-line"></i></button>
            <ul class="list-projects">
                ${projectForm()}
            </ul>
        </div > `;

    return html
}

function taskForm() {
    let html = `
        <form class="task__form add-form" data-type="tasks" id = "task__form" >
            <label for="task__input" aria-label="Start tracking a new task">
                <input type="text" class="task__input" id="task__input" name="task" placeholder="Start tracking a new task" required>
            </label><button type="submit"><i class="i material-symbols:play-arrow-rounded" aria-hidden=true></i></button>
        </form >
        `
    return html
}

export function projectForm(id) {
    let html = `
        ${listItems({ array: user.projects, type: "projects", project: id })}
    <li>
        <form class="add-form" data-type="projects" name="name">
            <label for="project__add-form">
                <input type="text" name="project__add-form" placeholder="new project" required>
            </label>
            <button type="submit" id="project__add-btn">Add</button>
        </form>
    </li>
    `
    return html
}

export function tagsForm(tags) {
    let html = `    
        ${listItems({ array: user.tags, type: "tags", tags })}
    <li>
        <form class="add-form" data-type="tags" name="tags">
            <label for="tags">
                <input type="text" name="tags" data-type="tags" placeholder="tags separated by commas" required>
            </label>
            <button type="submit" id="tags__add-btn">Add</button>
        </form>
    </li>
    `
    return html
}

export function taskClockComponent(taskID) {
    let task = user.getItemById(taskID, 'tasks');
    let project = user.getItemById(task.project, 'projects');
    let html = `
        <section class=" transition-shadow overview__clock" id = "overview__clock" >
            <p>${task.task}</p>
        ${project ? `<span>@${project.name}</span>` : ''}
        <span id="clock-timer"></span>
        <button type="button" id="clock-btn" data-id="${task.id}"><i class="i material-symbols:pause-rounded" aria-hidden=true></i></button>
    </section >
        `
    return html
}

export function overviewButtons() {
    let overview = `
        <div class="btns-group" >
            <button type="button" class="prod__todo  transition-shadow" aria-label="Tasks to do"><span>${user.getTasksByStatus('todo').length}</span> To do <i aria-hidden="true" class="i material-symbols:chevron-right-rounded"></i></button>
            <button type="button" class="prod__inprogress  transition-shadow" aria-label="Tasks on going"><span>${user.getTasksByStatus('progress').length}</span>On going<i aria-hidden="true" class="i material-symbols:chevron-right-rounded"></i></button>
        </div >
        <div class="btns-group">
            <button type="button" class="prod__done  transition-shadow" aria-label="Tasks done"><span>${user.getTasksByStatus('done').length}</span> Done<i aria-hidden="true" class="i material-symbols:chevron-right-rounded"></i></button>
            <button type="button" class="prod__projects  transition-shadow" aria-label="Projects" data-page="userProjectsPage"><span>${user.projects.length}</span> Projects<i aria-hidden="true" class="i material-symbols:chevron-right-rounded"></i></button>
        </div>
    `
    return overview
}

export function overviewTasks() {
    let numDisplayTasksOnDashboard = user.preferences.nTasksDash ? user.preferences.nTasksDash : 7;
    let todo = user.getTasksByStatus('todo').reverse().filter((item, i) => i < numDisplayTasksOnDashboard);
    let progress = user.getTasksByStatus('progress').reverse().filter((item, i) => i < numDisplayTasksOnDashboard);
    let todoPlaceholder = `<section class="tasks__placeholder"><h1>Your to do tasks notes go here</h1><p><button type="button" class="button-simple add-new" data-type="tasks">Add one now</button></p></section>`

    let html = todo.length > 0 ? `
        <section class="overview__tasks-todo  transition-shadow" >
            ${listItems({ array: todo, type: "tasks" })}
        </section >`: todoPlaceholder;

    html += progress.length > 0 ? `
        <section class="overview__tasks-inprogress  transition-shadow">
            ${listItems({ array: progress, type: "tasks" })}
        </section>`: '';

    return html
}

export function notesSection() {
    let end = user.notes.length > 4 ? 4 : user.notes.length;
    let topNotes = [...user.notes].reverse().slice(0, end);
    let placeholder = `<article class="notes__placeholder"><h1>Your last notes go here</h1><p><button type="button" class="button-simple add-new" data-type="notes">Add one now</button></p></article>`;
    let html = `
        <div class="notes" >
            ${topNotes.length > 0 ? `${listItems({ array: topNotes, type: "notes" })}` : placeholder}
        </div >
        `
    return html
}

function projectButton(id) {
    let html;
    if (id) {
        html = `
        <button type="button" id="task-list-projects-btn" class="button-minimal" aria-label="Task projects">
        @${user.getItemById(id, 'projects').name}
        </button>`
    } else {
        html = `<button type="button" class="button-default" aria-label="Task projects"><i aria-hidden="true" class="i ri:at-line"></i></button>`
    }
    return html
}

export function editModal(type) {
    if (type === 'tasks') { return taskDetailsModal() }
    if (type === 'notes') { return noteDetailsModal() }
    if (type === 'links') { return linkDetailsModal() }
}

export function newModal(type) {
    if (type === 'tasks') { return taskAddModal() }
    if (type === 'notes') { return noteAddModal() }
    if (type === 'links') { return linkAddModal() }
    if (type === 'projects') { return projectAddModal() }
}

function taskAddModal() {
    let html = `
    <section class="modal" aria-label="Edit tasks modal">
    <div class="modal__group no-wrap">
        <form id="modal" class="modal-form" data-type="tasks">
            <label aria-label="Note's title"><input type="text" class="new-field" name="task" required></label> 
            <button type="submit"></button>
        </form>
        <div class="transition-fade-in options-hidden" >
            <button type="button" class="button-default" aria-label="Task tags">
            <i aria-hidden="true" class="i clarity:hashtag-solid"></i>
            </button>
            <ul class="list-tags align-right">
                ${tagsForm()}
            </ul>
        </div>
        <div class="transition-fade-in options-hidden" >
            ${projectButton()}
            <ul class="list-projects align-right">
                ${projectForm()}
            </ul>
        </div>
        </div>
        <div class="modal__group">
            <ul class="list-status modal__task-checkboxes task__status modal__group">
                <li>
                    <label aria-label="to do status"><input type="checkbox" class="input-checkbox-one"><span class="checkbox todo">todo</span></label>
                </li>
                <li>
                    <label aria-label="on going status"><input type="checkbox" class="input-checkbox-one new-field" data-type="task-status" name="isInProgress"><span class="checkbox inprogress">on going</span></label>
                </li>
                <li>
                    <label aria-label="done status"><input type="checkbox" class="input-checkbox-one new-field" data-type="task-status" name="isChecked"><span class="checkbox done">done</span></label>
                </li>
            </ul>
        </div>
        <div class="modal__group">
            <button type="button" class="modal-btn-save modal__btn-save button-minimal" data-type="tasks">Save</button>
        </div>
        
        <button type="button" class="modal-close-btn modal__btn-close" aria-label="close modal"><i aria-hidden=true class="i material-symbols:close-rounded"></i></button>
        </section>
        `
    return html
}

function noteAddModal() {
    let html = `
<section class="modal" aria-label="Edit tasks modal">
        <div class="modal__group">
            <div class="modal__group no-wrap">
                <label aria-label="Note's title"><input type="text" name="title" class="modal__notes-title new-field" placeholder="Note's title"></label>
                <div class="transition-fade-in options-hidden" >
                    <button type="button" class="button-default" aria-label="Task tags">
                    <i aria-hidden="true" class="i clarity:hashtag-solid"></i>
                    </button>
                    <ul class="list-tags align-right">
                        ${tagsForm()}
                    </ul>
                </div>
                <div class="transition-fade-in options-hidden" >
                    ${projectButton()}
                    <ul class="list-projects align-right">
                        ${projectForm()}
                    </ul>
                </div>
            </div>
        </div>
        <label aria-label="Note's text"><textarea class="modal__notes-textarea new-field" name="note" placeholder="Your note goes here"></textarea></label>
        </div>
        
        <button type="button" class="modal-close-btn modal__btn-close" aria-label="close modal"><i aria-hidden=true class="i material-symbols:close-rounded"></i></button>
        <div class="modal__group">
        
        <button type="submit" class="modal-btn-save modal__btn-save button-minimal" data-type="notes">Save</button>
        </div>
        </div>
    </section>
    `;
    return html
}

function linkAddModal() {
    let html = `
    <section class="modal" aria-label="Add new link">
        <form id="modal" class="links__form" data-type="links">
            <label aria-label="Link's name">Link's name:
                <input placeholder="Link name" name="link" type="links" class="new-field" required>
            </label>
            <label aria-label="Link's url">Link's url:
                <input placeholder="Link url" name="url" type="links" class="new-field" required>
            </label>
            <button type="submit" class="button-simple">Add</button>
        </form>
    </section>
    `;
    return html
}

function projectAddModal() {
    let html = `
    <section class="modal" aria-label="Add new project">
        <div class="modal__group">
            <div class="modal__group no-wrap">
                <label aria-label="Project's name"><input type="text" name="name" class="modal__notes-title new-field" placeholder="Project's name"></label>
            </div>
        </div>
        <label aria-label="Project's description"><textarea class="modal__notes-textarea new-field" name="description" placeholder="Project's description"></textarea></label>
        </div>
        
        <button type="button" class="modal-close-btn modal__btn-close" aria-label="close modal"><i aria-hidden=true class="i material-symbols:close-rounded"></i></button>
        <div class="modal__group">
        
        <button type="submit" class="modal-btn-save modal__btn-save button-minimal" data-type="projects">Save</button>
        </div>
        </div>
    </section>
    `;
    return html
}

function linkDetailsModal() {
    let link = temp.editObj;
    let html = `
    <section class="modal" aria-label="Edit tasks modal">     
        
        <button type="button" class="modal-close-btn modal__btn-close" aria-label="close modal"><i aria-hidden=true class="i material-symbols:close-rounded"></i></button>
        <div class="modal__group">
            <form id="modal" data-id="${link.id}" data-type="links">
                <label>Name: 
                    <input name="link" class="edit-field" value="${link.link}">
                </label>
                <label>Url: 
                    <input name="url" class="edit-field" value="${link.url}">
                </label>
                <button type="submit"></button>
            </form>
            <button type="button" class="modal-btn-delete modal__btn-delete button-minimal" data-id="${link.id}" data-type="links">Delete</button>
            <button type="button" class="modal-btn-save modal__btn-save button-minimal" data-id="${link.id}" data-type="links">Save</button>
        </div>
    </section>
`;
    return html
}

function noteDetailsModal() {
    let note = temp.editObj;
    let html = `
    <section class="modal" aria-label="Edit tasks modal">
        <div class="modal__group">
            <div class="modal__group no-wrap">
                <label aria-label="Note's title"><input type="text" name="title" class="modal__notes-title edit-field" value="${note.title}"></label>
                <div class="transition-fade-in options-hidden" >
                    <button type="button" class="button-default" aria-label="Task tags">
                    <i aria-hidden="true" class="i clarity:hashtag-solid"></i>
                    </button>
                    <ul class="list-tags align-right">
                        ${tagsForm(note.tags)}
                    </ul>
                </div>
                <div class="transition-fade-in options-hidden" >
                    ${projectButton()}
                    <ul class="list-projects align-right">
                        ${projectForm(note.project)}
                    </ul>
                </div>
            </div>
        </div>
        <label aria-label="Note's text"><textarea class="modal__notes-textarea edit-field" name="note">${note.note}</textarea></label>
        </div>
        
        <button type="button" class="modal-close-btn modal__btn-close" aria-label="close modal"><i aria-hidden=true class="i material-symbols:close-rounded"></i></button>
        <div class="modal__group">
        
        <button type="button" class="modal-btn-delete modal__btn-delete button-minimal" data-id="${note.id}" data-type="notes">Delete</button>
        <button type="button" class="modal-btn-save modal__btn-save button-minimal" data-id="${note.id}" data-type="notes">Save</button>
        </div>
        </div>
    </section>
`;
    return html
}

function taskDetailsModal() {
    let task = temp.editObj;
    let html = `
    <section class="modal" aria-label="Edit tasks modal">
    <div class="modal__group no-wrap">
        <form id="modal" class="modal-form" data-id="${task.id}" data-type="tasks">
            <label aria-label="Note's title"><input type="text" class="edit-field" name="task" value="${task.task}" required></label>    
        </form>
        <div class="transition-fade-in options-hidden" >
            <button type="button" class="button-default" aria-label="Task tags">
            <i aria-hidden="true" class="i clarity:hashtag-solid"></i>
            </button>
            <ul class="list-tags align-right">
                ${tagsForm(task.tags)}
            </ul>
        </div>
        <div class="transition-fade-in options-hidden ${task.project ? 'hidden' : ''}" >
            ${task.project ? '' : projectButton()}
            <ul class="list-projects align-right">
                ${projectForm(task.project)}
            </ul>
        </div>
        </div>
        <div class="modal__group">
            <div class="transition-fade-in options-hidden task__project ${task.project ? '' : 'hidden'}" >  
                ${task.project ? projectButton(task.project) : ''}
                <ul class="list-projects">
                    ${projectForm(task.project)}
                </ul>
            </div>
            <ul class="list-status modal__task-checkboxes task__status modal__group">
                <li>
                    <label aria-label="to do status"><input type="checkbox" class="input-checkbox-one edit-field" data-type="task-status" ${!task.isChecked && !task.isInProgress ? 'checked' : ''}><span class="checkbox todo">todo</span></label>
                </li>
                <li>
                    <label aria-label="on going status"><input type="checkbox" class="input-checkbox-one edit-field" data-type="task-status" name="isInProgress" ${task.isInProgress ? 'checked' : ''}><span class="checkbox inprogress">on going</span></label>
                </li>
                <li>
                    <label aria-label="done status"><input type="checkbox" class="input-checkbox-one edit-field" data-type="task-status" name="isChecked" ${task.isChecked ? 'checked' : ''}><span class="checkbox done">done</span></label>
                </li>
            </ul>
        </div>
        <div class="modal__group">
            <button type="button" class="modal-btn-delete modal__btn-delete button-minimal" data-id="${task.id}" data-type="tasks">Delete</button>
            <button type="button" class="modal-btn-save modal__btn-save button-minimal" data-id="${task.id}" data-type="tasks">Save</button>
        </div>
        <div class="transition-fade-in options-hidden-within task__timelog-wrapper" >
        <button type="button" class="button-minimal task__timelog-btn" aria-label="Task timelogs">
        <i class="i material-symbols:expand-circle-down-outline-rounded"></i>
        </button>
        <ul id="list-timestamps" class="task__timelog">${timestampsList(task)}</ul>
        </div>
        <button type="button" class="modal-close-btn modal__btn-close" aria-label="close modal"><i aria-hidden=true class="i material-symbols:close-rounded"></i></button>
        </section>
        `
    return html
}

export function timestampsList(task) {
    let html = listItems({ array: task, type: "timestamps" });
    return html
}

// ====================== utils
function getLinkIcon(link) {
    let iconKey = 'default';

    let icons = {
        calendar: 'i mdi:calendar',
        slack: 'i mdi:slack',
        discord: 'i mdi:discord',
        youtube: 'i mdi:youtube',
        whatsapp: 'i mdi:whatsapp',
        twitter: 'i mdi:twitter',
        facebook: 'i mdi:facebook',
        mail: 'i mdi:email-multiple-outline',
        gmail: 'i mdi:email-multiple-outline',
        outlook: 'i mdi:email-multiple-outline',
        google: 'i mdi:google',
        default: 'i mdi:link-variant'
    }

    if (link) {
        link = link.replace('https://', '');
        link = link.replaceAll('/', '.');
        link = link.replaceAll(' ', '.');
        link = link.toLowerCase();
        iconKey = link.split('.').find(piece => icons[piece]);
        iconKey = icons[iconKey] ? iconKey : 'default';
    }

    return icons[iconKey];
}

function getWeatherIcon(code) {
    let icons = {
        '01d': 'i fluent:weather-sunny-28-regular',
        '01n': 'i fluent:weather-moon-16-regular',
        '02d': 'i fluent:weather-partly-cloudy-day-16-regular',
        '02n': 'i fluent:weather-partly-cloudy-night-24-regular',
        '03d': 'i fluent:cloud-16-regular',
        '03n': 'i fluent:cloud-16-regular',
        '04d': 'i fluent:weather-cloudy-20-regular',
        '04n': 'i fluent:weather-cloudy-20-regular',
        '09d': 'i fluent:weather-rain-20-regular',
        '09n': 'i fluent:weather-rain-20-regular',
        '10d': 'i fluent:weather-rain-showers-day-48-regular',
        '10n': 'i fluent:weather-rain-showers-night-20-regular',
        '11d': 'i fluent:weather-thunderstorm-20-regular',
        '11n': 'i fluent:weather-thunderstorm-20-regular',
        '13d': 'i fluent:weather-snowflake-20-filled',
        '13n': 'i fluent:weather-snowflake-20-filled',
        '50d': 'i fluent:reading-list-28-regular',
        '50n': 'i fluent:reading-list-28-regular'
    }

    return icons[code]
}

export function listItems(values) {
    let { array, type, before = '', after = '', page = false } = values;
    let html = '';
    if (type === "links" && !page) {
        array.map(item => html += `
        ${before}
        <li>
            <a target="_blank" href="${item.url}" aria-label="${item.link}" class="transition-shadow icon">
            <i aria-hidden="true" class="${getLinkIcon(item.url)}"></i></a>
            <a target="_blank" href="${item.url}" aria-label="${item.link}" class="links__text">${item.link}</a>
            <div class="flex-group">
            <button type="button" class="modal-edit-btn button-plain" data-id="${item.id}" data-type="links" aria-label="Edit link: ${item.link}"><i aria-hidden="true" class="i ic:outline-edit"></i></button>
            <button type="button" class="delete-btn button-plain" data-id="${item.id}" data-type="links" aria-label="Delete link: ${item.link}"><i class="i material-symbols:close-rounded"></i></button>
            </div>
        </li>
        ${after}
    `);
        return html
    }

    else if (type === 'notes' && !page) {
        array.map(item => html += `
        ${before}
        <article class=" transition-shadow card show-hover" aria-label="Note for: ${item.title}">
            <h1 class="notes__title">${item.title}</h1>
           ${item.project ? `<h2 class="notes__project card__label">${user.getItemById(item.project, 'projects').name}</h2>` : ''}
            <p class="notes__note">${item.note.replace(/\r?\n/g, '<br>')}</p>
            <p class="notes__tags">
                ${listItems({ array: item.tags, before: '<span>#', after: '</span>&nbsp;' })}
                <button type="button" data-id="${item.id}" data-type="notes" class="modal-edit-btn show-element notes__edit-btn">
                    <i class="i ic:outline-edit" aria-hidden="true"></i>
                </button>
            </p>
        </article>
        ${after} `
        );
        return html
    }


    else if (type === "users" && !page) {
        array.map(item => html += `
        ${before}
    <li class="users__thumb-big">
        <button type="button" data-id="${item.id}" class="users__btn-access user__access">${item.name[0]}</button>
        <button type="button" data-id="${item.id}" class="users__btn-delete user__delete">Delete</button>
    </li>
        ${after}
    `);
        return html
    }

    else if (type === "projects" && !page) {
        array.map(item => html += `
            ${before}
    <li>
        <label>
            <input type="checkbox" name="project" class="input-checkbox-one ${temp.newObj ? 'new-field' : 'edit-field'}" value="${item.name}" data-type="${type}" data-id="${item.id}" ${item.id === values.project ? 'checked' : ''}>
                <span class="checkbox">@${item.name}</span>
        </label>
    </li>
            ${after}
    `);
        return html
    }

    else if (type === "projects" && page === 'userProjectsPage') {
        console.log(user)
        array.map(item => html += `
                ${before}
                <li>
                <span>${item.name}</span><span>${formattedTime(item.getProjectDuration(user))}</span><span>${item.getTasksByStatus(user, 'todo').length} to do </span><span>${item.getTasksByStatus(user, 'progress').length} on going</span><span>${item.getTasksByStatus(user, 'done').length} done</span>
                </li>
                ${after}
        `);
        return html
    }

    else if (type === "tasks" && !page) {
        array.map(item => html += `
        ${before}
        <article class="card show-hover grid-6" draggable=true>
        <div class="card-group">
            <h1 class="card__title">${item.task}</h1>
            ${item.project ? `<button data-id="${item.project}" data-type="projects" class="card__label">@${user.getItemById(item.project, 'projects').name}</button>` : ''}
        </div>
        <div class="card-group card__btns">
            <button type="button" data-id="${item.id}" data-type="tasks" class="modal-edit-btn show-element">
                <i class="i ic:outline-edit" aria-hidden="true"></i>
            </button>
            <button type="button" data-id="${item.id}" class="track-task">
                <i class="i material-symbols:play-arrow-rounded" aria-hidden="true"></i>
            </button>
        </div>
        </article>
        ${after}
    `);
        return html
    }

    else if (type === "tasks" && page === 'userTasksPage') {
        array.map(item => html += `
        ${before}
        <article class="card show-hover grid-6" draggable=true>
        <div class="card-group">
            <h1 class="card__title">${item.task}</h1>
            ${item.project ? `<button data-id="${item.project}" data-type="projects" class="card__label">@${user.getItemById(item.project, 'projects').name}</button>` : ''}
        </div>
        <div class="card-group card__btns">
            <button type="button" data-id="${item.id}" data-type="tasks" class="modal-edit-btn show-element">
                <i class="i ic:outline-edit" aria-hidden="true"></i>
            </button>
        </div>
        </article>
        ${after}
    `);
        return html
    }

    else if (type === "tags" && !page) {
        array.map(item => html += `
        ${before}
        <li>
            <label>
                <input type="checkbox" name="tags" class="input-checkbox-one ${temp.newObj ? 'new-field' : 'edit-field'}" value="${item}" data-type="${type}" ${values.tags && values.tags.indexOf(item) > -1 ? 'checked' : ''}>
                    <span class="checkbox">#${item}</span>
            </label>
        </li>
        ${after}
        `);
        return html
    }

    else if (type === "timestamps" && !page) {
        const isDisabled = (id) => {
            let timestamps = user.tracking ? user.getItemById(user.tracking, 'tasks').timestamps : false;
            let disabled = timestamps && timestamps[timestamps.length - 1].id === id ? 'disabled' : '';
            return disabled;
        }
        let timestamps = [...array.timestamps].reverse();
        timestamps.map(item => html += `
        ${before}
        <li class="modal__group">
            <input name="start" class="edit-field" data-type="timestamp" data-id="${item.id}" type="datetime-local" step="1" value="${formattedDate(item.start)}">
            ${item.finish ? `<input name="finish" class="edit-field" data-type="timestamp" data-id="${item.id}" type="datetime-local" step="1" min="${formattedDate(item.start)}" value="${formattedDate(item.finish)}">` : ''}
            <button type="buttton" data-id="${item.id}" data-taskID="${array.id}" data-type="timestamp" class="delete-btn button-minimal timelog__delete-btn" ${isDisabled(item.id)}>
            <i class="i material-symbols:close-rounded"></i>
            </button>
        </li>
        ${after}
        `)

        return html
    }

    else if (!type && !page) {
        array.map(item => html += `${before}${item}${after} `)
        return html
    }
}

function formattedTime(duration) {
    let hours = duration / (60 * 60);
    let minutes = hours % 1 * 60;
    let seconds = Math.round(minutes % 1 * 60);
    hours = Math.floor(hours);
    minutes = Math.floor(minutes);
    let time = `${hours}h${minutes < 10 ? '0' + minutes : minutes}m`;
    return time
}

function formattedDate(date) {
    const leadingZero = (num) => num < 10 ? '0' + num : num;
    date = new Date(date);
    return `${date.getFullYear()}-${leadingZero(date.getMonth() + 1)}-${leadingZero(date.getDate())}T${leadingZero(date.getHours())}:${leadingZero(date.getMinutes())}:${leadingZero(date.getSeconds())}`
}

async function displayWeather() {
    let { weather, city, description, icon: code } = await getWeather();
    let icon = `<i aria-label="${description}" class="${getWeatherIcon(code)}"></i>`;
    app.querySelector('#weather').innerHTML = icon + `${city}, ${weather}ºC`;
}

async function displayQuote() {
    let quote = await getQuote();
    app.querySelector('#quote').innerHTML = `${quote.text}<span class="userMain__welcome-author"> - ${quote.author !== null ? quote.author : 'unknown'}</span>`
}

function displayTimeDay() {
    let timeOfDay = document.getElementById('time-of-day');
    let greeting = getTimeOfDay();
    setInterval(() => {
        timeOfDay.textContent = getTimeOfDay();
    }, 1000 * 60 * 60);
    return greeting;
}

function getTimeOfDay() {
    let time = new Date().getHours();
    let greeting;
    if (time >= 5 && time < 12) {
        greeting = 'Good morning';
    } else if (time >= 12 && time < 17) {
        greeting = 'Good afternoon';
    } else if (time >= 17 && time < 21) {
        greeting = 'Good evening';
    } else if (time >= 21 || time < 5) {
        greeting = 'Good night';
    }
    return greeting;
}