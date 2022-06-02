export class User {
    constructor(user) {
        let { id, fullName, location, preferences, tasks, links, notes, projects, tracking } = user;
        this.id = id;
        this.location = location ? location : "";
        this.name = fullName.split(' ')[0];
        this.surname = fullName.split(' ').length > 1 ? fullName.split(' ')[fullName.split(' ').length - 1] : '';
        this.fullName = fullName;
        this.preferences = preferences ? preferences : {};
        this.tasks = tasks ? tasks.map(task => new Task(task)) : [];
        this.links = links ? links.map(link => new Link(link)) : [];
        this.notes = notes ? notes.map(note => new Note(note)) : [];
        this.projects = projects ? projects.map(project => new Project(project)) : [];
        this.tags = this.getTags();
        this.tracking = tracking ? tracking : false;
    };
    updateName(fullName) {
        this.name = fullName.split(' ')[0];
        this.surname = fullName.split(' ').length > 1 ? fullName.split(' ')[fullName.split(' ').length - 1] : '';
        this.fullName = fullName;
        return fullName;
    }
    getItemById(id, key) {
        return this[key].find(elem => elem.id === id);
    };
    deleteItemById(id, key) {
        this[key] = this[key].filter(elem => elem.id !== id);
        return this[key]
    };
    updateItemById(id, key, updatedElem) {
        let index = this[key].findIndex(item => item.id === id);
        // change the fields that need changing and keep the object as Task for example.
        if (index > -1) {
            for (let value in updatedElem) {
                if (this[key][index][value] !== undefined) {
                    this[key][index][value] = updatedElem[value];
                    value === 'timestamps' ? this[key][index][value] = this[key][index][value].map(time => new Timestamp(time)) : '';
                }
            }
        }
        return this[key][index]
    };
    newItem(key, values) {
        let item;
        if (key === 'tasks') { item = new Task(values) };
        if (key === 'links') { item = new Link(values) };
        if (key === 'notes') { item = new Note(values) };
        if (key === 'projects') { item = new Project(values) };
        item ? this[key].push(item) : '';
        return item
    };
    getTasksByStatus(value) {
        return this.tasks.filter(task => {
            if (value === 'done' && task.isChecked) { return task };
            if (value === 'progress' && task.isInProgress) { return task };
            if (value === 'todo' && !task.isInProgress && !task.isChecked) { return task };
        })
    };
    getTags() {
        let tags = [];
        this.tasks.map(task => tags = tags.concat(task.tags));
        this.notes.map(note => tags = tags.concat(note.tags));
        tags = tags.filter((v, i, a) => a.indexOf(v) === i);
        return tags
    }
};

class Task {
    constructor(taskDetails) {
        let { id, task, project, tags, isInProgress, isChecked, created, timestamps } = taskDetails;
        this.id = id;
        this.task = task ? task : '';
        this.project = project ? project : false;
        this.tags = tags ? tags : [];
        this.isInProgress = isInProgress ? true : false;
        this.isChecked = isChecked ? true : false;
        this.created = created ? new Date(created) : new Date();
        this.timestamps = timestamps ? timestamps.map(time => new Timestamp(time)) : [];
    }
    getTotalDuration() {
        let duration = 0;
        this.timestamps.map(time => duration += time.duration)
        let hours = Math.round(duration / (60 * 60));
        let minutes = Math.round((duration / (60 * 60)) % 1 * 60);
        let seconds = Math.round((duration / 60) % 1 * 60);
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        return { duration, hours, minutes, seconds }
    }
    startTask() {
        this.timestamps.push(new Timestamp({ start: new Date() }));
        console.log(this.timestamps)
        this.isInProgress = true;
    }
    stopTask() {
        this.timestamps[this.timestamps.length - 1].finish = new Date();
        this.timestamps[this.timestamps.length - 1].getDurationSeconds();
    }
    deleteTimestampById(id) {
        this.timestamps = this.timestamps.filter(elem => elem.id !== id);
        return this.timestamps
    };
}

class Timestamp {
    constructor({ id, start, finish }) {
        this.id = id ? id : `${new Date(start).getTime()}-${Math.round(Math.random() * 100)}`;
        this.start = start ? new Date(start) : false;
        this.finish = finish ? new Date(finish) : false;
        this.duration = finish ? this.getDurationSeconds() : 0;
    }
    getDurationSeconds() {
        this.duration = Math.round((this.finish - this.start) / (1000));
        return this.duration
    }
}

class Link {
    constructor({ id, link, url, category }) {
        this.id = id;
        this.link = link;
        this.url = url;
        this.category = category ? category : 'default';
    }
}

class Note {
    constructor({ id, project, title, note, tags, created }) {
        this.id = id;
        this.project = project ? project : '';
        this.title = title ? title : '';
        this.note = note ? note : '';
        this.tags = tags ? tags : [];
        this.created = created ? new Date(created) : new Date();
    }
}

class Project {
    constructor({ id, name, duration, description }) {
        this.id = id;
        this.name = name;
        this.duration = duration ? duration : 0;
        this.description = description ? description : '';
    }
    getProjectItems(user, key) {
        return user[key].filter(item => item.project === this.id);
    }

    getProjectDuration(user) {
        let duration = 0;
        this.getProjectItems(user, 'tasks').map(item => duration += item.getTotalDuration().duration);
        this.duration = duration;
        return duration
    }
    getTasksByStatus(user, value) {
        return this.getProjectItems(user, 'tasks').filter(task => {
            if (value === 'done' && task.isChecked) { return task };
            if (value === 'progress' && task.isInProgress) { return task };
            if (value === 'todo' && !task.isInProgress && !task.isChecked) { return task };
        })
    };
}