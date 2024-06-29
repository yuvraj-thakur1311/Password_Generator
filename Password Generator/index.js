const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols= '~`!@#$%^&*()_-+=\|}]{[:;>.<,?/"';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");

// Set password length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
   
    const min = inputSlider.min;
    const max = inputSlider.max;

    inputSlider.style.backgroundSize = (( passwordLength - min) * 100 / (max - min)) + "100%"
}
// handleSlider(); 

function setIndicator(color){
     indicator.style.backgroundColor = color;

    // for Shadow..
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInt(min , max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomNumber(){
    return getRandomInt(0 , 9);
}

function generateLowerCase(){
    return String.fromCharCode(getRandomInt(97 , 123));
}

function generateUpperCase(){
    return String.fromCharCode(getRandomInt(65 , 90 ));
}

function generateSymbol(){
    const  randomNum = getRandomInt(0 , symbols.length);
    return symbols.charAt(randomNum);
}

function calculateStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(upperCaseCheck.checked) hasUpper = true;
    if(lowerCaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("#0f0");
    }

    else if((hasUpper || hasLower) && (hasNum || hasSym) && passwordLength >= 6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
      try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
      }

      catch(e){
        copyMsg.innerText = "Failed";
      }

    //   to make copy span visible ->
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active"); 
    }, 2000);
}

function shufflePassword(array){
        for(let i = array.length - 1; i > 0; i-- ){
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }

        let str ="";
        array.forEach( (el) => {(str += el)});
        return str;

}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

//  special case
     if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
     }
}
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change' , handleCheckBoxChange);
});

inputSlider.addEventListener('input' , (e) => {
    passwordLength = e.target.value;
    handleSlider();
 })
 
copyBtn.addEventListener('click' , () => {
    if(passwordDisplay.value)
         copyContent();
 })

 generateBtn.addEventListener('click' , () => {
// none of the checkbox are selected..
    if(checkCount == 0) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // To find a new password..
     console.log("Starting the Journey");

    //  remove old password..
    password = "";
    let funcArr = [];

    if(upperCaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowerCaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    if(numbersCheck.checked)
        funcArr.push(getRandomNumber);

    // compulsory addition..
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }

    console.log(" Compulsory Addition Done");

    // remaining addition
    for(let i=0; i<passwordLength - funcArr.length; i++){
        let randomIndex = getRandomInt(0 , funcArr.length);
        console.log("RandomIndex" + randomIndex);
        password += funcArr[randomIndex]();
    }
     
    console.log(" Remaining Addition Done");

    password = shufflePassword(Array.from(password));

    console.log(" Shuffling Done");

    passwordDisplay.value = password;

    console.log(" UI Addition Done");

    calculateStrength();
 });