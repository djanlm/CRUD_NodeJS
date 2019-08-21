const express = require("express");

const server = express();

server.use(express.json()); //permite que receba requisições em formato json

let countRequests = 0;
//even when arrays are const, they can receive and delete elements
const projects = [];

////global middleware
server.use((req, res, next) => {
  countRequests++;
  console.log(`Requisition number: ${countRequests}.`);
  return next();
});

////local middleware
function checkIfIDExists(req, res, next) {
  if (!projects.find(e => e.id === req.params.id)) {
    return res.status(400).json({ error: "No id found" });
  }
  return next();
}

/////CRUD/////
server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  const project = {
    id: req.body.id,
    title: req.body.title,
    tasks: req.body.tasks
  };
  projects.push(project);
  return res.json(projects);
});

server.post("/projects/:id/tasks", checkIfIDExists, (req, res) => {
  projects
    .find(el => {
      return el.id === req.params.id;
    })
    .tasks.push(req.body.title); //find the object and add the new task
  return res.json(projects);
});

server.put("/projects/:id", checkIfIDExists, (req, res) => {
  var project = projects.find(el => el.id === req.params.id);
  project.title = req.body.title;
  return res.json(projects);
});

server.delete("/projects/:id", checkIfIDExists, (req, res) => {
  for (let i = 0; i < projects.length; i++) {
    if (projects[i].id === req.params.id) {
      projects.splice(i, 1);
      break;
    }
  }
  //Smarter way to do it
  /*const projectIndex = projects.findIndex(e=> e.id==req.params.id);
  projects.splice(projectIndex, 1);*/

  return res.send();
});

server.listen(3000);
