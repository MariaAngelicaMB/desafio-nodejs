const express = require("express");
const cors = require("cors");
const { uuid } = require('uuidv4');

// const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  //rota que lista todos os repositorios
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  // deve receber title, url e techs dentro do corpo da requisição
  const {title, url, techs } = request.body;

  // cadastrar um novo projeto
  const newRepository = {
    id: uuid(),
    title,
    url,
    techs,
    //valor inicial de zero
    likes:0   
  };
  
  //acrescentando novo repositorio dentro do array repositories[];
  repositories.push(newRepository);

  //usando o callback e dizendo que que o objeto é JSON
  return response.json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  //desestruturando 
  const {id} = request.params;
  //o que o usuario vai alterar
  const {title, url, techs} = request.body;

  //buscar a posição do repositorio 
  const findRepositoryIndex = repositories.findIndex(repository => 
    repository.id === id);

  //caso não encontre é preciso usar o -1
    if(findRepositoryIndex === -1) {
      return response.status(400).json({ error: 'Repository does not exist'})
    }

    const repositoryUpdated = {
      id,
      title,
      url,
      techs,
      likes: repositories[findRepositoryIndex].likes
    }
  
    repositories[findRepositoryIndex] = repositoryUpdated;
    
    return response.json(repositoryUpdated);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const findRepositoryIndex = repositories.findIndex(repository => 
    repository.id === id);

    if (findRepositoryIndex >= 0) {
      repositories.splice(findRepositoryIndex, 1);
    } else {
      response.status(400).json({ error: 'repository does not exists.'})
    }

    return response.status(204).send();


});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryId = repositories.find(repository => repository.id === id);

  if (!repositoryId){
    return response.status(400).send()
  };

  repositoryId.likes += 1;

  return response.json(repositoryId);
});



module.exports = app;
