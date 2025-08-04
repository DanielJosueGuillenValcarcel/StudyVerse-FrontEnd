// Interfaz del modelo
export interface LoginUserModel {
    email: string;
    password: string;
}

// Funcion para que me devuelva los atributos de login
export function getEmptyLoginUser() : LoginUserModel {
    return {
        email: '',
        password: ''
    }
}