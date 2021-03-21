
function inputSum() {
  var inputNumber = parseInt(document.getElementById('se').value);
  console.log(inputNumber);
}

const printValue = ( divId, value ) => {
    //document.getElementById( divId ).innerHTML = value ;
    $( "#" + divId ).html( value );
}

const compute = (/*a, b, c */) => {
    var firstNumberText = $('#FirstNumber').val();
    var secondNumberText = $('#SecondNumber').val();
    var operatorText = $('#Operator').val();

    var firstNumber = parseInt(firstNumberText);
    var secondNumber = parseInt(secondNumberText);
    var Operator = operatorText;

    //var firstNumber = a;
    //var secondNumber = b;
    //var Operator = c;

    if( typeof firstNumber != 'number' )
        return 'not allowed';
    if( typeof secondNumber != 'number' )
        return 'not allowed';

    if( Operator == '+' )
        return firstNumber + secondNumber;

    if( Operator == '-' )
        return firstNumber - secondNumber;

    if( Operator == '*' )
        return firstNumber * secondNumber;

    if( Operator == '/' )
            return firstNumber / secondNumber;

    if( Operator == '%' )
                return firstNumber % secondNumber;

    return 'not allowed';
}
/*
console.log(compute(1, 2, '+' ));
console.log(compute(1, 2, '-' ));
console.log(compute(1, 2, '*' ));
console.log(compute(1, 2, '/' ));
console.log(compute(1, 2, '%' ));
console.log(compute('a', 2, '+' ));
console.log(compute(1, 'b', '+' ));
console.log(compute(1, 1, 'c' ));
*/

const begin = () =>{
    var result = compute();
    if( typeof result == 'number' )
        printValue('result', result );
    else
        printValue('result','wrong data');
}

$("#equalsButton").on( 'click', begin );