const server = require('../server');
const assert = require('chai').assert;
const chai = require('chai');
const chaiHttp = require('chai-http');
const dbo = require('../db/conn');
chai.use(chaiHttp);


before(function (done) {
    dbo.connectToServer(function (err) {
        if (err) {
            console.error(err);
            process.exit();
        }
        done();
    });
});



describe('02 prueba peticiones usaremos chai-http', () => {
   it('probando el estatus de el get a la raiz', (done) => {
            chai.request(server)
                .get('/')
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    done();
                });
        }
    );


    let idTarea = '';
    it('Insertando datos', (done) => {
        chai.request(server)
            .post('/tareas')
            .send({nombre: 'insertando prueba ', hecho: false})
            .end((err, res) => {
                idTarea = res.body.id;
                assert.equal(res.status, 201);
                done();
            });
    });


    it('Verificando que la tarea que se guardo ', (done) => {
        chai.request(server)
            .get('/tareas')
            .end((err, res) => {
                assert.equal(res.status, 200);

                let tareas = res.body;
                let tarea = tareas.find(t => t._id == idTarea);

                assert.equal(tarea._id, idTarea);
                done();
            });
    });


    it('Eliminando la tarea guardad', (done) => {
            chai.request(server)
                .delete('/tareas/delete/' + idTarea)
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    done();
                });
        }
    );

    it('Verificando que la tarea se ha eliminado', (done) => {
        chai.request(server)
            .get('/tareas')
            .end((err, res) => {
                assert.equal(res.status, 200);
                let tareas = res.body;
                let tarea = tareas.find(t => t._id == idTarea);
                assert.equal(tarea, undefined);
                done();
            });
    });


});

