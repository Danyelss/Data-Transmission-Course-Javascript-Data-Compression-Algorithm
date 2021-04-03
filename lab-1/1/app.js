console.log('Changed');

document.getElementById('message').innerHTML = 'Changed';

var accesUser = {
    "id": 14,
    "mustBeAccesed": "ok",
    "number": 0
}

console.log(accesUser.mustBeAccesed);

const functionCallRed = () => {
    accesUser.id = 1;
}

const functionCallBlue = () => {
    console.log( accesUser.id == 1 ? "Ii bine man" : "Nu e bine man" );
}

const printValue = ( divId, value ) => {
    //document.getElementById( divId ).innerHTML = value ;
    $( "#" + divId ).html( value );
}

printValue( "counter", 0);

const decrement = () => {
    console.log("substract");
    accesUser.number--;
    printValue ( "counter", accesUser.number );
}

const double = () => {
    console.log("duble");
    accesUser.number *= 2;
    printValue ( "counter", accesUser.number );
}

 $("#doubleButton").on( 'click', double );

document.getElementById("minusButton").addEventListener( "click", decrement );

