const strengthMeter = document.getElementById('strength-meter')
const passwordInput = document.getElementById('password-input')
const reasonsContainer = document.getElementById('reasons')
const generateButton = document.getElementById('generate-password')

passwordInput.addEventListener('input', updateStrengthMeter)
updateStrengthMeter()
generateButton.addEventListener('click', generatePassword)

function updateStrengthMeter() {
  const weaknesses = calculatePasswordStrength(passwordInput.value)

  let strength = 100
  reasonsContainer.innerHTML = ''
  weaknesses.forEach(weakness => {
    if (weakness == null) return
    strength -= weakness.deduction
    const messageElement = document.createElement('div')
    messageElement.innerText = weakness.message
    reasonsContainer.appendChild(messageElement)
  })
  strengthMeter.style.setProperty('--strength', strength)
}

function calculatePasswordStrength(password) {
  const weaknesses = []
  weaknesses.push(lengthWeakness(password))
  weaknesses.push(lowercaseWeakness(password))
  weaknesses.push(uppercaseWeakness(password))
  weaknesses.push(numberWeakness(password))
  weaknesses.push(specialCharactersWeakness(password))
  // weaknesses.push(repeatCharactersWeakness(password))  

  return weaknesses
}

function lengthWeakness(password) {
  const length = password.length

  if (length <= 5) {
    return {
      message: 'Your password is too short',
      deduction: 40
    }
  }

  if (length <= 10) {
    return {
      message: 'Your password could be longer',
      deduction: 15
    }
  }
}

function uppercaseWeakness(password) {
  return characterTypeWeakness(password, /[A-Z]/g, 'uppercase characters')
}

function lowercaseWeakness(password) {
  return characterTypeWeakness(password, /[a-z]/g, 'lowercase characters')
}

function numberWeakness(password) {
  return characterTypeWeakness(password, /[0-9]/g, 'numbers')
}

function specialCharactersWeakness(password) {
  return characterTypeWeakness(password, /[^0-9a-zA-Z\s]/g, 'special characters')
}

function characterTypeWeakness(password, regex, type) {
  const matches = password.match(regex) || []

  if (password.length <= 15) {
    if (matches.length === 0) {
      return {
        message: `Your password has no ${type}`,
        deduction: 20
      }
    }
  }

  // else if (matches.length <= 2) {
  //   return {
  //     message: `Your password could use more ${type}`,
  //     deduction: 5
  //   }
  // }
}

function repeatCharactersWeakness(password) {
  const matches = password.match(/(.)\1/g) || []
  if (matches.length > 0) {
    return {
      message: 'Your password has repeat characters',
      deduction: matches.length * 10
    }
  }
}

function generatePassword() {
  let wordString = loadFile("PassphraseWordlist.txt");
  let words = wordString.split(",");
  let separators = [".", "!", "@", "#", "$", "%", "^", "&", "*", "\\", "|", "/", "?"];
  let password = "";
  let randSep = separators[Math.floor(Math.random() * separators.length)];

  // select 4 random words
  for (let i = 0; i < 4; i++) {
    let randInd = Math.floor(Math.random() * words.length);
    // console.log(randInd);

    let element = words[randInd];

    // concat with random separators
    if (i == 3) {
      password += element;
    } else {
      password += element + randSep;
    }
  }

  // console.log(password);
  passwordInput.value = password;

  updateStrengthMeter();
}

function loadFile(filePath) {
  var result = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", filePath, false);
  xmlhttp.send();
  if (xmlhttp.status==200) {
    result = xmlhttp.responseText;
  }
  return result;
}