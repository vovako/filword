import { settings } from "./settings.js"

let mouseDown = false
let input = ""
let nonGuessed = settings.words
let selectedCells = []

function gridLogic(){
	const allChars = settings.content.split('\n').join('').split('\t').join('')
	const charBox = document.querySelector('.fill__grid')
	charBox.style.gridTemplateColumns = `repeat(${settings.width}, 1fr)`

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
function shiftTeamLogic(){
	document.querySelectorAll('.team').forEach(team => {
		team.querySelector('.skip-btn').addEventListener('click', function(){
			team.classList.remove('_selected')
			const nextTeam = team.nextElementSibling
			if (nextTeam){
				nextTeam.classList.add('_selected')
			}
			else {
				document.querySelector('.team').classList.add('_selected')
			}
		})
	})
}
function addPointCurTeam(){
	const scoreElem = document.querySelector('.team._selected .team-score span')
	scoreElem.textContent = Number(scoreElem.textContent) + 1
}

setTitle(nonGuessed.length)
gridLogic()
shiftTeamLogic()