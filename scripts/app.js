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

  playAgain.style.display = 'none'
  createdBy.style.display = 'none'
  newHighscore.style.display = 'none'

  //*IN GAME LIFE ELEMENTS
  const bonusInformation = document.querySelector('#bonus-information')
  const lives = document.querySelector('.lives')
  const heart1 = document.querySelector('#heart1')
  const heart2 = document.querySelector('#heart2')
  const heart3 = document.querySelector('#heart3')




  //*AUDIO FUNCTIONALITY
  const audioButton = document.querySelector('.sound')
  const mainAudio = new Audio('audio/background.mp3')
  const collectEnergizer = new Audio('audio/energize.wav')
  const collectBonus = new Audio('audio/bonus.wav')
  const enemyHit = new Audio('audio/enemy-hit.wav')
  const gameOverAudio = new Audio('audio/game-over.wav')


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



  //*CREATE GRID NEEDS TO BE CALLED FOLLOWING CHARACTER INITIALISING (VARIABLES CAN'T BE HOISTED)
  createGrid(characterStartPosition, enemyOneStartPosition, enemyTwoStartPosition, enemyThreeStartPosition, enemyFourStartPosition)



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
      collectEnergizer.play()
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
    const bonusArray = ['piggy-bank', 'isa', 'bonds', 'property']
    let randomChoice = bonusArray[Math.floor(Math.random() * 4)]
    if (cells[461].classList.length <= 1) {
      cells[461].classList.add(randomChoice)
    }
  }
  setInterval(bonusItem, 1000)


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
      bonusInformation.innerText = piggyBankFacts[choice]

    } else if (characterCurrentPosition === 461 && cells[461].classList.contains('isa')) {
      cells[461].classList.remove('isa')
      removeBonus('isa')
      const isaFacts = ['Interest earned on all Cash ISA Savings are 100% tax free.', 'You need to be at least 16 years old to have an ISA.', 'Since ISAs were  launched in 1999 an estimated £8.74 trillion has been saved.']
      bonusInformation.innerText = isaFacts[choice]

    } else if (characterCurrentPosition === 461 && cells[461].classList.contains('bonds')) {
      cells[461].classList.remove('bonds')
      removeBonus('bonds')
      const bondsFacts = ['Bonds are issued by governments and corporations when they want to raise money.', 'Bonds move in the opposite direction to interest rates.', 'Bonds tend to be relatively safe but of course still come with risk.']
      bonusInformation.innerText = bondsFacts[choice]
    } else if (characterCurrentPosition === 461 && cells[461].classList.contains('property')) {
      removeBonus('property')
      cells[461].classList.remove('property')
      const propertyFacts = ['London\'s average house price is £476,800. More than double the national average.', 'Liverpool has the cheapest average price for a UK city, with prices averaging £122,300.', 'Lloyds Banking Group and Nationwide Building Society retained their crowns and the first and second biggest BTL mortgage lenders in the UK.']
      bonusInformation.innerText = propertyFacts[choice]
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


  //* LOGIC TO GET OUT OF INNER BOX
  const enemyWallsTopBottomRight = enemyCurrentPosition => cells[enemyCurrentPosition - width].classList.contains('enemy-wall') && cells[enemyCurrentPosition + width].classList.contains('enemy-wall') && cells[enemyCurrentPosition + 1].classList.contains('enemy-wall')
  const enemyWallsTopBottomLeft = enemyCurrentPosition => cells[enemyCurrentPosition - width].classList.contains('enemy-wall') && cells[enemyCurrentPosition + width].classList.contains('enemy-wall') && cells[enemyCurrentPosition - 1].classList.contains('enemy-wall')
  const enemyWallsBottom = enemyCurrentPosition => cells[enemyCurrentPosition + width].classList.contains('enemy-wall')
  const enemyWallsGateCurrent = enemyCurrentPosition => cells[enemyCurrentPosition].classList.contains('enemy-gate')
  const enemyWallsGateBottom = enemyCurrentPosition => cells[enemyCurrentPosition + width].classList.contains('enemy-gate')
  const enemyWallsLeft = enemyCurrentPosition => cells[enemyCurrentPosition--].classList.contains('enemy-gate')
  const enemyWallsRight = enemyCurrentPosition => cells[enemyCurrentPosition++].classList.contains('enemy-gate')

  //*LOGIC TO LOCATE MAIN CHARACTER
  const greaterThan = enemyCurrentPosition => characterCurrentPosition > enemyCurrentPosition
  const greaterThanRow = enemyCurrentPosition => (characterCurrentPosition % width) > (enemyCurrentPosition % width)
  const rowEqual = enemyCurrentPosition => (characterCurrentPosition % width) === (enemyCurrentPosition % width)
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


  //*MOVE ENEMY OUT OF BOX
  //*ENEMY ONE
  function enemyOneBoxOut() {
    const whilstOneInBox = setInterval(() => {
      if (enemyWallsGateBottom(enemyOneCurrentPosition)) {
        oneLocateCharacter()
        clearInterval(whilstOneInBox)
      }
      removeEnemyOne(enemyOneCurrentPosition)
      if (enemyWallsTopBottomLeft(enemyOneCurrentPosition)) {
        enemyOneCurrentPosition += 1
      }
      else if (enemyWallsTopBottomRight(enemyOneCurrentPosition)) {
        enemyOneCurrentPosition -= 1
      }
      else if (enemyWallsBottom(enemyOneCurrentPosition)) {

        enemyOneCurrentPosition -= width
      }
      else if (enemyWallsGateCurrent(enemyOneCurrentPosition)) {
        enemyOneCurrentPosition -= width
      }
      addEnemyOne(enemyOneCurrentPosition)
    }, 1000)
  }

  //*ENEMY TWO
  function enemyTwoBoxOut() {
    const whilstTwoInBox = setInterval(() => {
      if (enemyTwoCurrentPosition === 317) {
        twoLocateCharacter()
        clearInterval(whilstTwoInBox)
      }
      removeEnemyTwo(enemyTwoCurrentPosition)
      if (enemyTwoCurrentPosition === 377) {
        enemyTwoCurrentPosition -= width
      }
      else if (enemyWallsLeft(enemyTwoCurrentPosition)) {
        enemyTwoCurrentPosition -= width
      }
      else if (vacantLeft(enemyTwoCurrentPosition)) {
        enemyTwoCurrentPosition--
      }
      addEnemyTwo(enemyTwoCurrentPosition)
    }, 1000)
  }


  //*ENEMY THREE
  function enemyThreeBoxOut() {
    const whilstThreeInBox = setInterval(() => {
      if (enemyThreeCurrentPosition === 326) {
        threeLocateCharacter()
        clearInterval(whilstThreeInBox)
      }
      removeEnemyThree(enemyThreeCurrentPosition)
      if (enemyThreeCurrentPosition === 378) {
        enemyThreeCurrentPosition -= width
      }
      else if (enemyWallsRight(enemyThreeCurrentPosition)) {
        enemyThreeCurrentPosition -= width
      }
      else if (vacantRight(enemyThreeCurrentPosition)) {
        enemyThreeCurrentPosition++
      }
      addEnemyThree(enemyThreeCurrentPosition)
    }, 1000)
  }


  //*ENEMY FOUR
  function enemyFourBoxOut() {
    const whilstFourInBox = setInterval(() => {
      if (enemyFourCurrentPosition === 295) {
        fourLocateCharacter()
        clearInterval(whilstFourInBox)
      }
      removeEnemyFour(enemyFourCurrentPosition)
      if (enemyFourCurrentPosition === 379) {
        enemyFourCurrentPosition--
      } else if (enemyFourCurrentPosition === 378) {
        enemyFourCurrentPosition--
      } else if (enemyFourCurrentPosition === 377) {
        enemyFourCurrentPosition -= width
      } else if (enemyFourCurrentPosition === 349) {
        enemyFourCurrentPosition++
      } else if (enemyFourCurrentPosition === 350) {
        enemyFourCurrentPosition -= width
      } else if (enemyFourCurrentPosition === 349) {
        enemyFourCurrentPosition++
      } else if (enemyFourCurrentPosition === 350) {
        enemyFourCurrentPosition -= width
      } else if (enemyFourCurrentPosition === 322) {
        enemyFourCurrentPosition++
      } else if (enemyFourCurrentPosition === 323) {
        enemyFourCurrentPosition -= width
      }
      addEnemyFour(enemyFourCurrentPosition)
    }, 1000)
  }


  //*LOCATE MAIN CHARACTER
  //* ENEMY ONE
  function oneLocateCharacter() {
    const whilstOneOutsideBox = setInterval(() => {
      removeEnemyOne(enemyOneCurrentPosition)
      if (cells[characterCurrentPosition].classList.contains(enemyOneClass)) {
        removeEnemyOne(enemyOneCurrentPosition)
      }
      const route = Math.floor(Math.random() * 4)
      if (greaterThan(enemyOneCurrentPosition) && greaterThanRow(enemyOneCurrentPosition)) {
        if (vacantBottomRight(enemyOneCurrentPosition)) {
          if (route < 2) {
            enemyOneCurrentPosition += width
          } else {
            enemyOneCurrentPosition++
          }
        } else if (vacantBottom(enemyOneCurrentPosition)) {
          enemyOneCurrentPosition += width
        } else if (vacantRight(enemyOneCurrentPosition)) {
          enemyOneCurrentPosition++
        }
      } else if (greaterThan(enemyOneCurrentPosition) && !greaterThanRow(enemyOneCurrentPosition)) {
        if (vacantBottomLeft(enemyOneCurrentPosition)) {
          if (route < 2) {
            enemyOneCurrentPosition += width
          } else {
            enemyOneCurrentPosition--
          }
        } else if (vacantBottom(enemyOneCurrentPosition)) {
          enemyOneCurrentPosition += width
        } else if (vacantLeft(enemyOneCurrentPosition)) {
          enemyOneCurrentPosition--
        } else if (vacantRight(enemyOneCurrentPosition)) {
          enemyOneCurrentPosition == width
        }
      } else if (!greaterThan(enemyOneCurrentPosition) && greaterThanRow(enemyOneCurrentPosition)) {
        if (vacantTopRight(enemyOneCurrentPosition)) {
          if (route < 2) {
            enemyOneCurrentPosition -= width
          } else {
            enemyOneCurrentPosition++
          }
        } else if (vacantTop(enemyOneCurrentPosition)) {
          enemyOneCurrentPosition -= width
        } else if (vacantRight(enemyOneCurrentPosition)) {
          enemyOneCurrentPosition++
        }
      } else if (!greaterThan(enemyOneCurrentPosition) && !greaterThanRow(enemyOneCurrentPosition)) {
        if (vacantTopLeft(enemyOneCurrentPosition)) {
          if (route < 2) {
            enemyOneCurrentPosition -= width
          } else {
            enemyOneCurrentPosition--
          }
        } else if (vacantTop(enemyOneCurrentPosition)) {
          enemyOneCurrentPosition -= width
        } else if (vacantLeft(enemyOneCurrentPosition)) {
          enemyOneCurrentPosition--
        }
      } else if (greaterThan(enemyOneCurrentPosition) && rowEqual(enemyOneCurrentPosition)) {
        if (vacantBottom(enemyOneCurrentPosition)) {
          enemyOneCurrentPosition += width
        } else if (vacantLeftRight) {
          if (route < 2) {
            enemyOneCurrentPosition--
          } else {
            enemyOneCurrentPosition++
          }
        }
      } else if (!greaterThan(enemyOneCurrentPosition) && rowEqual(enemyOneCurrentPosition)) {
        if (vacantBottomTop(enemyOneCurrentPosition)) {
          enemyOneCurrentPosition += width
        } else if (vacantLeftRight) {
          if (route < 2) {
            enemyOneCurrentPosition--
          } else {
            enemyOneCurrentPosition++
          }
        }
      }
      addEnemyOne(enemyOneCurrentPosition)
    }, 1000)
  }


  //* ENEMY TWO
  function twoLocateCharacter() {
    const whilstTwoOutsideBox = setInterval(() => {
      removeEnemyTwo(enemyTwoCurrentPosition)
      const route = Math.floor(Math.random() * 4)
      if (greaterThan(enemyTwoCurrentPosition) && greaterThanRow(enemyTwoCurrentPosition)) {
        if (vacantBottomRight(enemyTwoCurrentPosition)) {
          if (route < 2) {
            enemyTwoCurrentPosition += width
          } else {
            enemyTwoCurrentPosition++
          }
        } else if (vacantBottom(enemyTwoCurrentPosition)) {
          enemyTwoCurrentPosition += width
        } else if (vacantRight(enemyTwoCurrentPosition)) {
          enemyTwoCurrentPosition++
        }
      } else if (greaterThan(enemyTwoCurrentPosition) && !greaterThanRow(enemyTwoCurrentPosition)) {
        if (vacantBottomLeft(enemyTwoCurrentPosition)) {
          if (route < 2) {
            enemyTwoCurrentPosition += width
          } else {
            enemyTwoCurrentPosition--
          }
        } else if (vacantBottom(enemyTwoCurrentPosition)) {
          enemyTwoCurrentPosition += width
        } else if (vacantLeft(enemyTwoCurrentPosition)) {
          enemyTwoCurrentPosition--
        } else if (vacantRight(enemyTwoCurrentPosition)) {
          enemyTwoCurrentPosition == width
        }
      } else if (!greaterThan(enemyTwoCurrentPosition) && greaterThanRow(enemyTwoCurrentPosition)) {
        if (vacantTopRight(enemyTwoCurrentPosition)) {
          if (route < 2) {
            enemyTwoCurrentPosition -= width
          } else {
            enemyTwoCurrentPosition++
          }
        } else if (vacantTop(enemyTwoCurrentPosition)) {
          enemyTwoCurrentPosition -= width
        } else if (vacantRight(enemyTwoCurrentPosition)) {
          enemyTwoCurrentPosition++
        }
      } else if (!greaterThan(enemyTwoCurrentPosition) && !greaterThanRow(enemyTwoCurrentPosition)) {
        if (vacantTopLeft(enemyTwoCurrentPosition)) {
          if (route < 2) {
            enemyTwoCurrentPosition -= width
          } else {
            enemyTwoCurrentPosition--
          }
        } else if (vacantTop(enemyTwoCurrentPosition)) {
          enemyTwoCurrentPosition -= width
        } else if (vacantLeft(enemyTwoCurrentPosition)) {
          enemyTwoCurrentPosition--
        }
      } else if (greaterThan(enemyTwoCurrentPosition) && rowEqual(enemyTwoCurrentPosition)) {
        if (vacantBottom(enemyTwoCurrentPosition)) {
          enemyTwoCurrentPosition += width
        } else if (vacantLeftRight) {
          if (route < 2) {
            enemyTwoCurrentPosition--
          } else {
            enemyTwoCurrentPosition++
          }
        }
      } else if (!greaterThan(enemyTwoCurrentPosition) && rowEqual(enemyTwoCurrentPosition)) {
        if (vacantBottomTop(enemyTwoCurrentPosition)) {
          enemyTwoCurrentPosition += width
        } else if (vacantLeftRight) {
          if (route < 2) {
            enemyTwoCurrentPosition--
          } else {
            enemyTwoCurrentPosition++
          }
        }
      }
      addEnemyTwo(enemyTwoCurrentPosition)
    }, 1000)
  }



  //* ENEMY THREE
  function threeLocateCharacter() {
    const whilstThreeOutsideBox = setInterval(() => {
      removeEnemyThree(enemyThreeCurrentPosition)
      const route = Math.floor(Math.random() * 4)
      if (greaterThan(enemyThreeCurrentPosition) && greaterThanRow(enemyThreeCurrentPosition)) {
        if (vacantBottomRight(enemyThreeCurrentPosition)) {
          if (route < 2) {
            enemyThreeCurrentPosition += width
          } else {
            enemyThreeCurrentPosition++
          }
        } else if (vacantBottom(enemyThreeCurrentPosition)) {
          enemyThreeCurrentPosition += width
        } else if (vacantRight(enemyThreeCurrentPosition)) {
          enemyThreeCurrentPosition++
        }
      } else if (greaterThan(enemyThreeCurrentPosition) && !greaterThanRow(enemyThreeCurrentPosition)) {
        if (vacantBottomLeft(enemyThreeCurrentPosition)) {
          if (route < 2) {
            enemyThreeCurrentPosition += width
          } else {
            enemyThreeCurrentPosition--
          }
        } else if (vacantBottom(enemyThreeCurrentPosition)) {
          enemyThreeCurrentPosition += width
        } else if (vacantLeft(enemyThreeCurrentPosition)) {
          enemyThreeCurrentPosition--
        } else if (vacantRight(enemyThreeCurrentPosition)) {
          enemyThreeCurrentPosition == width
        }
      } else if (!greaterThan(enemyThreeCurrentPosition) && greaterThanRow(enemyThreeCurrentPosition)) {
        if (vacantTopRight(enemyThreeCurrentPosition)) {
          if (route < 2) {
            enemyThreeCurrentPosition -= width
          } else {
            enemyThreeCurrentPosition++
          }
        } else if (vacantTop(enemyThreeCurrentPosition)) {
          enemyThreeCurrentPosition -= width
        } else if (vacantRight(enemyThreeCurrentPosition)) {
          enemyThreeCurrentPosition++
        }
      } else if (!greaterThan(enemyThreeCurrentPosition) && !greaterThanRow(enemyThreeCurrentPosition)) {
        if (vacantTopLeft(enemyThreeCurrentPosition)) {
          if (route < 2) {
            enemyThreeCurrentPosition -= width
          } else {
            enemyThreeCurrentPosition--
          }
        } else if (vacantTop(enemyThreeCurrentPosition)) {
          enemyThreeCurrentPosition -= width
        } else if (vacantLeft(enemyThreeCurrentPosition)) {
          enemyThreeCurrentPosition--
        }
      } else if (greaterThan(enemyThreeCurrentPosition) && rowEqual(enemyThreeCurrentPosition)) {
        if (vacantBottom(enemyThreeCurrentPosition)) {
          enemyThreeCurrentPosition += width
        } else if (vacantLeftRight) {
          if (route < 2) {
            enemyThreeCurrentPosition--
          } else {
            enemyThreeCurrentPosition++
          }
        }
      } else if (!greaterThan(enemyThreeCurrentPosition) && rowEqual(enemyThreeCurrentPosition)) {
        if (vacantBottomTop(enemyThreeCurrentPosition)) {
          enemyThreeCurrentPosition += width
        } else if (vacantLeftRight) {
          if (route < 2) {
            enemyThreeCurrentPosition--
          } else {
            enemyThreeCurrentPosition++
          }
        }
      }
      addEnemyThree(enemyThreeCurrentPosition)
    }, 1000)
  }


  //* ENEMY FOUR
  function fourLocateCharacter() {
    const whilstFourOutsideBox = setInterval(() => {
      removeEnemyFour(enemyFourCurrentPosition)
      const route = Math.floor(Math.random() * 4)
      if (greaterThan(enemyFourCurrentPosition) && greaterThanRow(enemyFourCurrentPosition)) {
        if (vacantBottomRight(enemyFourCurrentPosition)) {
          if (route < 2) {
            enemyFourCurrentPosition += width
          } else {
            enemyFourCurrentPosition++
          }
        } else if (vacantBottom(enemyFourCurrentPosition)) {
          enemyFourCurrentPosition += width
        } else if (vacantRight(enemyFourCurrentPosition)) {
          enemyFourCurrentPosition++
        }
      } else if (greaterThan(enemyFourCurrentPosition) && !greaterThanRow(enemyFourCurrentPosition)) {
        if (vacantBottomLeft(enemyFourCurrentPosition)) {
          if (route < 2) {
            enemyFourCurrentPosition += width
          } else {
            enemyFourCurrentPosition--
          }
        } else if (vacantBottom(enemyFourCurrentPosition)) {
          enemyFourCurrentPosition += width
        } else if (vacantLeft(enemyFourCurrentPosition)) {
          enemyFourCurrentPosition--
        } else if (vacantRight(enemyFourCurrentPosition)) {
          enemyFourCurrentPosition == width
        }
      } else if (!greaterThan(enemyFourCurrentPosition) && greaterThanRow(enemyFourCurrentPosition)) {
        if (vacantTopRight(enemyFourCurrentPosition)) {
          if (route < 2) {
            enemyFourCurrentPosition -= width
          } else {
            enemyFourCurrentPosition++
          }
        } else if (vacantTop(enemyFourCurrentPosition)) {
          enemyFourCurrentPosition -= width
        } else if (vacantRight(enemyFourCurrentPosition)) {
          enemyFourCurrentPosition++
        }
      } else if (!greaterThan(enemyFourCurrentPosition) && !greaterThanRow(enemyFourCurrentPosition)) {
        if (vacantTopLeft(enemyFourCurrentPosition)) {
          if (route < 2) {
            enemyFourCurrentPosition -= width
          } else {
            enemyFourCurrentPosition--
          }
        } else if (vacantTop(enemyFourCurrentPosition)) {
          enemyFourCurrentPosition -= width
        } else if (vacantLeft(enemyFourCurrentPosition)) {
          enemyFourCurrentPosition--
        }
      } else if (greaterThan(enemyFourCurrentPosition) && rowEqual(enemyFourCurrentPosition)) {
        if (vacantBottom(enemyFourCurrentPosition)) {
          enemyFourCurrentPosition += width
        } else if (vacantLeftRight) {
          if (route < 2) {
            enemyFourCurrentPosition--
          } else {
            enemyFourCurrentPosition++
          }
        }
      } else if (!greaterThan(enemyFourCurrentPosition) && rowEqual(enemyFourCurrentPosition)) {
        if (vacantBottomTop(enemyFourCurrentPosition)) {
          enemyFourCurrentPosition += width
        } else if (vacantLeftRight) {
          if (route < 2) {
            enemyFourCurrentPosition--
          } else {
            enemyFourCurrentPosition++
          }
        }
      }
      addEnemyFour(enemyFourCurrentPosition)
    }, 1000)
  }






  //*END GAME LOGIC - CHECK FOR DEATH


  function resetBoard() {
    removeCharacter(characterCurrentPosition)
    removeEnemyOne(enemyOneCurrentPosition)
    removeEnemyTwo(enemyTwoCurrentPosition)
    removeEnemyThree(enemyThreeCurrentPosition)
    removeEnemyFour(enemyFourCurrentPosition)
    addCharacter(characterStartPosition)
    addEnemyOne(enemyOneStartPosition)
    addEnemyTwo(enemyTwoStartPosition)
    addEnemyThree(enemyThreeStartPosition)
    addEnemyFour(enemyFourStartPosition)
  }

  function reduceLife() {
    characterLives--
    if (characterLives === 3) {
      lives.removeChild(heart1)
    } else if (characterLives === 2) {
      lives.removeChild(heart2)
    } else if (characterLives < 1) {
      lives.removeChild(heart3)
    }
  }

  function clearDisplay() {
    bonusInformation.style.display = 'none'
    lives.style.display = 'none'
    topContainer.classList.toggle('game-over-top-container-transition')
    gridWrapper.classList.toggle('game-over-grid-wrapper-transition')
    setTimeout(() => {
      gridWrapper.classList.toggle('game-over-grid-wrapper-display')
      playAgain.style.display = 'block'
      createdBy.style.display = 'block'
    }, 4600)
  }

function newHighNewColor() {
  let r = Math.floor(Math.random()*255+1)
  let g = Math.floor(Math.random()*255+1)
  let b = Math.floor(Math.random()*255+1)
  let randomColor = `rgb(${r},${g},${b})`
  newHighscore.style.color = randomColor
}




  function inCaseOfDeath() {
    if (cells[characterCurrentPosition].classList.contains(enemyOneClass)) {
      enemyHit.play()
      resetBoard()
      reduceLife()
      if (characterLives < 1) {
        gameOverAudio.play()
        clearDisplay()

        localStorage.setItem('highest-score', high)

        if (score > localStorage.getItem('highest-score')) {
          high = score
          setTimeout(() => {
            newHighscore.style.display = 'block'
          }, 4600)
        }
      }
    }
  }















  //*END GAME LOGIC - COUNTS IF ANY DIVS CONTAIN ENERGIZER OR SURFACE CLASS
  function checkForWin() {
    const leftEnergizer = cells.filter(cell => cell.classList.contains('energizer'))
    if (!leftEnergizer.length) {
      const leftSurface = cells.filter(cell => cell.classList.contains('surface'))
      if (!leftSurface.length) {
        bonusInformation.innerText = ''
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



  window.addEventListener('load', enemyOneBoxOut)
  window.addEventListener('load', enemyTwoBoxOut)
  window.addEventListener('load', enemyThreeBoxOut)
  window.addEventListener('load', enemyFourBoxOut)

  window.addEventListener('load', inCaseOfDeath)
  window.addEventListener('keydown', inCaseOfDeath)
  window.addEventListener('keyup', inCaseOfDeath)
  window.addEventListener('mousemove', newHighNewColor)
  window.addEventListener('keydown', checkForWin)

  playAgain.addEventListener('click', reload)
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
      cells[i].classList.add('wall')
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