// Interfaz del Modelo
export interface RegisterUserModel {
    name: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    password2: string;
    birthday: Date;
}

// Funcion para obtener usuario
export function getEmptyRegisterUser() : RegisterUserModel {
    return {
        name: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        password2: '',
        birthday: new Date()
    }
}

