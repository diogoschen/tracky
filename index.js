import * as components from './modules/components.js';
import * as crud from '/modules/CRUD.js'

document.addEventListener('DOMContentLoaded', start, false);

function start() {
    crud.getData()
        .then(() => {
            crud.appData.currentSession ? components.userPage(crud.appData.currentSession) : components.usersPage();
            console.log('done');
        })
        .catch((e) => {
            console.log(e)
            components.newUserPage()
        })
}