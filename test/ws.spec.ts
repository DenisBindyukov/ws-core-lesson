import {Test, TestingModule} from '@nestjs/testing';
import {HttpStatus, INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from './../src/app.module';
import {io, Socket} from "socket.io-client";

describe('Tessssss', () => {
    let app: INestApplication;
    let httpServer;
    let dataAddress;
    let participantClient: Socket;
    let adminClient: Socket;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        httpServer = app.getHttpServer();
        dataAddress = httpServer.listen().address();
    });

    afterAll((done) => {
        app.close();
        done()
    })

    beforeEach(async () => {
        const baseAddress = `http://[${dataAddress.address}]:${dataAddress.port}/`

        //connecting participant client
        participantClient = await new Promise((resolve) => {
            const options = {
                extraHeaders: {
                    participantId: '1',
                    roomKey: 'test_room'
                }
            }

            const client = io(baseAddress + 'participant', options)
            client.on("connect", () => {
                resolve(client)
            })
        })

        //connecting participant client
        adminClient = await new Promise((resolve) => {
            const options = {
                extraHeaders: {
                    token: '123',
                    roomKey: 'test_room'
                },
                forceNew: true
            }

            const client = io(baseAddress + 'admin', options)
            client.on("connect", () => {
                resolve(client)
            })
        })
    })

    afterEach((done) => {
        participantClient.disconnect()
        adminClient.disconnect()
        done()
    })

    it('send admin message', async () => {
     const testObj = {value: 'Nest_Js', id: '1'}

        adminClient.emit('admin-path', testObj)


    const res =  await new Promise((resolve) => {
        adminClient.on('admin-path', (data) => {
            resolve(data)
        })
    })

        expect(res).toEqual({type: "someEvents", dto: testObj})
    });


    it('to check participant', async () => {
       await request(httpServer)
           .post("/validate-participants")
           .send({participantId: '1', status: 'approved'})
           .expect(HttpStatus.CREATED)


        const res =  await new Promise((resolve) => {
            participantClient.on('auth', (data) => {
                resolve(data)
            })
        })

        expect(res).toEqual({status: "approved"})
    });



    it('test', async () => {
        await request(httpServer)
            .post("/quiz-management")
            .send({quizId: 'test_room', status: true})
            .expect(HttpStatus.CREATED)


        const res =  await new Promise((resolve) => {
            participantClient.on('quiz-public', (data) => {
                resolve(data)
            })
        })

        expect(res).toEqual({
            type: "QUIZ-STATUS",
            payload: {
                status: true
            }
        })
    });

});
