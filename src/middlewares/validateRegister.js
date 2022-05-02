const path = require('path');
const { body, check } = require('express-validator');

module.exports = [

	body('name')
		.notEmpty().withMessage('Debes completar el nombre de usuario').bail()
		.isLength({min: 5}).withMessage('Debe ingresar un nombre más largo'),

	body('password')
		.isStrongPassword({minLength:8, minUpperCase:1, minNumbers:1, minSymbols:1, minLowerCase:1 })
		.withMessage('Password debe contener al menos 8 caracteres con mayúsculas, minúsculas, numeros y al menos un carácter especial')
		.bail(),

	body('email')
		.notEmpty().withMessage('Debes completar el email').bail()
		.isEmail().withMessage('Debes ingresar un email válido').bail()
		.custom((email, {req}) => { 
			let thisEmail = req.body.email;
			if (email == thisEmail) {
				throw new Error('Email already registered')
			}
		})
		.bail(),

	check('remember_token')
		.notEmpty().withMessage('Debes ingresar un token').bail(),
	
	check('rol')
		.notEmpty().withMessage('Debes ingresar un rol').bail()
		.isNumeric().withMessage('Ingrese un número para el rol: 0=user 1=admin')

]