import request from 'supertest'
import { app } from '../../app'

it('return 201 on successfull sign up', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
})

it('return 400 with invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'dfdsfsdf',
            password: 'password'
        })
        .expect(400);
})
it('return 400 with invalid password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'dfdsfsdf@ooo.com',
            password: 'pas'
        })
        .expect(400);
})
it('return 400 with missing email and password', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email:'dss@tdtd.com'
        })
        .expect(400);
    await request(app)
        .post('/api/users/signup')
        .send({
            password:'dsfdsf'
        })
        .expect(400);
})

it('disallows duplicate email', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(201);
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(400);
})

it('set a cookie after successful sign up request', async () => {
    const response=await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(201);
    expect(response.get('Set-Cookie')).toBeDefined()
})