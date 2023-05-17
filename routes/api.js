'use strict';

var expect = require('chai').expect;
let mongodb = require('mongodb');
let mongoose = require('mongoose');

module.exports = function (app) {

  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  let issueSchema = new mongoose.Schema({
    _id:{ type: mongoose.Schema.ObjectId, auto: true },
    assigned_to: String,
    status_text: String,
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_by: { type: String, required: true },
    open: { type: Boolean, required: true },
    created_on: { type: Date, required: true },
    updated_on: { type: Date, required: true },
    project: String
  });

  let Issue = mongoose.model('Issue', issueSchema);

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      let filterObject = Object.assign(req.query);
      filterObject['project'] = project;
      console.log("filterObject :" );
      console.log(filterObject);
      Issue.find(filterObject)
      .exec((err, issuesArray) => {
        if (err) return console.error(err);
        //console.log(issuesArray);
        return res.json(issuesArray);
      });
    })
    
    .post(function (req, res){
      let project = req.params.project;
      if (!req.body.issue_title | !req.body.issue_text | !req.body.created_by ){
        return res.json({error: 'required field(s) missing'})
      }
      let newIssue = new Issue({
        assigned_to: req.body.assigned_to || '',
        status_text: req.body.status_text || '',
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        open: true,
        created_on: new Date().toUTCString(),
        updated_on: new Date().toUTCString(),
        project: project
      });
      newIssue.save((err, savedIssue) => {
        if (err) {
          console.error(err);
          return res.json({ error: "required field(s) missing" });
        } 
        //console.log("savedIssue is "+savedIssue);
        return res.json(savedIssue);
      });
    })
    .put(function (req, res){
      let project = req.params.project;
      let updateObject = {};

      
      if(!req.body._id){
        return res.json({ error: "missing _id" });
      }
      
      Object.keys(req.body).forEach((key) => {
        if(req.body[key] != ''){
          updateObject[key] = req.body[key];
        }
      });
      if(Object.keys(updateObject).length == 1){
        return res.json({ error: 'no update field(s) sent','_id':req.body._id});
      } 
      setTimeout(function() {
        updateObject['updated_on'] = new Date().toUTCString();
        console.log("updateObject :" );
        console.log(updateObject);

        Issue.findByIdAndUpdate(req.body._id, updateObject, {new:true} ,(err, updatedIssue) => {
          if (err || !updatedIssue) {
            console.error(err);
            return res.json({ error: "could not update",'_id':req.body._id});
          } 
          
          //console.log("updatedIssue is ");
          //console.log(updatedIssue);
          return res.json({ result: 'successfully updated','_id':req.body._id});
        });
      }, 1000);
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
      if(!req.body._id){
        return res.json({ error: "missing _id" });
      }
      console.log(req.body);

      Issue.findByIdAndDelete(req.body._id, (err, deletedIssue) => {
        if (err || !deletedIssue) {
          console.error(err);
          return res.json({error:"could not delete",'_id':req.body._id});
        } 
        //console.log("deletedIssue is " + deletedIssue);
        return res.json({ result:"successfully deleted",'_id':req.body._id});
      });
    });
    
};
