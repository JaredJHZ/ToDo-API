const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/ToDo');
/*
beforeEach((done)=>{ //mocha function that runs before each expect in a describe
    Todo.remove({}).then(()=>done());
}); */

describe('Post/todos',()=>{
    it('Should create a new todo',(done)=>{
        var text = 'Test todo text';
        request(app)
            .post('/todos')
                .send({text})
                .expect(200)
                .expect((res)=>{
                    expect((res.body.text)).toBe(text)
                })
                .end((error,res)=>{
                    if(error){
                        return done(error);
                    }

                    Todo.find({text}).then((todos)=>{
                        expect(todos[0].text).toBe(text);
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

describe('get/todos',(done)=>{
    it('Should fetch all data',(done)=>{
        request(app)
            .get('/todos')
            .expect(200);
            done();
            
    })
});