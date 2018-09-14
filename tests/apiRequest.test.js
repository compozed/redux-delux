import axios from 'axios';
import mockAxiosAdapter from 'axios-mock-adapter';
import {apiRequest} from '../src';
import sinon from 'sinon';

describe('apiRequest', ()=>{

    describe('request', ()=> {
        it('dispatches loading and success for successful api request',async ()=>{
            const mockAxios = new mockAxiosAdapter(axios);

            const url = 'test.com/api/product/';
            const productId = '123';

            const testData = {'this': 'that'};

            mockAxios.onGet(url+productId).replyOnce(200, testData);

            const dispatch = sinon.spy();

            await apiRequest((productId)=>url+productId).request(productId)(dispatch);

            expect(dispatch.calledTwice).toBe(true);
            expect(dispatch.firstCall.args[0]).toEqual({"id": url+productId, "state": "LOADING", "type": "_rr_API_REQUEST"});
            expect(dispatch.secondCall.args[0]).toEqual({"id": url+productId, "state": "SUCCESS", "type": "_rr_API_REQUEST", data: testData});
        });

        it('dispatches loading and error for failed api request, and throws exception',async ()=>{
            const mockAxios = new mockAxiosAdapter(axios);

            const url = 'test.com/api/product/';
            const productId = '123';

            const testData = {'this': 'that'};

            mockAxios.onGet(url+productId).replyOnce(500);

            const dispatch = sinon.spy();

            const syncify = async (fn) => {
                try {
                    const result = await fn();
                    return () => { return result; };
                } catch (e) {
                    return () => { throw e; };
                }
            };

            const syncFunction = await syncify(()=>apiRequest((productId)=>url+productId).request(productId)(dispatch));

            expect(syncFunction).toThrow();

            expect(dispatch.calledTwice).toBe(true);
            expect(dispatch.firstCall.args[0]).toEqual({"id": url+productId, "state": "LOADING", "type": "_rr_API_REQUEST"});
            expect(dispatch.secondCall.args[0]).toEqual({"id": url+productId, "state": "ERROR", "type": "_rr_API_REQUEST", "error": "Error: Request failed with status code 500"});
        });
    });

    describe('status', ()=>{
        it('returns default object if state is un-initialized', ()=>{
            const url = 'test.com/api/product/';
            const productId = '123';

            const state = {_rr:{_rr_API_REQUEST: {}}};
            const testData = {'this': 'that'};

            const status = apiRequest((productId)=>url+productId).status(state)(productId);

            expect(status).toEqual({"data": undefined, "error": "", "isInitialized": false, "isLoading": false});
        });

        it('returns status', ()=>{
            const url = 'test.com/api/product/';
            const productId = '123';

            const id = url+productId;
            const testData = {'this': 'that'};
            const state = {_rr:{_rr_API_REQUEST: {[id]:{data:testData}}}};

            const status = apiRequest((productId)=>url+productId).status(state)(productId);

            expect(status).toEqual({"data": {"this": "that"}});
        });

        it('returns status (when given string URL rather than url builder function)', ()=>{
            const url = 'test.com/api/product/';
            const productId = '123';

            const id = url+productId;
            const testData = {'this': 'that'};
            const state = {_rr:{_rr_API_REQUEST: {[id]:{data:testData}}}};

            const status = apiRequest(url+productId).status(state)(productId);

            expect(status).toEqual({"data": {"this": "that"}});
        });
    });

    describe('patch', ()=>{
        it('dispatches the PATCH action correctly', ()=>{
            const url = 'test.com/api/product/';
            const productId = '123';

            const dispatch = sinon.spy();
            const dataTransformationFunction = sinon.stub();

            apiRequest(url+productId).patch(productId, dispatch, dataTransformationFunction);

            expect(dispatch.calledOnce).toBe(true);
            expect(dispatch.firstCall.args[0]).toEqual({dataTransformationFunction, "id": url+productId, "state": "PATCH", "type": "_rr_API_REQUEST"});
        })
    })

});
