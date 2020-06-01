
const gameTable = document.querySelector('.game-table');
const startBtn = document.querySelector('.start-btn');
const restartBtn = document.querySelector('.restart-btn');

let arr = [];

const pushArray = (ar) => {
  for(let i = 1; i<=25;i++) {
    ar.push(i);
  }
  return ar
};

function createBoxAndSort(array) {
  array.sort(() => Math.random() - 0.5);

  array.forEach((num) => {
    let box = `
      <div class="game-table__box">
        ${createUnicBoxItem(num)}
      </div>
    `;
    let table = document.querySelector('.game-table');

    return  table.insertAdjacentHTML('afterbegin', box)
  })
}
const clearTableAndArr = () => {
  arr=[];
  gameTable.innerHTML = ''
};

function createUnicBoxItem(elem) {
  let randomColor = `color: rgb(${getRandomArbitrary(0,255)},${getRandomArbitrary(0,255)},${getRandomArbitrary(0,255)})`;
  let randomFontSize = `font-size: ${getRandomArbitrary(10,30)}px`;
  return `
    <span style="${randomColor}; ${randomFontSize}">${elem}</span>
  `;
}
function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}



startBtn.addEventListener('click', function (e) {
  const target = e.target;
  this.classList.add('hide');
  const restartButton = document.querySelector('.restart-btn');
  restartButton.classList.add('show');

  timerFunc();
  createBoxAndSort(pushArray(arr));
  gameTable.addEventListener('click', checkBoxes);
  target.nextElementSibling.classList.add('show');

});

const forTimer = (num) => {
  let count = +num;
  let elem = document.querySelector('.timer');

  return function () {
    elem.innerHTML = `remaining time: <span class="cl">${+count--}</span>`;
    if(count <= -1 ) {
      elem.classList.add('loose');
      elem.innerHTML = 'You loose';
      clearInterval(window.timerId);
      gameTable.removeEventListener('click', checkBoxes);
    }
    const tableBox = document.querySelectorAll('.game-table__box');
    let el = [].slice.apply(tableBox);
    let newArr = el.filter(el => {
      return el.classList.contains('checked')
    });
    if(count >= -1 && newArr.length === 25) {
      elem.classList.add('win');
      elem.innerHTML = 'You Win'
    }
  }
};

const checkBoxes = (e) => {
  const target = e.target;
  let boxNumber = +target.closest('.game-table__box').children[0].innerHTML;
  let min = +Math.min.apply(null,arr);

  arr.forEach((num, idx, arr) => {
    if(boxNumber === min ) {
      target.closest('.game-table__box').classList.add('checked');
      if (num === min) {
        let index = arr.findIndex((el) => el === min);
        arr.splice(index,1);
      }
    }
  });
};

let timerFifty = forTimer(50);

const timerFunc = () => {
  window.timerId = setInterval(timerFifty, 1000)
};

const restartFunc = () => {
  let elem = document.querySelector('.timer');
  elem.classList = 'timer';
  clearInterval(window.timerId);
  timerFifty = forTimer(50);
  timerFunc();
  clearTableAndArr();
  createBoxAndSort(pushArray(arr));
  gameTable.addEventListener('click', checkBoxes);
};

restartBtn.addEventListener('click', restartFunc);
