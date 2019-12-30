const fs = require('fs');

const TARGET_NUMBER_LINE = 0;
const MAX_HAVE_HOBBIT = 10;

let tagetNumber = 0;
const HOBBITS_BIGDATA = [];

var lineReader = require('readline').createInterface({
  input: fs.createReadStream('./500000.txt')
});

let lineNumber = 0;
lineReader.on('line', function (line) {
  if (lineNumber === TARGET_NUMBER_LINE) {
    tagetNumber = Number(line);
  } else {
    let hobbit = line.split(' ');
    hobbit.sort((a, b) => { 
      if (a > b) return 1;
      else if (b > a) return -1;
      else return 0;
    });    
    HOBBITS_BIGDATA.push(hobbit);
  }
  lineNumber++;
});

lineReader.on('close', function() {
  console.time('processCoupleMatching');
  const couple = processCoupleMatching(tagetNumber, HOBBITS_BIGDATA)
  print(couple);
  console.timeEnd('processCoupleMatching');
})

function processCoupleMatching(count, HOBBITS_BIGDATA) {
  const HOBBITS = HOBBITS_BIGDATA;
  let maxSameHobbit = 0;

  const couple_group = [];

  let one = [];
  let two = [];
  for (let i = 0; i < count; i++) {
    one = HOBBITS[i];
    for (let j = i + 1; j < count; j++) {
      two = HOBBITS[j];
      const couple = getCouple(one, two, maxSameHobbit);
      const count = couple.length;

      if (maxSameHobbit < count) {
        maxSameHobbit = count;
        couple_group.length = 0;
        const mapping = [];
        mapping.push(i+1);
        mapping.push(j+1);
        couple_group.push(mapping);
      } else if (maxSameHobbit === count) {
        const mapping = [];
        mapping.push(i+1);
        mapping.push(j+1);
        couple_group.push(mapping);
      }
    }
  }
  return couple_group;
}

function getCouple(one, two, maxSameHobbit) {
  const total = [];
  let i = 0, j = 0;
  while(i < MAX_HAVE_HOBBIT && j < MAX_HAVE_HOBBIT) {
    if (one[i] === two[j]) {
      total.push(one[i]);
      i++;
      j++;
    } else if (one[i] > two[j]) {
      j++;
    } else {
      i++;
    }

    if (maxSameHobbit > MAX_HAVE_HOBBIT - Math.abs(i-j)) {
      break;
    }
  }
  return total;
}



function print(couple_group) {
  let result = [];
  for (let i = 0; i < couple_group.length; i++) {
    const arr = [];
    for (let j = 0; j < couple_group[i].length; j++) {
      arr.push(`${couple_group[i][j]}`)
    }
    result.push(arr.join('-'));
  }
  fs.writeFile('result.txt', result, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });  
}
