import * as Yup from 'yup'
import { 
	allRegex, 
	firstAndLastNameRegex,
	phoneNumberRegex,
	CARD_NAME,
	CARD_NUMBER,
	EMAIL_OR_PHONENUMBER_REQUIRED_FIELD,
	EMAIL_REQUIRED_FIELD, 
	EXPIRED_CARD,
	INVALID_CCNAME,
	INVALID_CCNUMBER,
	INVALID_EXPIRYDATE,
	INVALID_EMAIL, 
	INVALID_EMAIL_OR_PHONENUMBER,
	INVALID_FIRST_NAME,
	INVALID_LAST_NAME,
	INVALID_PASSWORD, 
	NUMBERS_ONLY,
	PASSWORD_NOT_MATCH, 
	PASSWORD_REQUIRED_FIELD,
	PHONENUMBER_MAXIMUM, 
	PHONENUMBER_MINIMUM,
	REQUIRED_FIELD, 
	STRICTLY_SIX_DIGITS,
	SU_PASSWORD_REQUIRED_FIELD
} from '../utilities/constants'
import valid from 'card-validator'

export const authSchema = Yup.object().shape({
	email: Yup.string()
		.email(INVALID_EMAIL)
		.matches(/@[^.]*\./, INVALID_EMAIL)
		.nullable(),
	phoneNumber: Yup.string()
		.min(10, PHONENUMBER_MINIMUM)
		.max(14, PHONENUMBER_MAXIMUM)
		.nullable(),
	password: Yup.string()
		.required(PASSWORD_REQUIRED_FIELD)
}, ['email', 'phoneNumber'])

export const signupSchema = Yup.object({
	email: Yup.string()
		.email(INVALID_EMAIL)
		.matches(/@[^.]*\./, INVALID_EMAIL)
		.required(EMAIL_REQUIRED_FIELD),
	phoneNumber: Yup.string()
		.min(10, PHONENUMBER_MINIMUM)
		.max(14, PHONENUMBER_MAXIMUM)
		.nullable(),
	password: Yup.string()
		.matches(allRegex, INVALID_PASSWORD)
		.required(SU_PASSWORD_REQUIRED_FIELD)
})

export const forgotPasswordSchema = Yup.object({
	emailOrPhoneNumber: Yup.string()
		.required(EMAIL_OR_PHONENUMBER_REQUIRED_FIELD)
		.test('emailOrPhoneNumber', INVALID_EMAIL_OR_PHONENUMBER, value => {
			return Yup.string().email().isValidSync(value) || Yup.string().matches(phoneNumberRegex).isValidSync(value)
		})
})

export const resetSchema = Yup.object({
	password: Yup.string().required(REQUIRED_FIELD),
	confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], PASSWORD_NOT_MATCH).required(PASSWORD_REQUIRED_FIELD)
})

export const updateUserSchema = Yup.object({
	email: Yup.string()
		.email(INVALID_EMAIL)
		.matches(/@[^.]*\./, INVALID_EMAIL)
		.nullable(),
	phoneNumber: Yup.string()
		.min(10, PHONENUMBER_MINIMUM)
		.max(14, PHONENUMBER_MAXIMUM)
		.nullable(),
	firstName: Yup.string().trim()
		.matches(firstAndLastNameRegex, INVALID_FIRST_NAME)
		.nullable(),
	lastName: Yup.string().trim()
		.matches(firstAndLastNameRegex, INVALID_LAST_NAME)
		.nullable(),
	password: Yup.string()
		.matches(allRegex, INVALID_PASSWORD)
		.nullable(),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref('password'), null], PASSWORD_NOT_MATCH)
		.nullable()
})

export const securitySchema = Yup.object({
	firstName: Yup.string()
		.required(REQUIRED_FIELD)
		.matches(firstAndLastNameRegex, INVALID_FIRST_NAME),
	lastName: Yup.string()
		.required(REQUIRED_FIELD)
		.matches(firstAndLastNameRegex, INVALID_LAST_NAME),
	password: Yup.string()
		.required('Please provide a password')
		.matches(allRegex, INVALID_PASSWORD),
	confirmPassword: Yup.string()
		.required('Please provide a password')
		.when('password', {
			is: (val) => (val && val.length > 0 ? true : false),
			then: Yup.string().oneOf(
				[Yup.ref('password')],
				PASSWORD_NOT_MATCH
			),
		}),
})

export const resetCodeSchema = Yup.object({
	oneTimePassword: Yup.string()
		.required(REQUIRED_FIELD)
		.matches(/^[0-9]+$/, NUMBERS_ONLY)
		.min(6, STRICTLY_SIX_DIGITS)
		.max(6, STRICTLY_SIX_DIGITS)
})

export const creditCardSchema = Yup.object({
	ccName: Yup.string()
		.required(CARD_NAME)
		.matches(
			/^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
			INVALID_CCNAME
			),
	ccNumber: Yup.string()
		.required(CARD_NUMBER)
		.test('test-cvv', 
			INVALID_CCNUMBER, 
			value => valid.number(value).isValid)
		.max(19, INVALID_CCNUMBER), 
	ccExpirationDate: Yup.string()
		.required(REQUIRED_FIELD)
		.test(
			'test-credit-card-expiration-date',
			EXPIRED_CARD,
			expirationDate => {
				if (!expirationDate) {
					return false
				}
		
				const today = new Date()
				const monthToday = today.getMonth() + 1
				const yearToday = today
					.getFullYear()
					.toString()
					.substr(-2)
		
				const [expMonth, expYear] = expirationDate.split('/')
		
				if (Number(expYear) < Number(yearToday)) {
					return false
				} else if (Number(expMonth) < monthToday && Number(expYear) <= Number(yearToday)) {
					return false
				}
		
				return true
			})
		.test('test-cvv', 
		INVALID_EXPIRYDATE, 
		value => valid.expirationDate(value).isValid),
	ccCVV: Yup.string()
		.required(REQUIRED_FIELD)
})