var express = require('express');
var router = express.Router();
var db = require('./db');

router.get('/check', (req, res) => {
    res.send('<h1>Buddy ! I am running.....</h1>');
});

router.post('/save', (req, res) => {
    console.log(req.body);
    let count = db.getworkflowCount();
    let body = req.body;
    body.Id = count + 1;
    const newData = {id: count + 1, name: body.Name,
        jsonObject: body.JsonObject, status: 'active', addedOn: new Date().toString()}
    const saved = db.saveWorkflow(newData);
    console.log(saved);
    // res.status(200).send({saved: true, data: saved.id});
    res.status(200).send(true);
});

// function sendResponse(res) {
//   res.status(200).send(true);
// }

router.post('/run', (req, res) => {
    console.log(req.body);
    res.status(200).send(true);
});

router.get('/getall', (req, res) => {
    let data = db.getworkflow();
    res.status(200).send(data);
});

router.get('/getsteptypes', (req, res) => {
    let data =  [ { stepType: 'WorkflowCore.Service.Demo.HelloWorldService',
                    stepName: 'HelloWorldService',
                    assembly: 'WorkflowCore'},
                    { stepType: 'WorkflowCore.Service.Demo.AddNumbers',
                    stepName: 'AddNumbers',
                    assembly: 'WorkflowCore'},
                    { stepType: 'WorkflowCore.Service.Demo.PrintMessageService',
                    stepName: 'PrintMessageService',
                    assembly: 'WorkflowCore'}];
    res.status(200).send(data);
});

router.get('/DataContextAttributes', (req, res) => {
    let data =  {
          Input: ['Value1', 'Value2', 'Value3', 'message'],
          Output: ['Value1', 'Value2', 'Value3', 'Result']
        };
    res.status(200).send(data);
});

module.exports = router;
