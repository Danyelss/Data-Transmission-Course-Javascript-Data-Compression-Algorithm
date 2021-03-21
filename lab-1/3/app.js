var counter = 0;

function printValue(divId, value) {
  document.getElementById(divId).innerHTML = value;
}
printValue('counter', 0);

document.getElementById('inc').addEventListener('click', increment);

function inputSum() {
  var inputNumber = parseInt(document.getElementById('counter').value);
  sum(inputNumber);
}

function sum(n) {
  if( typeof n != 'number' )
    return 'not a number';
  if (typeof n === 'undefined') return 'n is undefined ';
  var sum = 0;
  for (var i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

function increment() {
  counter++;
  printValue('counter', counter);
}


// tests

console.log(sum('232'));
console.log(sum(232));
console.log(sum(increment));