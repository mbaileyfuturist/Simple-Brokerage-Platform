import { render, screen } from '@testing-library/react';
import Authentication from './Authentication'
import userEvent from '@testing-library/user-event'

describe('Test the dynamic content within the authentication Component.', () => {

    //Login
    test('Test the number of inputs within the login form.', () => {

        render(<Authentication />)

        const inputs = screen.getAllByTitle('input')

        let inputArray = []
        for(let input in inputs){
            inputArray.push(input)
        }

        expect(inputArray).toHaveLength(2)

    })

    test('Test the login button exists within the document on initial render.', () => {

        render(<Authentication />)

        const loginButton = screen.getByTitle('logInButton')

        expect(loginButton).toBeInTheDocument()    
    })

    test('Test the subtext within the login form.', () => {

        render(<Authentication />)

        const subText = screen.getByText('Dont have an account? Click here to create one.')

        expect(subText).toBeInTheDocument()
    })

    //Sign up
    test('Test the number of inputs within the signup form, after subtext has been click', () => {

        render(<Authentication />)

        const subText = screen.getByText('Dont have an account? Click here to create one.')
        userEvent.click(subText)

        const inputs = screen.getAllByTitle('input')

        let inputArray = []
        for(let input in inputs){
            inputArray.push(input)
        }

        expect(inputArray).toHaveLength(9)
    })

    test('Test that the signup button exists within the document, after subtext has been clicked.', () => {

        render(<Authentication />)

        const subText = screen.getByText('Dont have an account? Click here to create one.')
        userEvent.click(subText)

        const signUpButton = screen.getByTitle('signUpButton')

        expect(signUpButton).toBeInTheDocument()  

    })

    test('Test the subtext within the signup form.', () => {

        render(<Authentication />)

        const subText = screen.getByText('Dont have an account? Click here to create one.')
        userEvent.click(subText)

        const newSubText = screen.getByText('Already an existing user? Login here.')

        expect(newSubText).toBeInTheDocument()

    })

    
})
