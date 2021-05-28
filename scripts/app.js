function init() {

  //*MAIN DOM ELEMENTS
  const main = document.querySelector('main')
  const gridWrapper = document.querySelector('.grid-wrapper')
  const grid = document.querySelector('.grid')
  const currentScore = document.querySelector('#current-score')
  const highScore = document.querySelector('high-score')
  const infoElement = document.querySelector('#info-element')


  //*AUDIO FUNCTIONALITY
  const audioButton = document.querySelector('.sound')
  const mainAudio = new Audio('music/background.mp3')
  const collectEnergizer = new Audio('music/energize.wav')
  const collectBonus = new Audio('music/bonus.wav')


  //*GRID CREATION
  const width = 28
  const height = 31
  const cellCount = width * height
  const cells = []

  let score = 0
  currentScore.innerText = score

  function createGrid(characterStartPosition) {
    for (let i = 0; i < cellCount; i++) {
      const cell = document.createElement('div')
      cell.innerText = i
      cell.classList.add('grid-piece')
      grid.appendChild(cell)
      cells.push(cell)
    }
    addCharacter(characterStartPosition)
  }

  //*MAIN CHARACTER LOGIC - INITIALISING
  const characterStartPosition = 657
  let characterCurrentPosition = 657
  let characterClass = 'character'


  //*CREATE GRID NEEDS TO BE CALLED FOLLOWING CHARACTER INITIALISING (VARIABLES CAN'T BE HOISTED)
  createGrid(characterStartPosition)



  function addCharacter(position) {
    cells[position].classList.add(characterClass)
  }
  function removeCharacter(position) {
    cells[position].classList.remove(characterClass)
  }


  //*MAIN CHARACTER LOGIC // CONTINUED - MOVEMENT
  function characterMove(event) {
    const key = event.keyCode
    removeCharacter(characterCurrentPosition)
    if (key === 39 && characterCurrentPosition % width !== width - 1 && !cells[characterCurrentPosition + 1].classList.contains('wall')) {
      characterCurrentPosition++
    } else if (key === 37 && characterCurrentPosition % width !== 0 && !cells[characterCurrentPosition - 1].classList.contains('wall')) {
      characterCurrentPosition--
    }
    else if (key === 38 && characterCurrentPosition >= width && !cells[characterCurrentPosition - width].classList.contains('wall')) {
      characterCurrentPosition -= width
    } else if (key === 40 && characterCurrentPosition + width <= width * height - 1 && !cells[characterCurrentPosition + width].classList.contains('wall')) {
      characterCurrentPosition += width
    }
    addCharacter(characterCurrentPosition)
  }


  //*ADDING POINTS & REMOVING CLASS
  //*ENERGIZERS
  //*INITIALLY HAD THIS FUNCTION TO FIRE SET TO KEYDOWN AND ONLY REGISTERED  AFTER PASSED ENERGIZER
  function energize() {
    if (cells[characterCurrentPosition].classList.contains('energizer')) {
      cells[characterCurrentPosition].classList.remove('energizer')
      collectEnergizer.play()
      score += 90
    }
    currentScore.innerText = score
  }
  //*COINS
  function coin() {
    if (cells[characterCurrentPosition].classList.contains('surface')) {
      cells[characterCurrentPosition].classList.remove('surface')
      score += 10
    }
    currentScore.innerText = score
  }



  //*RANDOM ITEM SPAWN & ARRAY FACTS
  function bonusItem() {
    const bonusArray = ['piggy-bank', 'isa', 'bonds', 'property']
    let randomChoice = bonusArray[Math.floor(Math.random() * 4)]
    if (cells[461].classList.length <= 1) {
      cells[461].classList.add(randomChoice)
    }
  }
  setInterval(bonusItem, 6000)


  function removeBonus(bonusName) {
    cells[461].classList.remove(bonusName)
    score += 30
    collectBonus.play()
  }
  function bonusPoints() {
    let choice = Math.floor(Math.random() * 3)

    if (characterCurrentPosition === 461 && cells[461].classList.contains('piggy-bank')) {
      removeBonus('piggy-bank')
      const piggyBankFacts = ['The earliest known \'piggy-shaped\' money box dates back to the 12th century on the island of Java.', 'The most famous piggy-bank is Hamm from Toy Story.', 'Some piggy banks have to be SMASHED to gain access... this isn\'t very economical.']
      infoElement.innerText = piggyBankFacts[choice]

    } else if (characterCurrentPosition === 461 && cells[461].classList.contains('isa')) {
      cells[461].classList.remove('isa')
      removeBonus('isa')
      const isaFacts = ['Interest earned on all Cash ISA Savings are 100% tax free.', 'You need to be at least 16 years old to have an ISA.', 'Since ISAs were  launched in 1999 an estimated £8.74 trillion has been saved.']
      infoElement.innerText = isaFacts[choice]

    } else if (characterCurrentPosition === 461 && cells[461].classList.contains('bonds')) {
      cells[461].classList.remove('bonds')
      removeBonus('bonds')
      const bondsFacts = ['Bonds are issued by governments and corporations when they want to raise money.', 'Bonds move in the opposite direction to interest rates.', 'Bonds tend to be relatively safe but of course still come with risk.']
      infoElement.innerText = bondsFacts[choice]
    } else if (characterCurrentPosition === 461 && cells[461].classList.contains('property')) {
      removeBonus('property')
      cells[461].classList.remove('property')
      const propertyFacts = ['London\'s average house price is £476,800. More than double the national average.', 'Liverpool has the cheapest average price for a UK city, with prices averaging £122,300.', 'Lloyds Banking Group and Nationwide Building Society retained their crowns and the first and second biggest BTL mortgage lenders in the UK.']
      infoElement.innerText = propertyFacts[choice]
    }
  }














  //*Enemy Logic




  function loadEnemies(enemyOneStartPosition) {
    addEnemyOne(enemyOneStartPosition)
  }


  const enemyOneStartPosition = 376
  let enemyOneCurrentPosition = 376
  let enemyOneClass = 'enemyOne'


  function addEnemyOne(position) {
    cells[position].classList.add(enemyOneClass)
  }
  function removeEnemyOne(position) {
    cells[position].classList.remove(enemyOneClass)
  }


  //*Move Enemey
  function enemyOneBoxOut() {

    const inBox = setInterval(() => {

      const enemyWallsTopBottomRight = cells[enemyOneCurrentPosition - width].classList.contains('enemy-wall') && cells[enemyOneCurrentPosition + width].classList.contains('enemy-wall') && cells[enemyOneCurrentPosition + 1].classList.contains('enemy-wall')
      const enemyWallsTopBottomLeft = cells[enemyOneCurrentPosition - width].classList.contains('enemy-wall') && cells[enemyOneCurrentPosition + width].classList.contains('enemy-wall') && cells[enemyOneCurrentPosition - 1].classList.contains('enemy-wall')
      const enemyWallsBottom = cells[enemyOneCurrentPosition + width].classList.contains('enemy-wall')
      const enemyWallsGateCurrent = cells[enemyOneCurrentPosition].classList.contains('enemy-gate')
      const enemyWallsGateBottom = cells[enemyOneCurrentPosition + width].classList.contains('enemy-gate')
      const wallsTopBottomRight = cells[enemyOneCurrentPosition - width].classList.contains('wall') && cells[enemyOneCurrentPosition + width].classList.contains('wall') && cells[enemyOneCurrentPosition + 1].classList.contains('wall')
      const wallsTopRight = cells[enemyOneCurrentPosition - width].classList.contains('wall') && cells[enemyOneCurrentPosition + 1].classList.contains('wall')
      const wallsTopBottomLeft = cells[enemyOneCurrentPosition - width].classList.contains('wall') && cells[enemyOneCurrentPosition + width].classList.contains('wall') && cells[enemyOneCurrentPosition - 1].classList.contains('wall')
      const wallsBottomRight = cells[enemyOneCurrentPosition + width].classList.contains('wall') && cells[enemyOneCurrentPosition + 1].classList.contains('wall')
      const wallsTopLeft = cells[enemyOneCurrentPosition - width].classList.contains('wall') && cells[enemyOneCurrentPosition - 1].classList.contains('wall')
      const wallsBottomLeft = cells[enemyOneCurrentPosition + width].classList.contains('wall') && cells[enemyOneCurrentPosition - 1].classList.contains('wall')
      const wallsTop = cells[enemyOneCurrentPosition - width].classList.contains('wall')
      const wallsBottom = cells[enemyOneCurrentPosition + width].classList.contains('wall')
      const wallsTopBottom = cells[enemyOneCurrentPosition + width].classList.contains('wall') && cells[enemyOneCurrentPosition + width].classList.contains('wall')
      const wallsRight = cells[enemyOneCurrentPosition + 1].classList.contains('wall')
      const wallsLeft = cells[enemyOneCurrentPosition - 1].classList.contains('wall')
      const wallsRightLeft = cells[enemyOneCurrentPosition + 1].classList.contains('wall') && cells[enemyOneCurrentPosition - 1].classList.contains('wall')

      if (enemyWallsGateBottom) {
        clearInterval(inBox)
      }

      removeEnemyOne(enemyOneCurrentPosition)


      if (enemyWallsTopBottomLeft) {
        enemyOneCurrentPosition += 1
      }
      else if (enemyWallsTopBottomRight) {
        enemyOneCurrentPosition -= 1
      }
      else if (enemyWallsBottom) {
        enemyOneCurrentPosition -= width
      }
      else if (enemyWallsGateCurrent) {
        enemyOneCurrentPosition -= width
      }
      addEnemyOne(enemyOneCurrentPosition)
    }, 1000)
  }


  loadEnemies(enemyOneStartPosition)





























  //*END GAME LOGIC - COUNTS IF ANY DIVS CONTAIN ENERGIZER OR SURFACE CLASS

  function checkForWin() {
    const leftEnergizer = cells.filter(cell => cell.classList.contains('energizer'))
    if (!leftEnergizer.length) {
      const leftSurface = cells.filter(cell => cell.classList.contains('surface'))
      if (!leftSurface.length) {
        infoElement.innerText = ''
        gridWrapper.removeChild(grid)
        const winnerBanner = document.createElement('h2')
        winnerBanner.innerText = 'YOU RAISED THE BAR! \n \nGREAT JOB'
        main.appendChild(winnerBanner)
      }
    }
  }


  //*AUDIO SETTINGS
  function playMusic() {
    mainAudio.play()
    audioButton.classList.toggle('active')
    window.removeEventListener('keydown', playMusic)
  }
  function togglePlay() {
    mainAudio.paused ? mainAudio.play() : mainAudio.pause()
    audioButton.classList.toggle('active')
  }








  //*EVENT LISTNERS
  document.addEventListener('keydown', characterMove)

  document.addEventListener('keydown', coin)
  document.addEventListener('keyup', coin)
  document.addEventListener('keydown', energize)
  document.addEventListener('keyup', energize)
  document.addEventListener('keydown', bonusPoints)
  document.addEventListener('keyup', bonusPoints)


  window.addEventListener('load', enemyOneBoxOut)
  window.addEventListener('keydown', checkForWin)

  audioButton.addEventListener('click', togglePlay)
  window.addEventListener('keydown', playMusic)





































































  //*BACKGROUND FUNCTIONALITY
  //*BOARD FLOOR - SURFACE CLASS
  function playingSurface(numStart, numEnd) {
    for (let i = numStart; i <= numEnd; i++) {
      cells[i].classList.add('surface')
    }
  }
  playingSurface(29, 40)
  playingSurface(43, 54)
  playingSurface(141, 166)
  playingSurface(225, 230)
  playingSurface(255, 230)
  playingSurface(233, 236)
  playingSurface(239, 242)
  playingSurface(245, 250)
  playingSurface(561, 572)
  playingSurface(575, 586)
  playingSurface(646, 647)
  playingSurface(650, 656)
  playingSurface(658, 665)
  playingSurface(668, 669)
  playingSurface(729, 734)
  playingSurface(737, 740)
  playingSurface(743, 746)
  playingSurface(749, 754)
  playingSurface(813, 838)
  function surfaceSingle(num) {
    cells[num].classList.add('surface')
  }
  surfaceSingle(57)
  surfaceSingle(62)
  surfaceSingle(68)
  surfaceSingle(71)
  surfaceSingle(77)
  surfaceSingle(82)
  surfaceSingle(90)
  surfaceSingle(96)
  surfaceSingle(99)
  surfaceSingle(105)
  surfaceSingle(113)
  surfaceSingle(118)
  surfaceSingle(124)
  surfaceSingle(127)
  surfaceSingle(133)
  surfaceSingle(138)
  surfaceSingle(169)
  surfaceSingle(174)
  surfaceSingle(177)
  surfaceSingle(186)
  surfaceSingle(189)
  surfaceSingle(194)
  surfaceSingle(197)
  surfaceSingle(202)
  surfaceSingle(205)
  surfaceSingle(214)
  surfaceSingle(217)
  surfaceSingle(222)
  surfaceSingle(258)
  surfaceSingle(273)
  surfaceSingle(286)
  surfaceSingle(301)
  surfaceSingle(314)
  surfaceSingle(329)
  surfaceSingle(342)
  surfaceSingle(357)
  surfaceSingle(370)
  surfaceSingle(385)
  surfaceSingle(398)
  surfaceSingle(413)
  surfaceSingle(426)
  surfaceSingle(441)
  surfaceSingle(454)
  surfaceSingle(469)
  surfaceSingle(482)
  surfaceSingle(497)
  surfaceSingle(510)
  surfaceSingle(525)
  surfaceSingle(538)
  surfaceSingle(553)
  surfaceSingle(589)
  surfaceSingle(594)
  surfaceSingle(600)
  surfaceSingle(603)
  surfaceSingle(609)
  surfaceSingle(614)
  surfaceSingle(617)
  surfaceSingle(622)
  surfaceSingle(628)
  surfaceSingle(631)
  surfaceSingle(637)
  surfaceSingle(642)
  surfaceSingle(675)
  surfaceSingle(678)
  surfaceSingle(681)
  surfaceSingle(690)
  surfaceSingle(693)
  surfaceSingle(696)
  surfaceSingle(675)
  surfaceSingle(678)
  surfaceSingle(681)
  surfaceSingle(690)
  surfaceSingle(693)
  surfaceSingle(696)
  surfaceSingle(703)
  surfaceSingle(706)
  surfaceSingle(709)
  surfaceSingle(718)
  surfaceSingle(721)
  surfaceSingle(724)
  surfaceSingle(757)
  surfaceSingle(768)
  surfaceSingle(771)
  surfaceSingle(782)
  surfaceSingle(785)
  surfaceSingle(796)
  surfaceSingle(799)
  surfaceSingle(810)


  //*VOID BOARD SPACE - CLASS EMPTY-BACKGROUND
  function emptyGrid(numStart, numEnd) {
    for (let i = numStart; i <= numEnd; i++) {
      cells[i].classList.add('empty-background')
    }
  }
  emptyGrid(87, 88)
  emptyGrid(92, 94)
  emptyGrid(101, 103)
  emptyGrid(107, 108)
  emptyGrid(280, 284)
  emptyGrid(303, 307)
  emptyGrid(308, 312)
  emptyGrid(336, 340)
  emptyGrid(331, 335)
  emptyGrid(359, 363)
  emptyGrid(448, 452)
  emptyGrid(471, 475)
  emptyGrid(476, 480)
  emptyGrid(499, 503)
  emptyGrid(504, 508)
  emptyGrid(527, 531)


  //*PLAYING BORDERS - CLASS WALL
  function wallGridRow(numStart, numEnd) {
    for (let i = numStart; i <= numEnd; i++) {
      cells[i].classList.add('wall')
    }
  }
  wallGridRow(0, 28)
  wallGridRow(41, 42)
  wallGridRow(55, 56)
  wallGridRow(58, 61)
  wallGridRow(63, 67)
  wallGridRow(69, 70)
  wallGridRow(72, 76)
  wallGridRow(78, 81)
  wallGridRow(83, 84)
  wallGridRow(97, 98)
  wallGridRow(111, 112)
  wallGridRow(114, 117)
  wallGridRow(119, 123)
  wallGridRow(125, 126)
  wallGridRow(128, 132)
  wallGridRow(134, 137)
  wallGridRow(139, 140)
  wallGridRow(167, 168)
  wallGridRow(170, 173)
  wallGridRow(175, 176)
  wallGridRow(178, 185)
  wallGridRow(187, 188)
  wallGridRow(190, 193)
  wallGridRow(195, 196)
  wallGridRow(198, 201)
  wallGridRow(203, 204)
  wallGridRow(206, 213)
  wallGridRow(215, 216)
  wallGridRow(218, 221)
  wallGridRow(223, 224)
  wallGridRow(231, 232)
  wallGridRow(237, 238)
  wallGridRow(243, 244)
  wallGridRow(251, 257)
  wallGridRow(259, 263)
  wallGridRow(265, 266)
  wallGridRow(268, 270)
  wallGridRow(271, 272)
  wallGridRow(274, 279)
  wallGridRow(287, 291)
  wallGridRow(293, 294)
  wallGridRow(296, 300)
  wallGridRow(315, 316)
  wallGridRow(327, 328)
  wallGridRow(343, 344)
  wallGridRow(355, 356)
  wallGridRow(840, 867)
  wallGridRow(364, 369)
  wallGridRow(371, 372)
  wallGridRow(383, 384)
  wallGridRow(386, 391)
  wallGridRow(420, 425)
  wallGridRow(427, 428)
  wallGridRow(439, 440)
  wallGridRow(442, 447)
  wallGridRow(455, 456)
  wallGridRow(467, 468)
  wallGridRow(483, 484)
  wallGridRow(486, 493)
  wallGridRow(495, 496)
  wallGridRow(511, 512)
  wallGridRow(514, 521)
  wallGridRow(523, 524)
  wallGridRow(532, 537)
  wallGridRow(539, 540)
  wallGridRow(542, 549)
  wallGridRow(551, 552)
  wallGridRow(554, 559)
  wallGridRow(573, 574)
  wallGridRow(587, 588)
  wallGridRow(590, 593)
  wallGridRow(595, 599)
  wallGridRow(601, 602)
  wallGridRow(604, 608)
  wallGridRow(610, 613)
  wallGridRow(615, 616)
  wallGridRow(618, 621)
  wallGridRow(623, 627)
  wallGridRow(629, 630)
  wallGridRow(632, 636)
  wallGridRow(638, 641)
  wallGridRow(643, 644)
  wallGridRow(648, 649)
  wallGridRow(666, 667)
  wallGridRow(671, 674)
  wallGridRow(676, 677)
  wallGridRow(679, 680)
  wallGridRow(682, 689)
  wallGridRow(691, 692)
  wallGridRow(694, 695)
  wallGridRow(697, 702)
  wallGridRow(704, 705)
  wallGridRow(707, 708)
  wallGridRow(710, 717)
  wallGridRow(719, 720)
  wallGridRow(722, 723)
  wallGridRow(725, 728)
  wallGridRow(735, 736)
  wallGridRow(741, 742)
  wallGridRow(747, 748)
  wallGridRow(755, 756)
  wallGridRow(758, 767)
  wallGridRow(769, 770)
  wallGridRow(772, 781)
  wallGridRow(783, 784)
  wallGridRow(786, 795)
  wallGridRow(797, 798)
  wallGridRow(800, 809)
  wallGridRow(811, 812)
  function wallGridSingle(num) {
    cells[num].classList.add('wall')
  }
  wallGridSingle(86)
  wallGridSingle(89)
  wallGridSingle(91)
  wallGridSingle(95)
  wallGridSingle(100)
  wallGridSingle(104)
  wallGridSingle(106)
  wallGridSingle(109)
  wallGridSingle(285)
  wallGridSingle(302)
  wallGridSingle(313)
  wallGridSingle(330)
  wallGridSingle(341)
  wallGridSingle(358)
  wallGridSingle(453)
  wallGridSingle(470)
  wallGridSingle(481)
  wallGridSingle(498)
  wallGridSingle(509)
  wallGridSingle(526)
  wallGridSingle(560)
  wallGridSingle(839)


  //*ENEMY HOME BORDER / GATE - CLASS WALL & ENEMY-WALL / ENEMY-GATE
  function enemyWallRow(numStart, numEnd) {
    for (let i = numStart; i <= numEnd; i++) {
      cells[i].classList.add('wall')
      cells[i].classList.add('enemy-wall')
    }
  }
  enemyWallRow(346, 348)
  enemyWallRow(351, 353)
  enemyWallRow(374, 375)
  enemyWallRow(380, 381)
  enemyWallRow(402, 409)
  enemyWallRow(430, 437)
  function enemyGateRow(numStart, numEnd) {
    for (let i = numStart; i <= numEnd; i++) {
      cells[i].classList.add('enemy-gate')
    }
  }
  enemyGateRow(349, 350)


  //*DOTS & ENERGIZER
  function energizerGrid(num) {
    cells[num].classList.add('surface')
    cells[num].classList.add('energizer')
  }

  energizerGrid(645)
  energizerGrid(670)
  energizerGrid(85)
  energizerGrid(110)
}
window.addEventListener('DOMContentLoaded', init)