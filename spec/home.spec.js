import {deleteImageFromServer, getFileNameFromUrl, LoadImageFromServer} from '../app/index'
import {expect, assert} from 'chai'
import $ from 'jquery'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'



describe('LoadImageFromServer', function () {
	it('should load some image from server', function () {
		let mock = new MockAdapter(axios)

		mock.onGet('http://localhost:8000/uploads').reply(function(){
			return [200, 'success']
		})
		return LoadImageFromServer().then( (r) =>{
			expect(r.data).to.equal('success')
		})
	});
});

describe('deleteImageFromServer', function () {
	it('should delete image', function () {
		let mock = new MockAdapter(axios)
		// fetch all topics
		mock.onPost('http://localhost:8000/delete').reply(function(){
			return [200, 'success']
		})
		return deleteImageFromServer(1).then( (r) =>{
			// console.log(r.data)
			expect(r.data).to.equal('success')
		})
	})
})
describe('getFileNameFromUrl', function () {
	it('should get filename from url', function () {
		let f = getFileNameFromUrl('http://sample.com/index.html')
		expect(f).to.equal('index.html')
	});
});



