function init() {

  //*MAIN DOM ELEMENTS
  const main = document.querySelector('main')
  const gridWrapper = document.querySelector('.grid-wrapper')
  const grid = document.querySelector('.grid')
  const topContainer = document.querySelector('.top-container')
  const currentScore = document.querySelector('#current-score')
  const highScore = document.querySelector('#high-score')
  const playAgain = document.querySelector('#play-again')
  const createdBy = document.querySelector('#created-by')
  const newHighscore = document.querySelector('#new-highscore')
  const nextRound = document.querySelector('#next-round')

  playAgain.style.display = 'none'
  createdBy.style.display = 'none'
  newHighscore.style.display = 'none'
  nextRound.style.display = 'none'

  //*IN GAME LIFE ELEMENTS
  const bonusInformation = document.querySelector('#bonus-information')
  const lives = document.querySelector('.lives')
  const heart1 = document.querySelector('#heart1')
  const heart2 = document.querySelector('#heart2')
  const heart3 = document.querySelector('#heart3')




  //*AUDIO FUNCTIONALITY
  const audioButton = document.querySelector('.sound')
  const mainAudio = new Audio('audio/background.mp3')
  const collectEnergizerAudio = new Audio('audio/energize.wav')
  const collectBonusAudio = new Audio('audio/bonus.wav')
  const enemyHitAudio = new Audio('audio/enemy-hit.wav')
  const gameOverAudio = new Audio('audio/game-over.wav')
  const gameWonAudio = new Audio('audio/jingle-win.wav')


  //*SCORING DISPLAY
  let score = 0
  currentScore.innerText = score

  let high = localStorage.getItem('highest-score')
  function displayHighScore(score, high) {
    if (score > high) {
      return highScore.innerText = score
    } else {
      return highScore.innerText = high
    }
  }



  //*GRID CREATION
  const width = 28
  const height = 31
  const cellCount = width * height
  const cells = []


  function createGrid(characterStartPosition, enemyOneStartPosition, enemyTwoStartPosition, enemyThreeStartPosition, enemyFourStartPosition) {
    for (let i = 0; i < cellCount; i++) {
      const cell = document.createElement('div')
      cell.innerText = i
      cell.classList.add('grid-piece')
      grid.appendChild(cell)
      cells.push(cell)
    }
    addCharacter(characterStartPosition)
    addEnemyOne(enemyOneStartPosition)
    addEnemyTwo(enemyTwoStartPosition)
    addEnemyThree(enemyThreeStartPosition)
    addEnemyFour(enemyFourStartPosition)
  }

  //*MAIN CHARACTER & ENEMY LOGIC - INITIALISING
  const characterStartPosition = 657
  let characterCurrentPosition = 657
  let characterClass = 'character'
  let characterLives = 3

  const enemyOneStartPosition = 376
  let enemyOneCurrentPosition = 376
  let enemyOneClass = 'enemyOne'

  const enemyTwoStartPosition = 377
  let enemyTwoCurrentPosition = 377
  let enemyTwoClass = 'enemyTwo'

  const enemyThreeStartPosition = 378
  let enemyThreeCurrentPosition = 378
  let enemyThreeClass = 'enemyThree'

  const enemyFourStartPosition = 379
  let enemyFourCurrentPosition = 379
  let enemyFourClass = 'enemyFour'

  //*ENEMY SPEED VARIABLE
  let initialSpeed = 200



  //*CREATE GRID NEEDS TO BE CALLED FOLLOWING CHARACTER INITIALISING (VARIABLES CAN'T BE HOISTED)
  createGrid(characterStartPosition, enemyOneStartPosition, enemyTwoStartPosition, enemyThreeStartPosition, enemyFourStartPosition)
  addEnergize()
  addSurface()


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
    } else if (key === 39 && characterCurrentPosition === 419) {
      characterCurrentPosition = 392
    }
    else if (key === 37 && characterCurrentPosition === 392) {
      characterCurrentPosition = 419
    }
    addCharacter(characterCurrentPosition)
  }


  //*ADDING POINTS & REMOVING CLASS
  //*ENERGIZERS
  //*INITIALLY HAD THIS FUNCTION TO FIRE SET TO KEYDOWN AND ONLY REGISTERED  AFTER PASSED ENERGIZER
  function energize() {
    if (cells[characterCurrentPosition].classList.contains('energizer')) {
      cells[characterCurrentPosition].classList.remove('energizer')
      collectEnergizerAudio.play()
      score += 90
    }
    currentScore.innerText = score
    displayHighScore(score, high)

  }
  //*COINS
  function coin() {
    if (cells[characterCurrentPosition].classList.contains('surface')) {
      cells[characterCurrentPosition].classList.remove('surface')
      score += 10
    }
    currentScore.innerText = score
    displayHighScore(score, high)
  }



  //*RANDOM ITEM SPAWN & ARRAY FACTS
  function bonusItem() {
    const bonusArray = ['stations', 'whitechapel-road', 'pentonville-road', 'northumberland-avenue', 'vine-street', 'trafalgar-square', 'piccadilly', 'bond-street', 'mayfair']
    let randomChoice = bonusArray[Math.floor(Math.random() * 9)]
    if (cells[461].classList.length <= 1) {
      cells[461].classList.add(randomChoice)
    }
  }
  setInterval(bonusItem, 1000)


  function removeBonus(bonusName) {
    cells[461].classList.remove(bonusName)
    score += 30
    collectBonusAudio.play()
  }
  function bonusPoints() {
    let choice = Math.floor(Math.random() * 3)

    if (characterCurrentPosition === 461 && cells[461].classList.contains('stations')) {
      cells[461].classList.remove('stations')
      removeBonus('stations')
      const stationFacts = [`Liverpool Street served over 65 million passengers in 2019`, `The land where Kings Cross Station stands originally cost £65,000. The stations recent refurbishments cost £650 million`, `Kings Cross St. Pancras Station is the most well connected underground station in the network, accomidating six lines.`]
      bonusInformation.innerText = stationFacts[choice]
    }

    else if (characterCurrentPosition === 461 && cells[461].classList.contains('whitechapel-road')) {
      cells[461].classList.remove('whitechapel-road')
      removeBonus('whitechapel-road')
      const whitechapelRoadFacts = [`Old Street is the only Monopoly location south of the River Thames`, `Old Street is the only Monopoly location outside && more than one stop away from the Circle Line`, `Whitechapel Road is named after a small chapel dedicaed to St Mary`]
      bonusInformation.innerText = whitechapelRoadFacts[choice]
    }

    else if (characterCurrentPosition === 461 && cells[461].classList.contains('pentonville-road')) {
      cells[461].classList.remove('pentonville-road')
      removeBonus('pentonville-road')
      const pentonvilleRoadFascts = [`The Angel, Islington, is a historic landmark and a series of buildings`, `Pentonville Road was built mid 18th century and became known for numerous factories following the arrival of London railways`, `When first built Euston Road was built using more than 10 million bricks`]
      bonusInformation.innerText = pentonvilleRoadFascts[choice]
    }

    else if (characterCurrentPosition === 461 && cells[461].classList.contains('northumberland-avenue')) {
      cells[461].classList.remove('northumberland-avenue')
      removeBonus('northumberland-avenue')
      const northumberlandAvenueFacts = [`Northumberland Avenue was built to accomodate luxury hotels`, `The average price of a house in Whitehall is £1,012,502. Compared to 100 Monopoly Dollars`, `The name Pall Mall is derived from a 17th centry ball game called 'pall-mall'`]
      bonusInformation.innerText = northumberlandAvenueFacts[choice]
    }

    else if (characterCurrentPosition === 461 && cells[461].classList.contains('vine-street')) {
      cells[461].classList.remove('vine-street')
      removeBonus('vine-street')
      const vineStreetFacts = [`Vine Street - the shortest street on the Monopoly Board - only 70 feet.`, `There is no actual Marlborough Street in this part of London, it was misnamed after Malborough Street Magistrates Court`, `Vine Street is named after the 18th Century public house, 'The Vine' which inturn may have been named after a Roman time vineyard which existed in the area`]
      bonusInformation.innerText = vineStreetFacts[choice]
    }

    else if (characterCurrentPosition === 461 && cells[461].classList.contains('trafalgar-square')) {
      cells[461].classList.remove('trafalgar-square')
      removeBonus('trafalgar-square')
      const trafalgarSquareFacts = [`Fleet Street became famous for print and publishing, by the 20th century most British national newspapers operated from here.`, `Strand was the first road in London to have a numbered address`, `Trafalgar Squares Lions were made from melted cannons`]
      bonusInformation.innerText = trafalgarSquareFacts[choice]

    } else if (characterCurrentPosition === 461 && cells[461].classList.contains('piccadilly')) {
      cells[461].classList.remove('piccadilly')
      removeBonus('piccadilly')
      const piccadillyFacts = [`In 1612 Robert Baker made his wealth from the sale of Picadils, stiff collars worn the fashionable men in court, his house derisively become known as Picadil Hall, located in the area we now know as Piccadilly Circus.`, `The adverts at Piccadilly Circus have been turned off twice: the funerals of Winston Churchill and Princess Diana`, `The 'circus' refers to it's a circle... or roundabout`]
      bonusInformation.innerText = piccadillyFacts[choice]


    } else if (characterCurrentPosition === 461 && cells[461].classList.contains('bond-street')) {
      cells[461].classList.remove('bond-street')
      removeBonus('bond-street')
      const bondStreetFacts = [`There is no actual bond street, it's split into New / Old Bond Street`, `Oxford Street is Europes biggest shopping street, with around half a million daily visitors`, `Hamleys toy store is the oldest operating business of Regend Street`]
      bonusInformation.innerText = bondStreetFacts[choice]


    } else if (characterCurrentPosition === 461 && cells[461].classList.contains('mayfair')) {
      removeBonus('property')
      cells[461].classList.remove('mayfair')
      const mayfairFacts = [`Real house prices in Mayfair aren't 200 Monolopoly Dollars, they average £2,584,791`, `Like Monopoly, Mayfair, City of Westminster is London's most expensive borough. Here you'll find Savile Row and Burlington Arcade`, `Mayfair is named after the annual fortnight-long 'May Fair' that ran between 1686 and 1764`]
      bonusInformation.innerText = mayfairFacts[choice]
    }
  }





  //*ENEMY ONE INITIALISE
  function addEnemyOne(position) {
    cells[position].classList.add(enemyOneClass)
  }
  function removeEnemyOne(position) {
    cells[position].classList.remove(enemyOneClass)
  }

  //*ENEMY TWO INITIALISE
  function addEnemyTwo(position) {
    cells[position].classList.add(enemyTwoClass)
  }
  function removeEnemyTwo(position) {
    cells[position].classList.remove(enemyTwoClass)
  }

  //*ENEMY THREE INITIALISE
  function addEnemyThree(position) {
    cells[position].classList.add(enemyThreeClass)
  }
  function removeEnemyThree(position) {
    cells[position].classList.remove(enemyThreeClass)
  }

  //*ENEMY FOUR INITIALISE
  function addEnemyFour(position) {
    cells[position].classList.add(enemyFourClass)
  }
  function removeEnemyFour(position) {
    cells[position].classList.remove(enemyFourClass)
  }


  //*LOGIC IN BOX
  const innerEnemyWallBottom = enemyCurrentPosition => cells[enemyCurrentPosition + width].classList.contains('inner-enemy-wall')
  const innerEnemyWallBottomLeft = enemyCurrentPosition => cells[enemyCurrentPosition + width].classList.contains('inner-enemy-wall') && cells[enemyCurrentPosition - 1].classList.contains('inner-enemy-wall')
  const innerEnemyWallBottomRight = enemyCurrentPosition => cells[enemyCurrentPosition + width].classList.contains('inner-enemy-wall') && cells[enemyCurrentPosition + 1].classList.contains('inner-enemy-wall')
  const enemyWallsGateCurrent = enemyCurrentPosition => cells[enemyCurrentPosition].classList.contains('enemy-gate')

  const enemyWallsTopBottomRight = enemyCurrentPosition => cells[enemyCurrentPosition - width].classList.contains('enemy-wall') && cells[enemyCurrentPosition + width].classList.contains('enemy-wall') && cells[enemyCurrentPosition + 1].classList.contains('enemy-wall')
  const enemyWallsTopBottomLeft = enemyCurrentPosition => cells[enemyCurrentPosition - width].classList.contains('enemy-wall') && cells[enemyCurrentPosition + width].classList.contains('enemy-wall') && cells[enemyCurrentPosition - 1].classList.contains('enemy-wall')
  const enemyWallsBottom = enemyCurrentPosition => cells[enemyCurrentPosition + width].classList.contains('enemy-wall')
  const enemyWallsGateBottom = enemyCurrentPosition => cells[enemyCurrentPosition + width].classList.contains('enemy-gate')
  const enemyWallsLeft = enemyCurrentPosition => cells[enemyCurrentPosition--].classList.contains('enemy-gate')
  const enemyWallsRight = enemyCurrentPosition => cells[enemyCurrentPosition++].classList.contains('enemy-gate')



  //*LOGIC TO LOCATE MAIN CHARACTER
  const greaterThan = enemyCurrentPosition => characterCurrentPosition > enemyCurrentPosition
  const greaterThanCol = enemyCurrentPosition => (characterCurrentPosition % width) > (enemyCurrentPosition % width)
  const colEqual = enemyCurrentPosition => (characterCurrentPosition % width) === (enemyCurrentPosition % width)
  const vacantTop = enemyCurrentPosition => !cells[enemyCurrentPosition - width].classList.contains('wall')
  const vacantTopRight = enemyCurrentPosition => !cells[enemyCurrentPosition - width].classList.contains('wall') && !cells[enemyCurrentPosition + 1].classList.contains('wall')
  const vacantRight = enemyCurrentPosition => !(cells[enemyCurrentPosition + 1].classList.contains('wall'))
  const vacantTopBottomRight = enemyCurrentPosition => !cells[enemyCurrentPosition - width].classList.contains('wall') && !cells[enemyCurrentPosition + width].classList.contains('wall') && !cells[enemyCurrentPosition + 1].classList.contains('wall')
  const vacantBottomRight = enemyCurrentPosition => !cells[enemyCurrentPosition + width].classList.contains('wall') && !cells[enemyCurrentPosition + 1].classList.contains('wall')
  const vacantBottom = enemyCurrentPosition => !cells[enemyCurrentPosition + width].classList.contains('wall')
  const vacantBottomLeftRight = enemyCurrentPosition => !cells[enemyCurrentPosition + width].classList.contains('wall') && !cells[enemyCurrentPosition - 1].classList.contains('wall') && !cells[enemyCurrentPosition + 1].classList.contains('wall')
  const vacantBottomLeft = enemyCurrentPosition => !cells[enemyCurrentPosition + width].classList.contains('wall') && !cells[enemyCurrentPosition - 1].classList.contains('wall')
  const vacantTopBottomLeft = enemyCurrentPosition => !cells[enemyCurrentPosition - width].classList.contains('wall') && !cells[enemyCurrentPosition + width].classList.contains('wall') && !cells[enemyCurrentPosition - 1].classList.contains('wall')
  const vacantLeft = enemyCurrentPosition => !cells[enemyCurrentPosition - 1].classList.contains('wall')
  const vacantTopLeft = enemyCurrentPosition => !cells[enemyCurrentPosition - width].classList.contains('wall') && !cells[enemyCurrentPosition - 1].classList.contains('wall')
  const vacantTopLeftRight = enemyCurrentPosition => !cells[enemyCurrentPosition - width].classList.contains('wall') && !cells[enemyCurrentPosition - 1].classList.contains('wall') && !cells[enemyCurrentPosition + 1].classList.contains('wall')
  const vacantLeftRight = enemyCurrentPosition => !cells[enemyCurrentPosition - 1].classList.contains('wall') && !cells[enemyCurrentPosition + 1].classList.contains('wall')
  const vacantTopBottom = enemyCurrentPosition => !cells[enemyCurrentPosition - width].classList.contains('wall') && !cells[enemyCurrentPosition + width].classList.contains('wall')
  const vacantAll = enemyCurrentPosition => !cells[enemyCurrentPosition - width].classList.contains('wall') && !cells[enemyCurrentPosition + width].classList.contains('wall') && !cells[enemyCurrentPosition + 1].classList.contains('wall') && !cells[enemyCurrentPosition - 1].classList.contains('wall')


//*LOGIC TO DETERMINE ROW
function characterRow(characterCurrentPosition) {
  for (let i=characterCurrentPosition; i+28; i++) {
    if ((i+1) % 28 === 0) {
      let row = ((i+1) / 28)
      return row
    }
  }
}


function enemyRow(enemyCurrentPosition) {
  for (let i=enemyCurrentPosition; i+28; i++) {
    if ((i+1) % 28 === 0) {
      let row = ((i+1) / 28)
      return row
    }
  }
}

console.log(characterRow(characterCurrentPosition))
console.log(enemyRow(enemyOneCurrentPosition))



  //*LOGIC TO AVOID TRAPS
  const inTrapCharacterBottomRightGoUp = enemyCurrentPosition => enemyCurrentPosition === 186 || enemyCurrentPosition === 214 || enemyCurrentPosition === 242 || enemyCurrentPosition === 678 || enemyCurrentPosition === 706 || enemyCurrentPosition === 734 || enemyCurrentPosition === 690 || enemyCurrentPosition === 718 || enemyCurrentPosition === 746
 

  const inTrapCharacterBottomRightGoLeft = enemyCurrentPosition => enemyCurrentPosition === 240 || enemyCurrentPosition === 241 || enemyCurrentPosition === 246 || enemyCurrentPosition === 247 || enemyCurrentPosition === 248 || enemyCurrentPosition === 249 || enemyCurrentPosition === 250 || enemyCurrentPosition === 733 || enemyCurrentPosition === 732 || enemyCurrentPosition === 731 || enemyCurrentPosition === 730 || enemyCurrentPosition === 745 || enemyCurrentPosition === 744 || enemyCurrentPosition === 743 || enemyCurrentPosition === 669 || enemyCurrentPosition === 414 || enemyCurrentPosition === 415 || enemyCurrentPosition === 416 || enemyCurrentPosition === 417 || enemyCurrentPosition === 418 || enemyCurrentPosition === 419



  const inTrapCharacterBottomLeftGoUp = enemyCurrentPosition => enemyCurrentPosition === 177 || enemyCurrentPosition === 205 || enemyCurrentPosition === 233 || enemyCurrentPosition === 681 || enemyCurrentPosition === 709 || enemyCurrentPosition === 737 || enemyCurrentPosition === 693 || enemyCurrentPosition === 721 || enemyCurrentPosition === 749

  const inTrapCharacterBottomLeftGoRight = enemyCurrentPosition => enemyCurrentPosition === 234 || enemyCurrentPosition === 235 || enemyCurrentPosition === 226 || enemyCurrentPosition === 227 || enemyCurrentPosition === 228 || enemyCurrentPosition === 229 || enemyCurrentPosition === 246 || enemyCurrentPosition === 738 || enemyCurrentPosition === 739 || enemyCurrentPosition === 750 || enemyCurrentPosition === 751 || enemyCurrentPosition === 752 || enemyCurrentPosition === 753 || enemyCurrentPosition === 397 || enemyCurrentPosition === 396 || enemyCurrentPosition === 395 || enemyCurrentPosition === 394 || enemyCurrentPosition === 393 || enemyCurrentPosition === 392 || enemyCurrentPosition === 646



const inTrapCharacterTopRightGoDown = enemyCurrentPosition => enemyCurrentPosition === 40 || enemyCurrentPosition === 68 || enemyCurrentPosition === 96 || enemyCurrentPosition === 124 || enemyCurrentPosition === 236 || enemyCurrentPosition === 264 || enemyCurrentPosition === 292 || enemyCurrentPosition === 326 || enemyCurrentPosition === 354 || enemyCurrentPosition === 382 || enemyCurrentPosition === 572 || enemyCurrentPosition === 600 || enemyCurrentPosition === 628 || enemyCurrentPosition === 647 || enemyCurrentPosition === 675 || enemyCurrentPosition === 703 || enemyCurrentPosition === 740 || enemyCurrentPosition === 768 || enemyCurrentPosition === 796 

const inTrapCharacterTopRightGoLeft = enemyCurrentPosition => enemyCurrentPosition === 235 || enemyCurrentPosition === 234 || enemyCurrentPosition === 325 || enemyCurrentPosition === 324 || enemyCurrentPosition === 419 || enemyCurrentPosition === 418 || enemyCurrentPosition === 417 || enemyCurrentPosition === 416  || enemyCurrentPosition === 415 || enemyCurrentPosition === 414 || enemyCurrentPosition === 586 || enemyCurrentPosition === 585 || enemyCurrentPosition === 584 || enemyCurrentPosition === 583 || enemyCurrentPosition === 582 || enemyCurrentPosition === 571 || enemyCurrentPosition === 570 || enemyCurrentPosition === 647 || enemyCurrentPosition === 646 || enemyCurrentPosition === 739 || enemyCurrentPosition === 738 || enemyCurrentPosition === 754 || enemyCurrentPosition === 753



const inTrapCharacterTopLeftGoDown = enemyCurrentPosition => enemyCurrentPosition === 43 || enemyCurrentPosition === 71 || enemyCurrentPosition === 99 || enemyCurrentPosition === 127 || enemyCurrentPosition === 239 || enemyCurrentPosition === 267 || enemyCurrentPosition === 295 || enemyCurrentPosition === 317 || enemyCurrentPosition === 345 || enemyCurrentPosition === 373 || enemyCurrentPosition === 575 || enemyCurrentPosition === 603 || enemyCurrentPosition === 631 || enemyCurrentPosition === 668 || enemyCurrentPosition === 696 || enemyCurrentPosition === 724 || enemyCurrentPosition === 743 || enemyCurrentPosition === 771 || enemyCurrentPosition === 799 

const inTrapCharacterTopLeftGoRight = enemyCurrentPosition => enemyCurrentPosition === 240 || enemyCurrentPosition === 241 || enemyCurrentPosition === 318 || enemyCurrentPosition === 319 || enemyCurrentPosition === 392 || enemyCurrentPosition === 393 || enemyCurrentPosition === 394 || enemyCurrentPosition === 395  || enemyCurrentPosition === 396 || enemyCurrentPosition === 397 || enemyCurrentPosition === 561 || enemyCurrentPosition === 562 || enemyCurrentPosition === 563 || enemyCurrentPosition === 564 || enemyCurrentPosition === 565 || enemyCurrentPosition === 576 || enemyCurrentPosition === 577 || enemyCurrentPosition === 668 || enemyCurrentPosition === 669 || enemyCurrentPosition === 744 || enemyCurrentPosition === 745 || enemyCurrentPosition === 729 || enemyCurrentPosition === 730 && characterCurrentPosition !== 317









  function locateEnemy() {
    const locateCharacter = setInterval(() => {
      const route = Math.floor(Math.random() * 12)
      removeEnemyOne(enemyOneCurrentPosition)
      if (innerEnemyWallBottomLeft(enemyOneCurrentPosition)) {
        enemyOneCurrentPosition += 1
      } else if (innerEnemyWallBottomRight(enemyOneCurrentPosition)) {
        enemyOneCurrentPosition -= 1
      } else if (innerEnemyWallBottom(enemyOneCurrentPosition)) {
        enemyOneCurrentPosition -= width
      } else if (enemyWallsGateCurrent(enemyOneCurrentPosition)) {
        enemyOneCurrentPosition -= width
      }

//*DIRECT LEFT
// else if (greaterThan(enemyOneCurrentPosition) && )


      //* DIRECT BELOW
      else if (greaterThan(enemyOneCurrentPosition) && colEqual(enemyOneCurrentPosition)) {
        if (vacantBottom(enemyOneCurrentPosition)) {
          enemyOneCurrentPosition += width
        } else if (vacantLeft(enemyOneCurrentPosition)) {
          enemyOneCurrentPosition -= 1
        } else if (vacantRight(enemyOneCurrentPosition)) {
          enemyOneCurrentPosition += 1
        }
      }



      //* BOTTOM RIGHT
      else if (greaterThan(enemyOneCurrentPosition) && greaterThanCol(enemyOneCurrentPosition)) {
        if ((inTrapCharacterBottomRightGoUp(enemyOneCurrentPosition)) && (characterRow(characterCurrentPosition) !== enemyRow(enemyOneCurrentPosition))) {
          enemyOneCurrentPosition -= width
        } else if ((inTrapCharacterBottomRightGoLeft(enemyOneCurrentPosition)) && (characterRow(characterCurrentPosition) !== enemyRow(enemyOneCurrentPosition))) {
          enemyOneCurrentPosition -= 1
        } else if (vacantBottomRight(enemyOneCurrentPosition)) {
          if (route < 6) {
            enemyOneCurrentPosition += width
          } else {
            enemyOneCurrentPosition += 1
          }
        } else if (vacantBottom(enemyOneCurrentPosition)) {
          enemyOneCurrentPosition += width
        } else if (vacantRight(enemyOneCurrentPosition)) {
          enemyOneCurrentPosition += 1
        }
      }


      //*BOTTOM LEFT
      else if (greaterThan(enemyOneCurrentPosition) && !greaterThanCol(enemyOneCurrentPosition)) {
        if ((inTrapCharacterBottomLeftGoUp(enemyOneCurrentPosition)) && (characterRow(characterCurrentPosition) !== enemyRow(enemyOneCurrentPosition))) {
          enemyOneCurrentPosition -= width
        } else if ((inTrapCharacterBottomLeftGoRight(enemyOneCurrentPosition)) && (characterRow(characterCurrentPosition) !== enemyRow(enemyOneCurrentPosition))) {
          enemyOneCurrentPosition += 1
        } else if (vacantBottomLeft(enemyOneCurrentPosition)) {
          if (route < 6) {
            enemyOneCurrentPosition += width
          } else {
            enemyOneCurrentPosition -= 1
          }
        } else if (vacantBottom(enemyOneCurrentPosition)) {
          enemyOneCurrentPosition += width
        } else if (vacantLeft(enemyOneCurrentPosition)) {
          enemyOneCurrentPosition -= 1
        }
      }



      //* DIRECT ABOVE
      else if (!greaterThan(enemyOneCurrentPosition) && colEqual(enemyOneCurrentPosition)) {
        if (vacantTop(enemyOneCurrentPosition)) {
          enemyOneCurrentPosition -= width
        } else if (vacantLeft(enemyOneCurrentPosition)) {
          enemyOneCurrentPosition -= 1
        } else if (vacantRight(enemyOneCurrentPosition)) {
          enemyOneCurrentPosition += 1
        }
      }


      //* TOP RIGHT
      else if (!greaterThan(enemyOneCurrentPosition) && greaterThanCol(enemyOneCurrentPosition)) {
        if ((inTrapCharacterTopRightGoDown(enemyOneCurrentPosition)) && (characterRow(characterCurrentPosition) !== enemyRow(enemyOneCurrentPosition))) {
          enemyOneCurrentPosition += width
        } else if ((inTrapCharacterTopRightGoLeft(enemyOneCurrentPosition)) && (characterRow(characterCurrentPosition) !== enemyRow(enemyOneCurrentPosition))) {
          enemyOneCurrentPosition -= 1
        } else if (vacantTopRight(enemyOneCurrentPosition)) {
          if (route < 6) {
            enemyOneCurrentPosition -= width
          } else {
            enemyOneCurrentPosition += 1
          }
        } else if (vacantTop(enemyOneCurrentPosition)) {
          enemyOneCurrentPosition -= width
        } else if (vacantRight(enemyOneCurrentPosition)) {
          enemyOneCurrentPosition += 1
        }
      }


      //* TOP LEFT
      else if (!greaterThan(enemyOneCurrentPosition) && !greaterThanCol(enemyOneCurrentPosition)) {
        if ((inTrapCharacterTopLeftGoDown(enemyOneCurrentPosition)) && (characterRow(characterCurrentPosition) !== enemyRow(enemyOneCurrentPosition))) {
          enemyOneCurrentPosition += width
        } else if ((inTrapCharacterTopLeftGoRight(enemyOneCurrentPosition)) && (characterRow(characterCurrentPosition) !== enemyRow(enemyOneCurrentPosition))) {
          enemyOneCurrentPosition += 1
        } else if (vacantTopLeft(enemyOneCurrentPosition)) {
          if (route < 6) {
            enemyOneCurrentPosition -= width
          } else {
            enemyOneCurrentPosition -= 1
          }
        } else if (vacantTop(enemyOneCurrentPosition)) {
          enemyOneCurrentPosition -= width
        } else if (vacantLeft(enemyOneCurrentPosition)) {
          enemyOneCurrentPosition -= 1
        }
      }



      addEnemyOne(enemyOneCurrentPosition)
    }, initialSpeed)
  }











  // //*MOVE ENEMY OUT OF BOX
  // //*ENEMY ONE
  // function enemyOneBoxOut() {
  //   const whilstOneInBox = setInterval(() => {
  //     if (enemyOneCurrentPosition === 321) {
  //       oneLocateCharacter()
  //       clearInterval(whilstOneInBox)
  //     }
  //     removeEnemyOne(enemyOneCurrentPosition)
  //     if (enemyOneCurrentPosition === 376) {
  //       enemyOneCurrentPosition += 1
  //     }
  //     else if (enemyOneCurrentPosition === 377) {
  //       enemyOneCurrentPosition -= width
  //     }
  //     else if (enemyOneCurrentPosition === 349) {
  //       enemyOneCurrentPosition -= width
  //     }
  //     addEnemyOne(enemyOneCurrentPosition)
  //   }, 1000)
  // }

  // //*ENEMY TWO
  // function enemyTwoBoxOut() {
  //   const whilstTwoInBox = setInterval(() => {
  //     if (enemyTwoCurrentPosition === 401) {
  //       twoLocateCharacter()
  //       clearInterval(whilstTwoInBox)
  //     }
  //     removeEnemyTwo(enemyTwoCurrentPosition)
  //     if (enemyTwoCurrentPosition === 377) {
  //       enemyTwoCurrentPosition -= width
  //     }
  //     else if (enemyTwoCurrentPosition === 349) {
  //       enemyTwoCurrentPosition -= width
  //     }
  //     else if (enemyTwoCurrentPosition === 321) {
  //       enemyTwoCurrentPosition -= 1
  //     }
  //     else if (enemyTwoCurrentPosition === 320) {
  //       enemyTwoCurrentPosition -= 1
  //     }
  //     else if (enemyTwoCurrentPosition === 319) {
  //       enemyTwoCurrentPosition -= 1
  //     }
  //     else if (enemyTwoCurrentPosition === 318) {
  //       enemyTwoCurrentPosition -= 1
  //     }
  //     else if (enemyTwoCurrentPosition === 317) {
  //       enemyTwoCurrentPosition += width
  //     }
  //     else if (enemyTwoCurrentPosition === 345) {
  //       enemyTwoCurrentPosition += width
  //     }
  //     else if (enemyTwoCurrentPosition === 373) {
  //       enemyTwoCurrentPosition += width
  //     }
  //     addEnemyTwo(enemyTwoCurrentPosition)
  //   }, 1000)
  // }


  // //*ENEMY THREE
  // function enemyThreeBoxOut() {
  //   const whilstThreeInBox = setInterval(() => {
  //     if (enemyThreeCurrentPosition === 410) {
  //       threeLocateCharacter()
  //       clearInterval(whilstThreeInBox)
  //     }
  //     removeEnemyThree(enemyThreeCurrentPosition)
  //     if (enemyThreeCurrentPosition === 378) {
  //       enemyThreeCurrentPosition -= width
  //     }
  //     else if (enemyThreeCurrentPosition === 350) {
  //       enemyThreeCurrentPosition -= width
  //     }
  //     else if (enemyThreeCurrentPosition === 322) {
  //       enemyThreeCurrentPosition += 1
  //     }
  //     else if (enemyThreeCurrentPosition === 320) {
  //       enemyThreeCurrentPosition += 1
  //     }
  //     else if (enemyThreeCurrentPosition === 323) {
  //       enemyThreeCurrentPosition += 1
  //     }
  //     else if (enemyThreeCurrentPosition === 324) {
  //       enemyThreeCurrentPosition += 1
  //     }
  //     else if (enemyThreeCurrentPosition === 325) {
  //       enemyThreeCurrentPosition += 1
  //     }
  //     else if (enemyThreeCurrentPosition === 326) {
  //       enemyThreeCurrentPosition += width
  //     }
  //     else if (enemyThreeCurrentPosition === 354) {
  //       enemyThreeCurrentPosition += width
  //     }
  //     else if (enemyThreeCurrentPosition === 382) {
  //       enemyThreeCurrentPosition += width
  //     }
  //     addEnemyThree(enemyThreeCurrentPosition)
  //   }, 1000)
  // }


  // //*ENEMY FOUR
  // function enemyFourBoxOut() {
  //   const whilstFourInBox = setInterval(() => {
  //     if (enemyFourCurrentPosition === 295) {
  //       fourLocateCharacter()
  //       clearInterval(whilstFourInBox)
  //     }
  //     removeEnemyFour(enemyFourCurrentPosition)
  //     if (enemyFourCurrentPosition === 379) {
  //       enemyFourCurrentPosition--
  //     } else if (enemyFourCurrentPosition === 378) {
  //       enemyFourCurrentPosition--
  //     } else if (enemyFourCurrentPosition === 377) {
  //       enemyFourCurrentPosition -= width
  //     } else if (enemyFourCurrentPosition === 349) {
  //       enemyFourCurrentPosition++
  //     } else if (enemyFourCurrentPosition === 350) {
  //       enemyFourCurrentPosition -= width
  //     } else if (enemyFourCurrentPosition === 349) {
  //       enemyFourCurrentPosition++
  //     } else if (enemyFourCurrentPosition === 350) {
  //       enemyFourCurrentPosition -= width
  //     } else if (enemyFourCurrentPosition === 322) {
  //       enemyFourCurrentPosition++
  //     } else if (enemyFourCurrentPosition === 323) {
  //       enemyFourCurrentPosition -= width
  //     }
  //     addEnemyFour(enemyFourCurrentPosition)
  //   }, 1000)
  // }


  // //*LOCATE MAIN CHARACTER
  // //* ENEMY ONE
  // function oneLocateCharacter() {
  //   const whilstOneOutsideBox = setInterval(() => {
  //     removeEnemyOne(enemyOneCurrentPosition)
  //     if (cells[characterCurrentPosition].classList.contains(enemyOneClass)) {
  //       removeEnemyOne(enemyOneCurrentPosition)
  //     }
  //     const route = Math.floor(Math.random() * 4)
  //     if (greaterThan(enemyOneCurrentPosition) && greaterThanRow(enemyOneCurrentPosition)) {
  //       if (vacantBottomRight(enemyOneCurrentPosition)) {
  //         if (route < 2) {
  //           enemyOneCurrentPosition += width
  //         } else {
  //           enemyOneCurrentPosition++
  //         }
  //       } else if (vacantBottom(enemyOneCurrentPosition)) {
  //         enemyOneCurrentPosition += width
  //       } else if (vacantRight(enemyOneCurrentPosition)) {
  //         enemyOneCurrentPosition++
  //       }
  //     } else if (greaterThan(enemyOneCurrentPosition) && !greaterThanRow(enemyOneCurrentPosition)) {
  //       if (vacantBottomLeft(enemyOneCurrentPosition)) {
  //         if (route < 2) {
  //           enemyOneCurrentPosition += width
  //         } else {
  //           enemyOneCurrentPosition--
  //         }
  //       } else if (vacantBottom(enemyOneCurrentPosition)) {
  //         enemyOneCurrentPosition += width
  //       } else if (vacantLeft(enemyOneCurrentPosition)) {
  //         enemyOneCurrentPosition--
  //       } else if (vacantRight(enemyOneCurrentPosition)) {
  //         enemyOneCurrentPosition == width
  //       }
  //     } else if (!greaterThan(enemyOneCurrentPosition) && greaterThanRow(enemyOneCurrentPosition)) {
  //       if (vacantTopRight(enemyOneCurrentPosition)) {
  //         if (route < 2) {
  //           enemyOneCurrentPosition -= width
  //         } else {
  //           enemyOneCurrentPosition++
  //         }
  //       } else if (vacantTop(enemyOneCurrentPosition)) {
  //         enemyOneCurrentPosition -= width
  //       } else if (vacantRight(enemyOneCurrentPosition)) {
  //         enemyOneCurrentPosition++
  //       }
  //     } else if (!greaterThan(enemyOneCurrentPosition) && !greaterThanRow(enemyOneCurrentPosition)) {
  //       if (vacantTopLeft(enemyOneCurrentPosition)) {
  //         if (route < 2) {
  //           enemyOneCurrentPosition -= width
  //         } else {
  //           enemyOneCurrentPosition--
  //         }
  //       } else if (vacantTop(enemyOneCurrentPosition)) {
  //         enemyOneCurrentPosition -= width
  //       } else if (vacantLeft(enemyOneCurrentPosition)) {
  //         enemyOneCurrentPosition--
  //       }
  //     } else if (greaterThan(enemyOneCurrentPosition) && rowEqual(enemyOneCurrentPosition)) {
  //       if (vacantBottom(enemyOneCurrentPosition)) {
  //         enemyOneCurrentPosition += width
  //       } else if (vacantLeftRight) {
  //         if (route < 2) {
  //           enemyOneCurrentPosition--
  //         } else {
  //           enemyOneCurrentPosition++
  //         }
  //       }
  //     } else if (!greaterThan(enemyOneCurrentPosition) && rowEqual(enemyOneCurrentPosition)) {
  //       if (vacantBottomTop(enemyOneCurrentPosition)) {
  //         enemyOneCurrentPosition += width
  //       } else if (vacantLeftRight) {
  //         if (route < 2) {
  //           enemyOneCurrentPosition--
  //         } else {
  //           enemyOneCurrentPosition++
  //         }
  //       }
  //     }
  //     addEnemyOne(enemyOneCurrentPosition)
  //   }, outOfBoxSpeed)
  // }


  // //* ENEMY TWO
  // function twoLocateCharacter() {
  //   const whilstTwoOutsideBox = setInterval(() => {
  //     removeEnemyTwo(enemyTwoCurrentPosition)
  //     const route = Math.floor(Math.random() * 4)
  //     if (greaterThan(enemyTwoCurrentPosition) && greaterThanRow(enemyTwoCurrentPosition)) {
  //       if (vacantBottomRight(enemyTwoCurrentPosition)) {
  //         if (route < 2) {
  //           enemyTwoCurrentPosition += width
  //         } else {
  //           enemyTwoCurrentPosition++
  //         }
  //       } else if (vacantBottom(enemyTwoCurrentPosition)) {
  //         enemyTwoCurrentPosition += width
  //       } else if (vacantRight(enemyTwoCurrentPosition)) {
  //         enemyTwoCurrentPosition++
  //       }
  //     } else if (greaterThan(enemyTwoCurrentPosition) && !greaterThanRow(enemyTwoCurrentPosition)) {
  //       if (vacantBottomLeft(enemyTwoCurrentPosition)) {
  //         if (route < 2) {
  //           enemyTwoCurrentPosition += width
  //         } else {
  //           enemyTwoCurrentPosition--
  //         }
  //       } else if (vacantBottom(enemyTwoCurrentPosition)) {
  //         enemyTwoCurrentPosition += width
  //       } else if (vacantLeft(enemyTwoCurrentPosition)) {
  //         enemyTwoCurrentPosition--
  //       } else if (vacantRight(enemyTwoCurrentPosition)) {
  //         enemyTwoCurrentPosition == width
  //       }
  //     } else if (!greaterThan(enemyTwoCurrentPosition) && greaterThanRow(enemyTwoCurrentPosition)) {
  //       if (vacantTopRight(enemyTwoCurrentPosition)) {
  //         if (route < 2) {
  //           enemyTwoCurrentPosition -= width
  //         } else {
  //           enemyTwoCurrentPosition++
  //         }
  //       } else if (vacantTop(enemyTwoCurrentPosition)) {
  //         enemyTwoCurrentPosition -= width
  //       } else if (vacantRight(enemyTwoCurrentPosition)) {
  //         enemyTwoCurrentPosition++
  //       }
  //     } else if (!greaterThan(enemyTwoCurrentPosition) && !greaterThanRow(enemyTwoCurrentPosition)) {
  //       if (vacantTopLeft(enemyTwoCurrentPosition)) {
  //         if (route < 2) {
  //           enemyTwoCurrentPosition -= width
  //         } else {
  //           enemyTwoCurrentPosition--
  //         }
  //       } else if (vacantTop(enemyTwoCurrentPosition)) {
  //         enemyTwoCurrentPosition -= width
  //       } else if (vacantLeft(enemyTwoCurrentPosition)) {
  //         enemyTwoCurrentPosition--
  //       }
  //     } else if (greaterThan(enemyTwoCurrentPosition) && rowEqual(enemyTwoCurrentPosition)) {
  //       if (vacantBottom(enemyTwoCurrentPosition)) {
  //         enemyTwoCurrentPosition += width
  //       } else if (vacantLeftRight) {
  //         if (route < 2) {
  //           enemyTwoCurrentPosition--
  //         } else {
  //           enemyTwoCurrentPosition++
  //         }
  //       }
  //     } else if (!greaterThan(enemyTwoCurrentPosition) && rowEqual(enemyTwoCurrentPosition)) {
  //       if (vacantBottomTop(enemyTwoCurrentPosition)) {
  //         enemyTwoCurrentPosition += width
  //       } else if (vacantLeftRight) {
  //         if (route < 2) {
  //           enemyTwoCurrentPosition--
  //         } else {
  //           enemyTwoCurrentPosition++
  //         }
  //       }
  //     }
  //     addEnemyTwo(enemyTwoCurrentPosition)
  //   }, outOfBoxSpeed)
  // }



  // //* ENEMY THREE
  // function threeLocateCharacter() {
  //   const whilstThreeOutsideBox = setInterval(() => {
  //     removeEnemyThree(enemyThreeCurrentPosition)
  //     const route = Math.floor(Math.random() * 4)
  //     if (greaterThan(enemyThreeCurrentPosition) && greaterThanRow(enemyThreeCurrentPosition)) {
  //       if (vacantBottomRight(enemyThreeCurrentPosition)) {
  //         if (route < 2) {
  //           enemyThreeCurrentPosition += width
  //         } else {
  //           enemyThreeCurrentPosition++
  //         }
  //       } else if (vacantBottom(enemyThreeCurrentPosition)) {
  //         enemyThreeCurrentPosition += width
  //       } else if (vacantRight(enemyThreeCurrentPosition)) {
  //         enemyThreeCurrentPosition++
  //       }
  //     } else if (greaterThan(enemyThreeCurrentPosition) && !greaterThanRow(enemyThreeCurrentPosition)) {
  //       if (vacantBottomLeft(enemyThreeCurrentPosition)) {
  //         if (route < 2) {
  //           enemyThreeCurrentPosition += width
  //         } else {
  //           enemyThreeCurrentPosition--
  //         }
  //       } else if (vacantBottom(enemyThreeCurrentPosition)) {
  //         enemyThreeCurrentPosition += width
  //       } else if (vacantLeft(enemyThreeCurrentPosition)) {
  //         enemyThreeCurrentPosition--
  //       } else if (vacantRight(enemyThreeCurrentPosition)) {
  //         enemyThreeCurrentPosition == width
  //       }
  //     } else if (!greaterThan(enemyThreeCurrentPosition) && greaterThanRow(enemyThreeCurrentPosition)) {
  //       if (vacantTopRight(enemyThreeCurrentPosition)) {
  //         if (route < 2) {
  //           enemyThreeCurrentPosition -= width
  //         } else {
  //           enemyThreeCurrentPosition++
  //         }
  //       } else if (vacantTop(enemyThreeCurrentPosition)) {
  //         enemyThreeCurrentPosition -= width
  //       } else if (vacantRight(enemyThreeCurrentPosition)) {
  //         enemyThreeCurrentPosition++
  //       }
  //     } else if (!greaterThan(enemyThreeCurrentPosition) && !greaterThanRow(enemyThreeCurrentPosition)) {
  //       if (vacantTopLeft(enemyThreeCurrentPosition)) {
  //         if (route < 2) {
  //           enemyThreeCurrentPosition -= width
  //         } else {
  //           enemyThreeCurrentPosition--
  //         }
  //       } else if (vacantTop(enemyThreeCurrentPosition)) {
  //         enemyThreeCurrentPosition -= width
  //       } else if (vacantLeft(enemyThreeCurrentPosition)) {
  //         enemyThreeCurrentPosition--
  //       }
  //     } else if (greaterThan(enemyThreeCurrentPosition) && rowEqual(enemyThreeCurrentPosition)) {
  //       if (vacantBottom(enemyThreeCurrentPosition)) {
  //         enemyThreeCurrentPosition += width
  //       } else if (vacantLeftRight) {
  //         if (route < 2) {
  //           enemyThreeCurrentPosition--
  //         } else {
  //           enemyThreeCurrentPosition++
  //         }
  //       }
  //     } else if (!greaterThan(enemyThreeCurrentPosition) && rowEqual(enemyThreeCurrentPosition)) {
  //       if (vacantBottomTop(enemyThreeCurrentPosition)) {
  //         enemyThreeCurrentPosition += width
  //       } else if (vacantLeftRight) {
  //         if (route < 2) {
  //           enemyThreeCurrentPosition--
  //         } else {
  //           enemyThreeCurrentPosition++
  //         }
  //       }
  //     }
  //     addEnemyThree(enemyThreeCurrentPosition)
  //   }, outOfBoxSpeed)
  // }


  // //* ENEMY FOUR
  // function fourLocateCharacter() {
  //   const whilstFourOutsideBox = setInterval(() => {
  //     removeEnemyFour(enemyFourCurrentPosition)
  //     const route = Math.floor(Math.random() * 4)
  //     if (greaterThan(enemyFourCurrentPosition) && greaterThanRow(enemyFourCurrentPosition)) {
  //       if (vacantBottomRight(enemyFourCurrentPosition)) {
  //         if (route < 2) {
  //           enemyFourCurrentPosition += width
  //         } else {
  //           enemyFourCurrentPosition++
  //         }
  //       } else if (vacantBottom(enemyFourCurrentPosition)) {
  //         enemyFourCurrentPosition += width
  //       } else if (vacantRight(enemyFourCurrentPosition)) {
  //         enemyFourCurrentPosition++
  //       }
  //     } else if (greaterThan(enemyFourCurrentPosition) && !greaterThanRow(enemyFourCurrentPosition)) {
  //       if (vacantBottomLeft(enemyFourCurrentPosition)) {
  //         if (route < 2) {
  //           enemyFourCurrentPosition += width
  //         } else {
  //           enemyFourCurrentPosition--
  //         }
  //       } else if (vacantBottom(enemyFourCurrentPosition)) {
  //         enemyFourCurrentPosition += width
  //       } else if (vacantLeft(enemyFourCurrentPosition)) {
  //         enemyFourCurrentPosition--
  //       } else if (vacantRight(enemyFourCurrentPosition)) {
  //         enemyFourCurrentPosition == width
  //       }
  //     } else if (!greaterThan(enemyFourCurrentPosition) && greaterThanRow(enemyFourCurrentPosition)) {
  //       if (vacantTopRight(enemyFourCurrentPosition)) {
  //         if (route < 2) {
  //           enemyFourCurrentPosition -= width
  //         } else {
  //           enemyFourCurrentPosition++
  //         }
  //       } else if (vacantTop(enemyFourCurrentPosition)) {
  //         enemyFourCurrentPosition -= width
  //       } else if (vacantRight(enemyFourCurrentPosition)) {
  //         enemyFourCurrentPosition++
  //       }
  //     } else if (!greaterThan(enemyFourCurrentPosition) && !greaterThanRow(enemyFourCurrentPosition)) {
  //       if (vacantTopLeft(enemyFourCurrentPosition)) {
  //         if (route < 2) {
  //           enemyFourCurrentPosition -= width
  //         } else {
  //           enemyFourCurrentPosition--
  //         }
  //       } else if (vacantTop(enemyFourCurrentPosition)) {
  //         enemyFourCurrentPosition -= width
  //       } else if (vacantLeft(enemyFourCurrentPosition)) {
  //         enemyFourCurrentPosition--
  //       }
  //     } else if (greaterThan(enemyFourCurrentPosition) && rowEqual(enemyFourCurrentPosition)) {
  //       if (vacantBottom(enemyFourCurrentPosition)) {
  //         enemyFourCurrentPosition += width
  //       } else if (vacantLeftRight) {
  //         if (route < 2) {
  //           enemyFourCurrentPosition--
  //         } else {
  //           enemyFourCurrentPosition++
  //         }
  //       }
  //     } else if (!greaterThan(enemyFourCurrentPosition) && rowEqual(enemyFourCurrentPosition)) {
  //       if (vacantBottomTop(enemyFourCurrentPosition)) {
  //         enemyFourCurrentPosition += width
  //       } else if (vacantLeftRight) {
  //         if (route < 2) {
  //           enemyFourCurrentPosition--
  //         } else {
  //           enemyFourCurrentPosition++
  //         }
  //       }
  //     }
  //     addEnemyFour(enemyFourCurrentPosition)
  //   }, outOfBoxSpeed)
  // }






  //*END GAME LOGIC - CHECK FOR DEATH


  function resetBoard() {
    removeCharacter(characterCurrentPosition)
    removeEnemyOne(enemyOneCurrentPosition)
    removeEnemyTwo(enemyTwoCurrentPosition)
    removeEnemyThree(enemyThreeCurrentPosition)
    removeEnemyFour(enemyFourCurrentPosition)
    characterCurrentPosition = 657
    enemyOneCurrentPosition = 376
    enemyTwoCurrentPosition = 377
    enemyThreeCurrentPosition = 378
    enemyFourCurrentPosition = 379
  }


  function clearDisplay() {
    bonusInformation.style.display = 'none'
    lives.style.display = 'none'
    topContainer.classList.toggle('game-over-top-container-transition')
    gridWrapper.classList.toggle('game-over-grid-wrapper-transition')
    setTimeout(() => {
      gridWrapper.classList.toggle('game-over-grid-wrapper-display')
    }, 4600)
  }


  function newHighNewColor() {
    let r = Math.floor(Math.random() * 255 + 1)
    let g = Math.floor(Math.random() * 255 + 1)
    let b = Math.floor(Math.random() * 255 + 1)
    let randomColor = `rgb(${r},${g},${b})`
    newHighscore.style.color = randomColor
    nextRound.style.color = randomColor
  }


  function inCaseOfDeath() {
    if (cells[characterCurrentPosition].classList.contains(enemyOneClass) || cells[characterCurrentPosition].classList.contains(enemyTwoClass) || cells[characterCurrentPosition].classList.contains(enemyThreeClass) || cells[characterCurrentPosition].classList.contains(enemyFourClass)) {
      characterLives > 1 || characterLives < 0 ? enemyHitAudio.play() : gameOverAudio.play()
      resetBoard()
      characterLives -= 1
      if (characterLives === 2) {
        heart3.style.display = 'none'
      }
      if (characterLives === 1) {
        heart2.style.display = 'none'
      }

      if (characterLives < 1) {
        clearDisplay()
        setTimeout(() => {
          playAgain.style.display = 'block'
          createdBy.style.display = 'block'
        }, 4600)
        localStorage.setItem('highest-score', high)
        if (score > localStorage.getItem('highest-score')) {
          high = score
          setTimeout(() => {
            newHighscore.style.display = 'block'
          }, 4600)
        }
        enemyHitAudio.pause()

      }



    }
  }















  //*END GAME LOGIC - COUNTS IF ANY DIVS CONTAIN ENERGIZER OR SURFACE CLASS
  function checkForWin() {
    const leftEnergizer = cells.filter(cell => cell.classList.contains('energizer'))
    const leftSurface = cells.filter(cell => cell.classList.contains('surface'))
    if (!leftEnergizer.length && !leftSurface.length) {
      gameWonAudio.play()
      clearDisplay()
      window.removeEventListener('keydown', checkForWin)
      setTimeout(() => {
        nextRound.style.display = 'block'
      }, 4600)


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


  function reload() {
    location.reload()
  }





  //*EVENT LISTNERS
  document.addEventListener('keydown', characterMove)

  document.addEventListener('keydown', coin)
  document.addEventListener('keyup', coin)
  document.addEventListener('keydown', energize)
  document.addEventListener('keyup', energize)
  document.addEventListener('keydown', bonusPoints)
  document.addEventListener('keyup', bonusPoints)



  // window.addEventListener('load', enemyOneBoxOut)
  window.addEventListener('load', locateEnemy)
  // window.addEventListener('load', enemyTwoBoxOut)
  // window.addEventListener('load', enemyThreeBoxOut)
  // window.addEventListener('load', enemyFourBoxOut)

  window.addEventListener('load', inCaseOfDeath)
  window.addEventListener('keydown', inCaseOfDeath)
  window.addEventListener('keyup', inCaseOfDeath)
  window.addEventListener('mousemove', newHighNewColor)
  window.addEventListener('keydown', checkForWin)

  playAgain.addEventListener('click', reload)
  nextRound.addEventListener('click', () => {
    console.log('click')
    bonusInformation.style.display = 'block'
    lives.style.display = 'block'
    topContainer.classList.toggle('game-over-top-container-transition')
    gridWrapper.classList.toggle('game-over-grid-wrapper-display')
    gridWrapper.classList.toggle('game-over-grid-wrapper-transition')
    addEnergize()
    addSurface()
    resetBoard()
    outOfBoxSpeed -= 200
  })
  audioButton.addEventListener('click', togglePlay)
  window.addEventListener('keydown', playMusic)





































































  //*BACKGROUND FUNCTIONALITY
  //*BOARD FLOOR - SURFACE CLASS

  function addSurface() {

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
  }

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


  function innerEnemyWallRow(numStart, numEnd) {
    for (let i = numStart; i <= numEnd; i++) {
      cells[i].classList.add('wall')
      cells[i].classList.add('inner-enemy-wall')
    }
  }
  innerEnemyWallRow(404, 407)

  function innerEnemyWall(num) {
    cells[num].classList.add('wall')
    cells[num].classList.add('inner-enemy-wall')
  }
  innerEnemyWall(375)
  innerEnemyWall(380)



  function enemyGateRow(numStart, numEnd) {
    for (let i = numStart; i <= numEnd; i++) {
      cells[i].classList.add('wall')
      cells[i].classList.add('enemy-gate')
    }
  }
  enemyGateRow(349, 350)


  //*DOTS & ENERGIZER

  function addEnergize() {

    function energizerGrid(num) {
      cells[num].classList.add('surface')
      cells[num].classList.add('energizer')
    }

    energizerGrid(645)
    energizerGrid(670)
    energizerGrid(85)
    energizerGrid(110)
  }
}
window.addEventListener('DOMContentLoaded', init)