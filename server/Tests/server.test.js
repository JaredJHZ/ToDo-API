const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require('./../models/ToDo');
const {User} = require('../models/user');
const {todos,populateTodos,users,populateUsers} = require('./seed/seed');


beforeEach(populateUsers);

beforeEach(populateTodos);


describe('Delete/todos',()=>{

    it('should not delete a doc cause it is an invalid id',(done)=>{
        request(app)
            .delete('/todos/123')  
                .expect(400)
                .end(done);
    });


    it('Should remove a document',(done)=>{
        var hex = todos[0]._id.toHexString();
        console.log(hex);
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

describe('Get /users/me',()=>{
    it('should return user if authenticated',(done)=>{
        request(app)
            .get('/users/me')
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done)
    });
    
    it('shouldnt return user caus isntt authenticated',(done)=>{
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res)=>{
                expect(res.body).toEqual({});
            })
            .end(done)
    });
});

describe('Post /users',()=>{
    it('should create an user',(done)=>{
        var myU = {
            'user':'ex',
            'email':'ex@exa.com',
            'password':'abc123456'
        };
        request(app)
            .post('/users/')
            .send(myU)
            .expect(200)
            .expect((res)=>{
                expect(res.body._id).toNotBe(null);
                expect(res.body.email).toNotBe(null);
                expect(res.body.email).toBe(myU.email);
            })
            .end((err)=>{
                if(err){
                    return done(err);
                }
                User.findOne({email:myU.email},(err,doc)=>{
                    expect(doc.email).toBe(myU.email);
                    expect(doc.password).toNotBe(myU.password);
                    done();
                });
            });
    });
    it('should return validation errors if request invalid',(done)=>{
        var myU = {
            'user':'ex',
            'email':'ex@exa.com',
            'password':'a456'
        };
        request(app)
            .post('/users/')
            .send(myU)
            .expect(401)
            .end(done)
    });
    it('should not create user if email in use',(done)=>{
        request(app)
            .post('/users/')
            .send(users[0])
            .expect(401)
            .end(done);
    });
});