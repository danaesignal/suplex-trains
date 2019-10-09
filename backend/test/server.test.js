import { expect } from 'chai';
import { server, port } from '../src/server';
import request from 'supertest';
import Dotenv from 'dotenv';

Dotenv.config();

describe('Server', ()=>{
    it('tests that server is running current port', async()=>{
      expect(port).to.equal(process.env.PORT || 4500)
    })

    it('responds 200 (OK) at /', async () => {
      const response = await request(server).get('/');
      expect(response.body).to.an.instanceof(Object);
      expect(response.status).to.equal(200);
    })
});