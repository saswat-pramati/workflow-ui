var db = require('diskdb');

db = db.connect('server/db', ['workflow']);

exports.saveWorkflow = (data) => {
    return db.workflow.save(data);
}

exports.getworkflow = () => {
    return db.workflow.find();
}

exports.getworkflowCount = () => {
    return db.workflow.count();
}
