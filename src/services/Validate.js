
const ValidateNormalLetter = (input) => {
    let regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
    return !regex.test(input.trim())
}

const ValidateEmail = (input) => {
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return regex.test(input.trim())
}

const ValidateMustNotEmpty = (input) => {
    if (input.trim() != '') {
        return true
    }
    return false
}

const ValidateOnlyNumbers = (input) => {
    let regex = /^[0-9]*$/
    return regex.test(input)
}

export default {
    ValidateNormalLetter: ValidateNormalLetter,
    ValidateEmail: ValidateEmail,
    ValidateMustNotEmpty: ValidateMustNotEmpty,
    ValidateOnlyNumbers: ValidateOnlyNumbers,
}