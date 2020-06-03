
const gameTable = document.querySelector('.game-table');
const startBtn = document.querySelector('.start-btn');
const restartBtn = document.querySelector('.restart-btn');
const toggleModeBtn = document.querySelector('.toggle-mode');
let arr = [];

let mode = {
  easy: true,
  middle: null,
  hard: null
};

const pushArray = (ar) => {
  for(let i = 1; i<=25;i++) {
    ar.push(i);
  }
  return ar
};

const createBoxAndSort = (array) => {
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
};

const clearTableAndArr = () => {
  arr=[];
  gameTable.innerHTML = ''
};

const createUnicBoxItem = (elem) => {
  let randomColor = `color: rgb(${getRandomArbitrary(0,255)},${getRandomArbitrary(0,255)},${getRandomArbitrary(0,255)})`;
  let randomFontSize = `font-size: ${getRandomArbitrary(10,30)}px`;
  return `
    <span style="${randomColor}; ${randomFontSize}">${elem}</span>
  `;
};

const getRandomArbitrary = (min, max)  =>{
  return Math.floor(Math.random() * (max - min) + min);
};

const startFunc = (e) => {
  const target = e.target;
  if (mode.hard) {
    clearInterval(window.sortBoxesIntervalId);
  }
  target.classList.add('hide');
  const restartButton = document.querySelector('.restart-btn');
  document.querySelector('.toggle-mode').classList.add('show');
  restartButton.classList.add('show');

  timerFunc();
  createBoxAndSort(pushArray(arr));
  gameTable.addEventListener('click', checkBoxes);
  target.nextElementSibling.classList.add('show');
  if (mode.hard) {
    window.sortBoxesIntervalId = setInterval(sortBoxes, 2000);
  }
};

const forTimer = (num) => {
  let count = +num;
  const elem = document.querySelector('.timer');

  return function () {
    elem.innerHTML = `remaining time: <span class="cl">${+count--}</span>`;
    if(count <= -1 ) {
      elem.classList.add('lose');
      elem.innerHTML = 'You lose';
      clearInterval(window.timerId);
      clearInterval(window.sortBoxesIntervalId);
      gameTable.removeEventListener('click', checkBoxes);
    }
    const tableBox = document.querySelectorAll('.game-table__box');
    let el = [].slice.apply(tableBox);
    let newArr = el.filter(el => {
      return el.classList.contains('checked')
    });
    if(count >= -1 && newArr.length === 25) {
      elem.classList.add('win');
      elem.innerHTML = 'You Win';
      clearInterval(window.timerId);
      clearInterval(window.sortBoxesIntervalId);
    }
  }
};

const checkBoxes = (e) => {
  const target = e.target;
  const items = document.querySelectorAll('.game-table__box');

  if(target.closest('.game-table__box')) {
    let boxNumber = +target.closest('.game-table__box').children[0].innerHTML;
    let min = +Math.min.apply(null, arr);

    if (boxNumber === min) {
      arr.forEach((num, idx, arr) => {
        target.closest('.game-table__box').classList.add('checked');
        if (num === min) {
          let index = arr.findIndex((el) => el === min);
          arr.splice(index, 1);
        }
      });
      Array.from(items).forEach(item => {
        item.classList.remove('last-checked');
      });
      target.closest('.game-table__box').classList.add('last-checked');
      if (mode.middle) {
        sortBoxes()
      }
    }
  }
};

let timerFifty = forTimer(50);

const timerFunc = () => {
  return window.timerId = setInterval(timerFifty, 1000)
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
  if(mode.middle) {
    sortBoxes();
  }
  if(mode.hard) {
    clearInterval(window.sortBoxesIntervalId);
    window.sortBoxesIntervalId = setInterval(sortBoxes, 2000);
  }
};

const sortBoxes = () => {
  arr.sort(() => Math.random() - 0.5);
  const checkedItems = [].slice.call(document.querySelectorAll('.game-table__box'));
  const withOutChecked = [].slice.call(checkedItems.filter(el => !el.classList.contains('checked')));
  withOutChecked.forEach((el,idx) => {
    el.children[0].innerHTML = arr[idx];
  })
};

const switchMode = (e) => {
  const target = e.target;
  const items = document.querySelectorAll('.toggle-mode__text');
  if(target.closest('.toggle-mode__text')) {
    Array.from(items).forEach(el => el.classList.remove('active'));
    target.closest('.toggle-mode__text').classList.add('active');
  }

  if(target.classList.contains('easy_mode')) {
    mode = {
      easy: true,
      middle: null,
      hard: null
    };
  }
  if(target.classList.contains('middle_mode')) {
    mode = {
      easy: null,
      middle: true,
      hard: null
    };
  }
  if(target.classList.contains('hard_mode')) {
    mode = {
      easy: null,
      middle: null,
      hard: true
    };
  }
  modeFunc(mode);
};

const modeFunc = (obj) => {
  let elem = document.querySelector('.timer');

  if(obj.easy) {
    console.log(obj);
    elem.classList = 'timer';
    clearInterval(window.sortBoxesIntervalId);
    clearInterval(window.timerId);
    timerFifty = forTimer(50);
    timerFunc();
    clearTableAndArr();
    createBoxAndSort(pushArray(arr));
    gameTable.addEventListener('click', checkBoxes);

  } else if(obj.middle) {
    console.log(obj);
    elem.classList = 'timer';
    clearInterval(window.sortBoxesIntervalId);
    clearInterval(window.timerId);
    timerFifty = forTimer(50);
    timerFunc();
    clearTableAndArr();
    createBoxAndSort(pushArray(arr));
    sortBoxes();
    gameTable.addEventListener('click', checkBoxes);
  } else if(obj.hard) {
    console.log(obj);
    elem.classList = 'timer';
    clearInterval(window.sortBoxesIntervalId);
    window.sortBoxesIntervalId = setInterval(sortBoxes, 2000);
    clearInterval(window.timerId);
    timerFifty = forTimer(50);
    timerFunc();
    clearTableAndArr();
    createBoxAndSort(pushArray(arr));
    gameTable.addEventListener('click', checkBoxes);
  }

};

startBtn.addEventListener('click', startFunc);
toggleModeBtn.addEventListener('click', switchMode);
restartBtn.addEventListener('click', restartFunc);


