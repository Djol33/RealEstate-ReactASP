export const Validate = {
    email: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Invalid email address"
    },
    password: {
        value: /^(?=.*[A-Za-z])(?=.*\d)\S{8,}$/,
        message: "Password must be at least 8 characters long and contain at least one letter and one number"
    },
    firstName: {
        value: /^[A-Za-zČčĆćŽžŠšĐđА-Яа-яЁёЂђЈјЉљЊњЋћЏџ]+$/,
        message: "First name must contain only letters"
    },
    lastName: {
        value: /^[A-Za-zČčĆćŽžŠšĐđА-Яа-яЁёЂђЈјЉљЊњЋћЏџ]+$/,
        message: "Last name must contain only letters"
    }

}