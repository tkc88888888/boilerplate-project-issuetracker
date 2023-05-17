const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let id1;
let id2;

suite('Functional Tests', function() {
  suite('Routing tests', () => {
    suite('POST request to /api/issues/{project}', () => {
      //Create an issue with every field: POST request to /api/issues/{project}
      test('Create an issue with every field', function(done) {
          chai
          .request(server)
          .post('/api/issues/test')
          .send({
            assigned_to: "everyfield",
            status_text: "everyfield",
            issue_title: "everyfield",
            issue_text: "everyfield",
            created_by: "everyfield"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.assigned_to, "everyfield");
            assert.equal(res.body.status_text, "everyfield");
            assert.equal(res.body.issue_title, "everyfield");
            assert.equal(res.body.issue_text, "everyfield");
            assert.equal(res.body.created_by, "everyfield");
            id1 = res.body._id;
            console.log("everyfield _id " + res.body._id);
            done();
          });
      });
  
      //Create an issue with only required fields: POST request to /api/issues/{project}
      test('Create an issue with only required fields', function(done) {
        chai
        .request(server)
        .post('/api/issues/test')
        .send({
          status_text: "",
          issue_title: "onlyrequired",
          issue_text: "onlyrequired",
          created_by: "onlyrequired"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.assigned_to, "");
          assert.equal(res.body.status_text, "");
          assert.equal(res.body.issue_title, "onlyrequired");
          assert.equal(res.body.issue_text, "onlyrequired");
          assert.equal(res.body.created_by, "onlyrequired");
          id2 = res.body._id;

          console.log("onlyrequired id " + res.body._id);
          done();
        });
      });
      //Create an issue with missing required fields: POST request to /api/issues/{project}
      test('Create an issue with missing required fields', function(done) {
        chai
        .request(server)
        .post('/api/issues/test')
        .send({
          assigned_to: "",
          status_text: "",
          issue_title: "",
          issue_text: "",
          created_by: ""
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'required field(s) missing');
          //console.log("missingrequired "+ res.body);
          done();
        });
      });
    });
    suite('GET request to /api/issues/{project}', () => {
      //View issues on a project: GET request to /api/issues/{project}
      test('View issues on a project', function(done) {
        chai
        .request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], "_id");
          assert.property(res.body[0], "assigned_to");
          assert.property(res.body[0], "status_text");
          assert.property(res.body[0], "issue_title");
          assert.property(res.body[0], "issue_text");
          assert.property(res.body[0], "created_by");
          assert.property(res.body[0], "open");
          assert.property(res.body[0], "created_on");
          assert.property(res.body[0], "updated_on");
          done();
        });
      });
      //View issues on a project with one filter: GET request to /api/issues/{project}
      test('View issues with one filter', function(done) {
        chai
        .request(server)
        .get('/api/issues/test')
        .query({ open: true })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          let i = 0;
          while(i < res.body.length){
            assert.equal(res.body[i++].open,true);
          }
          done();
        });
      });
      //View issues on a project with multiple filters: GET request to /api/issues/{project}
      test('View issues with multiple filters', function(done) {
        chai
        .request(server)
        .get('/api/issues/test')
        .query({ open: true, assigned_to : "everyfield"})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          let i = 0;
          //console.log("res.body:");
          //console.log(res.body);
          while(i < res.body.length){
            assert.equal(res.body[i].open,true);
            assert.equal(res.body[i++].assigned_to, "everyfield");
          }
          done();
        });
      });
    });
    suite('PUT request to /api/issues/{project}', () => {
      //Update one field on an issue: PUT request to /api/issues/{project}
      //{"result":"successfully updated","_id":"6317369882638209aeba247a"}
      test("Update one field on an issue", function(done) {
        chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: id1,
          issue_text: "Update one"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully updated");
          console.log("Update one " + res.body._id);

          done();
        });
      });
      //Update multiple fields on an issue: PUT request to /api/issues/{project}
      test("Update multiple fields on an issue", function(done) {
        chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: id2,
          issue_text: "Update multiple",
          status_text: "Update multiple"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully updated");
          console.log("Update multiple " + res.body._id);

          done();
        });
      });

      //Update an issue with missing _id: PUT request to /api/issues/{project}
      test("Update an issue with missing _id", function(done) {
        chai
        .request(server)
        .put("/api/issues/test")
        .send({
          status_text: "Update multiple"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "missing _id");
          done();
        });
      });

      //Update an issue with no fields to update: PUT request to /api/issues/{project}
      test("Update an issue with no fields to update", function(done) {
        chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: id1
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "no update field(s) sent");
          console.log("Update no fields " + res.body._id);
          done();
        });
      });
      //Update an issue with an invalid _id: PUT request to /api/issues/{project}
      test("Update an issue with an invalid _id", function(done) {
        chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id : "5871dda29faedc3491ff93bc",
          status_text: "Update multiple"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "could not update");
          console.log("Update invalid _id " + res.body._id);
          done();
        });
      });
    });  
    suite('DELETE request to /api/issues/{project}', () => {
      //Delete an issue: DELETE request to /api/issues/{project}
      test("Delete an issue", function(done) {
        chai
        .request(server)
        .delete("/api/issues/test")
        .send({
          _id: id1
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully deleted");
        });
        chai
        .request(server)
        .delete("/api/issues/test")
        .send({
          _id: id2
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully deleted");
          done();
        });
      });
      //Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
      test("Delete an issue with an invalid _id", function(done) {
        chai
        .request(server)
        .delete("/api/issues/test")
        .send({
          _id: id1
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "could not delete");
          done();
        });
      });
      //Delete an issue with missing _id: DELETE request to /api/issues/{project}
      test("Delete an issue with missing _id", function(done) {
        chai
        .request(server)
        .delete("/api/issues/test")
        .send({})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "missing _id");
          done();
        });
      });
    });
  });
});