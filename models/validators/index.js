const isValidEmail = value => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/igm.test(value);
const isValidPhone = value => /^(\+?\d{5}|\d{3})-?\d{3}-?\d{4}$/.test(value);
const isValidLink = value => /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/mg.test(value);
const isValidUserName = value => /^[a-zA-z]\w+$/g.test(value);

module.exports = {
    isValidEmail,
    isValidPhone,
    isValidLink,
    isValidUserName
}
