const inputSlider = document.querySelector('[data-lengthSlider]');
const lengthDisplay = document.querySelector('[data-lengthNumber]');
const passwordDisplay = document.querySelector('[data-passwordDisplay]');
const copyBtn = document.querySelector('[data-copy]');
const copyMsg = document.querySelector('[data-copyMsg]');
const uppercaseCheck = document.querySelector('#uppercase');
const lowercaseCheck = document.querySelector('#lowercase');
const numbersCheck = document.querySelector('#numbers');
const symbolsCheck = document.querySelector('#symbols');
const indicator = document.querySelector('[data-indicator]');
const generateBtn = document.querySelector('.generateButton');
const allCheckBox = document.querySelectorAll('input[type=checkbox]');
const symbols = '`!@#$%^&*()_-+={}[];:"<>,.?/';

let password = "";
let passwordLength = 10;
uppercaseCheck.checked =true;

let checkCount = 1;
handleSlider();
// set strength circle color to grey
console.log('1');
// Set password length [passwordLength]
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}

function setIndicator(color){
    indicator.style.backgoundColor = color;
    // shadow

}

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max - min)) + min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));  //lowercase a (ASCII value=97) and lowercase z(ASCII value=123)
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,90));    //uppercase a (ASCII value=65) and uppercase Z(ASCII value=91)
}

function generateSymbol(){
    const randomNum = getRndInteger(0,symbols.length);
    return symbols.charAt(randomNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >=8){
        setIndicator('#0f0');
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >=6
    ){
        setIndicator('#ff0');
    }else{
        setIndicator('#f00');
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }   
    catch(e){
        copyMsg.innerText = "failed";
    } 
    // to make copy span visible
    copyMsg.classList.add('active');
    setTimeout(()=>{
        copyMsg.classList.remove('active');
    },2000);
}

function shufflePassword(array){
    // fisher yates method to shuffle the array
    for(let i=array.length - 1; i>0; i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach((el)=>(str += el));
    return str;
}
console.log('2');

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked) 
        checkCount++;   
    });
    // special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange());
})


inputSlider.addEventListener('input',(e)=>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})

console.log('3');


generateBtn.addEventListener('click', ()=>{
    // none of the check box are selected
    if(checkCount <=0){
        alert('Check atleast one box');
        return;
    } 

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        console.log(passwordLength);
        handleSlider();
    }

    // to find new password

    // remove old pass
    password="";

    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generatelowerCase();
    // }
    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase());
    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase());
    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber());
    if(symbolsCheck.checked)
        funcArr.push(generateSymbol());
    console.log(funcArr);
    // content for password addition

    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i];
    }

    for(let i=0; i< passwordLength - funcArr.length; i++){
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex];
        
    }

    // shuffle the password
    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;
    console.log('UI Done');
    // strength check
    calcStrength();

});
