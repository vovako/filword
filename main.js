let mouseDown = false
let input = ""
let nonGuessed = []
let selectedCells = []
let data


function gridLogic(){
	const allChars = data.content.split('\n').join('').split('\t').join('')
	const charBox = document.querySelector('.fill__grid')
	charBox.innerHTML = ''
	charBox.style.gridTemplateColumns = `repeat(${data.width}, 1fr)`

	for (let ch of allChars) {
		const charItem = document.createElement('div')
		charItem.className = 'fill__char'
		charItem.textContent = ch
		charItem.addEventListener('mousedown', function (el) {
			mouseDown = true
			selecting(el.target)
		})
		charItem.addEventListener('mouseover', function (el) {
			if (mouseDown) {
				if (el.target.classList.contains('_disabled') || el.target.classList.contains('_active')){
					checkWord()
					return
				}
				selecting(el.target)
			}
		})

		charBox.insertAdjacentElement('beforeend', charItem)
	}
	charBox.addEventListener('mouseup', function () {
		checkWord()
	})
	charBox.addEventListener('mouseleave', function () {
		if (mouseDown) {
			checkWord()
		}
	})
}

function selecting(el){
	if (!el.classList.contains('_disabled') && !el.classList.contains('_active')) {
		input += el.textContent
		selectedCells.push(el)
		el.classList.add('_active')
	}
}

function checkWord(){
	for (let el of selectedCells) {
		el.classList.remove('_active')
	}

	for (let i = 0; i < nonGuessed.length; i++){
		if (input == nonGuessed[i]){
			nonGuessed.splice(i, 1)
			setTitle(nonGuessed.length)
			for (let el of selectedCells){
				el.classList.add('_disabled')
			}
			addPointCurTeam()
			shiftTeam()
			break
		}
	}

	selectedCells = []
	mouseDown = false
	input = ""
}

function setTitle(count){
	const title = document.querySelector('.non-guessed-count')
	if (count > 0){
		title.querySelector('span').textContent = count
		return
	}
	title.textContent = 'Ура все слова найдены'
}
document.querySelectorAll('.team').forEach(team => {
	team.querySelector('.skip-btn').addEventListener('click', function () {
		shiftTeam()
	})
})
function shiftTeam(){
	const curTeam = document.querySelector('.team._selected')

	curTeam.classList.remove('_selected')
	const nextTeam = curTeam.nextElementSibling
	if (nextTeam){
		nextTeam.classList.add('_selected')
	}
	else {
		document.querySelector('.team').classList.add('_selected')
	}
}
function addPointCurTeam(){
	const scoreElem = document.querySelector('.team._selected .team-score span')
	scoreElem.textContent = Number(scoreElem.textContent) + 1
}

function getPresetLogic(){
	const fileSelector = document.querySelector('input[type="file"]')
	fileSelector.addEventListener('change', function (ev) {
		document.querySelector('.fill__settings').classList.remove('_active')
		const file = ev.target.files[0]
		var reader = new FileReader();
		reader.readAsText(file);
		reader.onload = function (ev) {
			data = JSON.parse(ev.target.result)
			nonGuessed = data.words
			setTitle(nonGuessed.length)
			gridLogic()
		}
	})

}
function settingsBtn(){
	document.querySelector('.fill__settings-btn').addEventListener('click', function(ev){
		document.querySelector('.fill__settings').classList.toggle('_active')
	})
}
function createPresetLogic(){
	document.querySelector('.fill__settings-create-btn').addEventListener('click', function(){
		const charBox = document.querySelector('.fill__grid')
		const boxWidth = document.querySelector('.fill__input.width').value
		const boxHeigth = document.querySelector('.fill__input.heigth').value
		charBox.style.gridTemplateColumns = `repeat(${boxWidth}, 1fr)`
		const fillLength = boxWidth * boxHeigth

		const charItem = document.createElement('div')
		charItem.className = 'fill__char _disabled'
		const charInnerInput = document.createElement('input')
		charInnerInput.value = '#'

		charItem.insertAdjacentElement('beforeend', charInnerInput)
		
		
		for(let i = 0; i < fillLength; i++){
			const newItem = charItem.cloneNode(true)
			charBox.insertAdjacentElement('beforeend', newItem)
			newItem.firstChild.addEventListener('click', function (ev) {
				ev.target.focus()
				ev.target.select()
			})
			newItem.firstChild.addEventListener('input', function(ev){
				const nextItem = ev.target.parentNode.nextElementSibling
				if (nextItem){
					nextItem.firstChild.focus()
					nextItem.firstChild.select()
				}
			})
		}
		document.querySelector('.fill__settings-save-btn').classList.add('_active')
	})
}
function savePresetLogic(){
	
	document.querySelector('.fill__settings-save-btn').addEventListener('click', function(){
		let fillContent = ''
		document.querySelectorAll('.fill__char input').forEach(char => {
			fillContent += char.value
		})
		const fillWidth = document.querySelector('.fill__input.width').value
		const fillWords = document.querySelector('.fill__textarea').value.trim().split('\n')
		const newFill = {
			width: fillWidth,
			words: fillWords,
			content: fillContent
		}
		let data = JSON.stringify(newFill)
		let a = document.createElement("a")
		let file = new Blob([data], { type: 'application/json' })
		a.href = URL.createObjectURL(file)
		a.download = "example.json"
		a.click()
	})
}

settingsBtn()
getPresetLogic()
createPresetLogic()
savePresetLogic()