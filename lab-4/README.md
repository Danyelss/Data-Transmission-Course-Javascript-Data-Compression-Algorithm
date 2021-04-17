### Questions and tasks

1. How many bytes do we need to send the following text without encoding and
including spaces, CR (\r) and newlines (\n)?

    a)
    ```
    us
    ```

    b)
    ```
    first well have even way
    ```

    c)
    ```
    first well
    have even way
    ```

2. How many bytes do we need to send the same text values from point 1 with the implemented dictionary encoding? 

3. Write a function on orange that compresses data and saves the binary into a text file. 
__Hint: https://stackoverflow.com/questions/2496710/writing-files-in-node-js__

4. Write a function on orange that reads the compressed binary data and retrieves the initial text.
__Hint: https://nodejs.dev/learn/reading-files-with-nodejs, https://www.npmjs.com/package/binary-parser__

5. Extend the existing solution to allow **orange** to send text messages (using the given words and codes) to **kiwi**. Input text example:

```
first
well have
way us any
```

_Hint: You could read the text from a text file using https://nodejs.dev/learn/reading-files-with-nodejs
or using a string variable. Example:'_
```js
const text = 'first\r\nhave any\r\nway';
```


