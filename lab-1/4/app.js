const Fibonacci = (n) =>{

    if( typeof n != 'number' )
        return 'not allowed';


    if( n < 1 || n > 10 )
        return 'not allowed';


    var fib = [];

    if( n == 1 ){
        fib[0] = 1;
        return fib;
    }

    if( n == 2 ){
        fib[0] = 1;
        fib[1] = 1;
        return fib;
    }

    var f1 = fib[0] = 1;
    var f2 = fib[1] = 1;

    for( var i = 2; i < n; i++ ){
        fib[i] = f1 + f2;
        f1 = f2;
        f2 = fib[i];
    }

    return fib;
}

// tests

console.log( Fibonacci(2) );
console.log( Fibonacci(5) );
console.log( Fibonacci(64) );
console.log( Fibonacci('andrei') );
console.log( Fibonacci() );
