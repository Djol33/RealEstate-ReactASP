import { NAME_PATTERN } from './personName';

export const Validate = {
    email: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Invalid email address"
    },
    password: {
        value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,}$/,
        message: "Password must be at least 8 characters and contain a letter, a number and a special character"
    },
    firstName: {
        value: NAME_PATTERN,
        message: "First name must contain only letters"
    },
    lastName: {
        value: NAME_PATTERN,
        message: "Last name must contain only letters"
    }

}