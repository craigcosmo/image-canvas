import Upload from './upload'
import store from 'store'
import $ from 'jquery'
import {Drag} from './domDrag'
import axios from 'axios'

const serverUrl = 'http://localhost:8000/'

export function bindDragEventToRecoverElement(){
	let dragEls = document.getElementsByClassName('drag')
	Array.from(dragEls).map( (i) => Drag.init(i) )
}
export function saveElement(canvas){
	let elementStorage = []
	let els = document.querySelector(canvas).children
	els = Array.from(els)
	els.map( i => {
		let ob = {}
		if (i.tagName.toLowerCase() === 'span') {
			ob ={
				x:i.offsetLeft,
				y:i.offsetTop,
				type:'span',
				value: i.style.backgroundImage.slice(4, -1).replace(/"/g, "")
			}	
		}
		if (i.tagName.toLowerCase() === 'input') {
			ob = {
				x:i.offsetLeft,
				y:i.offsetTop,
				type:'input',
				value: i.value
			}
		}
		elementStorage.push(ob)
	})

	store.set('oldSession', {1:elementStorage})

	// console.log(elementStorage)
}
export function recoverElement(){
	if(store.get('oldSession')){
		let a = store.get('oldSession')
		// console.log(a[1])
		a[1].map( i => {
			if (i.type === 'span') {
				let image = $('<span tabindex="0" class="drag dragThumb" style="position:absolute" />')
				image.css('background-image', 'url(' + i.value + ')');
				Drag.init(image[0])
				image[0].style.left = i.x + 'px'
				image[0].style.top = i.y + 'px'
				$('.block').append(image)
			}
			if (i.type === 'input') {
				let input = $('<input type="text" class="drag" style="position:absolute" value="'+i.value+'" />')
				Drag.init(input[0])
				input[0].style.left = i.x + 'px'
				input[0].style.top = i.y + 'px'
				$('.block').append(input)
			}
		})
	}
}
export function LoadImageFromServer(){
	return axios.get(serverUrl+'uploads')
}
export function deleteImageFromServer(id){
	return axios.post(serverUrl+'delete', {id:id})
}
export function getFileNameFromUrl(url){
	return url.substring(url.lastIndexOf('/')+1)
}
window.onload = function(){

	
	let selectedElement 
	// display object in canvas like in last session, if any
	recoverElement()
	// bind drag event to elements inside div.block
	bindDragEventToRecoverElement()
	// loading the image from server to the <ul>
	LoadImageFromServer().then( (res) =>{

		console.log(res)
		res.data.map( i => {
			let id = getFileNameFromUrl(i) 
			let img = $('<span class="thumb">').css('background-image', 'url('+ i +')')
			let deleteBtn = $('<a class="del" id="'+id+'" >delete</a>')
			let li = $('<li></li>').append(img)
			li.append(deleteBtn)
			$('.list-unstyled').append(li)
		})
	})

	// init upload script
	let up = new Upload({
		url:serverUrl+'uploads',
		list: '.list-unstyled',
		onComplete: function(object, response){
			if(response=='success'){
				let img = $('<span class="thumb">').css('background-image', 'url('+serverUrl+'uploads/'+ object.name +')')
				let deleteBtn = $('<a class="del" id="'+object.name+'" >delete</a>')
				$(object).append(img)
				$(object).append(deleteBtn)
				$(object).find('.progress-container').remove()
			}
		}
	})
	
	

	// detect files added to input file and automatically start uploading
	document.querySelector('#upload').onchange = function() {
		up.traverseFile(this.files)
	}
	// delete image from server
	$('.image').on('click', '.del', function(e){
		let id = $(e.target).attr('id')
		// post the id of the image to server for deletion
		deleteImageFromServer(id).then( (r) =>{

			if (r.data === 'success') {
				$(e.target).parents('li').remove()
			}
		})
	})

	// addtext button clicked
	$('#addText').on('click',function(){
		let input = $('<input type="text" class="drag" style="position:absolute" value="text" />')
		// bind drag event to new element
		Drag.init(input[0])
		$('.block').append(input)
		// focus input after created
		input.focus()
		// auto select text inside
		input[0].setSelectionRange(0, input[0].value.length)
		// save element 
		saveElement('.block')
	})

	// image clicked
	$('ul').on('click', '.thumb',function(){
		let imgUrl = this.style.backgroundImage.slice(4, -1).replace(/"/g, "")
		// console.log(imgUrl)
		let image = $('<span tabindex="0" class="drag dragThumb" style="position:absolute" />')
		image.css('background-image', 'url(' + imgUrl + ')');
		Drag.init(image[0])
		$('.block').append(image)
		// save element 
		saveElement('.block')
	})

	// assign clicked element to selectedElement var
	$('.block').on('click', '.drag',function(){
		selectedElement = this
	})

	// remove localstorage when clear session button clicked
	$('#clearSession').on('click',function(){
		// make sure this function run after all the click and key event
		// because those events will create a new session
		setTimeout( () => {
			store.remove('oldSession')
			location.reload()
		}, 800)
	})

	// save element to local storage when mouse up
	$(document).on('mouseup',function(){
		saveElement('.block')
	})

	// save element to local storage when key up
	$(document).on('keyup',function(){
		saveElement('.block')
	})
	// detect when cmd+delete is type, then delete the selected element
	$(document).on('keydown', function(e){
		if( (e.metaKey || e.ctrlKey) && e.keyCode == 8) { 
			e.preventDefault()
			if (selectedElement) {
				selectedElement.remove()
				saveElement('.block')
			}
		}
	})
}
