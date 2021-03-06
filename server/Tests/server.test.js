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
            .set('x-auth',users[0].tokens[0].token)  
                .expect(400)
                .end(done);
    });


    it('Should remove a document',(done)=>{
        var hex = todos[0]._id.toHexString();
        request(app)
            .delete('/todos/'+hex)
            .set('x-auth',users[0].tokens[0].token)
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
            .set('x-auth',users[0].tokens[0].token)
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
                .set('x-auth',users[0].tokens[0].token)
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
                .set('x-auth',users[0].tokens[0].token)
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
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body.docs.length).toBe(1);
            })
            .end(done);
    });
});

describe('get/todos/id',()=>{
    it('Should get a result doc',(done)=>{
        var id = todos[0]._id.toHexString();
        request(app)
            .get('/todos/'+id)
            .set('x-auth',users[0].tokens[0].token)
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

    it('should not get a todo of another user',(done)=>{
        var id = todos[0]._id.toHexString();
        request(app)
            .get('/todos/'+id)
            .set('x-auth',users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });


    it('shouldn´t get a result doc',(done)=>{
        var id = new ObjectId().toHexString();

        request(app)
            .get('/todos/'+id)
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
    it('should say is an invalid id',(done)=>{
        var id = '123';
        request(app)
            .get('/todos/'+id)
            .set('x-auth',users[0].tokens[0].token)
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
            .set('x-auth',users[1].tokens[0].token)
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
            .set('x-auth',users[0].tokens[0].token)
            .send(another)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(another.text);
            })
            .end(done);
    
    });

    it('should not change the text because is an invalid token',(done)=>{
        let id = todos[0]._id.toHexString();
        let update = {text:"hello darkness"};
        request(app)
            .patch('/todos/'+id)
            .set('x-auth',users[1].tokens[0].token)
            .expect(400)
            .end((err,res)=>{
                expect(res.body.todo).toBe(undefined);
                done();
            });
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
                    if(err){
                        done(err);
                    }
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
    it('should not create user if email is in use',(done)=>{
        request(app)
            .post('/users/')
            .send(users[0])
            .expect(401)
            .end(done);
    });
});

describe('Post /users/login',()=>{
    it('Should login to the todo app',(done)=>{
        request(app)
            .post('/users/login')
            .send({email:users[0].email, password:users[0].password})
            .expect(200)
            .expect((res)=>{
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
                expect(res.headers['x-auth']).toExist();
            })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                User.findById(users[0]._id).then(
                    (user)=>{
                        expect(user.tokens[1]).toInclude({
                            access:'auth',
                            token : res.headers['x-auth']
                        });
                        done();
                    }
                ).catch((e)=> done(e));
            }); 
    });
   
})

describe('Delete /users/me/token',()=>{
    it('should remove auth token on logout',(done)=>{
        request(app)
            .delete('/users/me/token')
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                User.findById(users[0]._id).then(
                  (user)=>{
                      expect(user.tokens.length).toBe(0);
                      done();
                  }
                ).catch((e)=>done(e));
            });
    })
});