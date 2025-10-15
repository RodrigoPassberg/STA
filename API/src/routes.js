const express = require('express');
const routes = express.Router();


const Usuario = require('./controllers/usuario');
const Turma = require('./controllers/turma');
const Atividade = require('./controllers/atividades');

routes.get('/', (req, res) => {
    res.json({ titulo: 'API Pedidos respondendo' });
});

routes.post('/usuarios', Usuario.login);

routes.get('/turma', Turma.read);
routes.post('/turma', Turma.create);
routes.put('/turma/:id', Turma.update);
routes.delete('/turma/:id', Turma.del);

routes.get('/atividade', Atividade.read);
routes.post('/atividade', Atividade.create);
routes.put('/atividade/:id', Atividade.update);
routes.delete('/atividade/:id', Atividade.del);

module.exports = routes;