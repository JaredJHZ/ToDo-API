const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require('./../models/ToDo');


var todos = [
    {
    _id: new ObjectId(),
    text:'First text to do',
    completed:false,
    completedAt:null
    },
    {
        _id: new ObjectId(),
        text: 'Second to do',
        completed:true,
        completedAt: 555
    }

]

beforeEach((done)=>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos);
    }).then(()=>{
        done();
    });
});




describe('Delete/todos',()=>{

    it('should not delete a doc cause it is an invalid id',(done)=>{
        request(app)
            .delete('/todos/123')  
                .expect(400)
                .end(done);
    });


    it('Should remove a document',(done)=>{
        var hex = todos[0]._id.toHexString();
        request(app)
            .delete('/todos/'+hex)
            .expect(200)
            .expect((res)=>{
                expect(res.body.ok._id).toBe(hex);
            })
            .end((err,ok)=>{
                if(err){
                    done(err);
                }
                Todo.findById(hex).then((doc)=>{
                    if(!doc){
                        done();
                    }
                }).catch((err)=>done(err));
            });
    });
    it('should not find nothing to remove',(done)=>{
        var hex = new ObjectId().toHexString();
        request(app)
            .delete('/todos/'+hex)
            .expect(404)
            .end(done);
    });
});


describe('Post/todos',()=>{
    it('Should create a new todo',(done)=>{
        request(app)
            .post('/todos')
                .send(todos[0])
                .expect(200)
                .expect((res)=>{
                    expect((res.body.doc.text)).toBe(todos[0].text);
                })
                .end((error,res)=>{
                    if(error){
                        return done(error);
                    }
                    Todo.find(todos[0]).then((t)=>{
                        expect(t[0].text).toBe(todos[0].text);
                        done();
                    }).catch((error)=>done(error));

                });
    }),
    it('Should not create a todo with invalid body data',(done)=>{
        request(app)
            .post('/todos')
                .send({text:''})
                .expect(400)
                .end((error,res)=>{
                    if(error){
                        return done(error);
                    }
                    done();
                })
    });
});

describe('get/todos',()=>{
    it('Should fetch all data',(done)=>{
        request(app)
            .get('/todos')
            .expect(200)
            .end(done);
    });
});

describe('get/todos/id',()=>{
    it('Should get a result doc',(done)=>{
        var id = todos[0]._id.toHexString();
        request(app)
            .get('/todos/'+id)
            .expect(200)
            .expect((res)=>{
                expect(res.body.doc._id).toBe(id);
            })
            .end((error,res)=>{
                if(error){
                    return done(error);
                }
                done();
            })
    });

    it('shouldn´t get a result doc',(done)=>{
        var id = new ObjectId().toHexString();

        request(app)
            .get('/todos/'+id)
            .expect(404)
            .end(done);
    });
    it('should say is an invalid id',(done)=>{
        var id = '123';
        request(app)
            .get('/todos/'+id)
            .expect(400)
            .end(done);
            
    });
    
});

describe('PATCH /todos/id:',()=>{
    it('should clear the completed and completed at',(done)=>{
        let id = todos[1]._id.toHexString();
        let newT = {completed:false};
        request(app)
            .patch('/todos/'+id)
            .send(newT)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBe(null);
            })
            .end(done);
          
    });

    it('should change the text of a doc',(done)=>{
        let id = todos[0]._id.toHexString();
        let another = {text:'hola'};
        request(app)
            .patch('/todos/'+id)
            .send(another)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(another.text);
            })
            .end(done);
    
    });

});

