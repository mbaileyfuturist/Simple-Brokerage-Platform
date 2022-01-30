import Input from '../Input/Input'
import Button from '../Button/Button'
import classes from './Authentication.module.css'
import {useState} from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'

const Authenticaion = () => {

    let myStorage = window.localStorage;
    const history = useHistory()

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [existingUser, setExistingUser] = useState(true)
    const [age, setAge] = useState()
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [error, setError] = useState('')

    const changeFirstName = event => {
        setFirstName(event.target.value)
    }

    const changeLastName = event => {
        setLastName(event.target.value)
    }

    const changeEmail = event => {
        setEmail(event.target.value)
    }

    const changeUserName = event => {
        setUserName(event.target.value)
    }

    const changePassword = event => {
        setPassword(event.target.value)
    }

    const toggleExistingUser = () => {
        setExistingUser(!existingUser)
    }

    const changeAge = event => {
        setAge(event.target.value)
    }
    const changeAddress = event => {
        setAddress(event.target.value)
    }

    const changeCity = event => {
        setCity(event.target.value)
    }

    const changeState = event => {
        setState(event.target.value)
    }

    const signup = async event => {

        event.preventDefault();

        try{

            const response = await axios.post('http://localhost:3001/signup',{
                    email:email,
                    password:password,
                    returnSecureToken:true
                })

            const data = await response.data

            if(data.error){
                setError(data.error.message)
                throw new Error(data.error.message)
            }

            //If token, then post new user and navigate to upload photo.
            if(data.idToken){

                myStorage.setItem('idToken', data.idToken)

                //Post the new user
                try{


                    const response = await axios.post('http://localhost:3001/addUser', {
                        idToken:data.idToken,
                        firstName:firstName,
                        lastName:lastName,
                        email:email,
                        userName:userName,
                        password:password,
                        address:address,
                        city:city,
                        state:state,
                        age:age,
                    })

                    if(response.status !== 200){
                        throw new Error('Failed to post new user.')
                    }

                }catch(error){
                    console.log(error)
                }

                //Update the new user with the id provided by google.
                let userWithId = {}
                try{

                    const response = await axios.post('http://localhost:3001/getUsers', {idToken:data.idToken})
                    const users = await response.data

                    console.log(users)
                    for(let key in users){
                        if(users[key].email === email){
                            userWithId = {
                               ...users[key],
                               id:key
                            }

                            myStorage.setItem('id', key)
                        }
                    }

                    console.log(userWithId)

                    //Update that new user.
                    const responseTwo = await axios.post('http://localhost:3001/updateUser', {id: userWithId.id, idToken:data.idToken})

                    if(responseTwo.status !== 200){
                        throw new Error('Failed to update new user.')
                    }

                    history.push('/Home')

                }catch(error){
                    console.log(error)
                }

            }else{
                //Set error
            }

        }catch(error){
            console.log(error)
        }
        
    }

    const login = async event => {

        event.preventDefault()

        try{

            const response = await axios.post('http://localhost:3001/login',{
                email:email,
                password:password,
                returnSecureToken:true,
                })

            const data = await response.data

            if(data.error){
                setError(data.error.message)
                throw new Error(data.error.message)
            }

        //If token, then navigat to the home component.
        if(data.idToken){

            try{

                const usersResponse = await axios.post('http://localhost:3001/getUsers', {idToken:data.idToken})
                const users = await usersResponse.data

                for(let key in users){
                    if(users[key].email === email){
                        myStorage.setItem('id', users[key].id)
                    }
                }

                myStorage.setItem('idToken', data.idToken)
                history.push('/Home')
            }catch(error){
                console.log(error)
            }
        }else{
            //Set error
        }

        }catch(error){
            console.log(error)
        }


    }

    const signUpForm = (
       <div>
            <form className={classes.formContainer} onSubmit={signup}>
                <div className={classes.formHeader}>
                    <p className={classes.formTitle}>Sign Up</p>
                </div>
                <div className={classes.inputContainer}>
                    <Input className={classes.input} type='text' value={firstName} onChange={changeFirstName} placeholder='first name'/>
                </div>
                <div className={classes.inputContainer}>
                    <Input className={classes.input} type='text' value={lastName} onChange={changeLastName} placeholder='last name'/>
                </div>
                <div className={classes.inputContainer}>
                    <Input className={classes.input} type='number' value={age} onChange={changeAge} placeholder='age' placeholder='age'/>
                </div>
                <div className={classes.inputContainer}>
                    <Input className={classes.input} type='text' value={address} onChange={changeAddress} placeholder='address'/>
                </div>
                <div className={classes.inputContainer}>
                    <Input className={classes.input} type='text' value={city} onChange={changeCity} placeholder='city'/>
                </div>
                <div className={classes.inputContainer}>
                    <Input className={classes.input} type='text' value={state} onChange={changeState} placeholder='state'/>
                </div>

                <div className={classes.inputContainer}>
                    <Input className={classes.input} type='email' value={email} onChange={changeEmail} placeholder='email'/>
                </div>
                <div className={classes.inputContainer}>
                    <Input className={classes.input} type='text' value={userName} onChange={changeUserName} placeholder='username'/>
                </div>
                <div className={classes.inputContainer}>
                    <Input className={classes.input} type='password' value={password} onChange={changePassword} placeholder='password'/>
                </div>

                <div className={classes.buttonContainer}>
                    <Button className={classes.button}  value='submit' type='submit'/>
                </div>
                <p onClick={toggleExistingUser} className={classes.subText}>Already an existing user? Login here.</p>
            </form>
            {error ? <p className={classes.error}>{error}</p>:<></>}
       </div>

    )

    const logInForm = (
        <div>
            <form className={classes.formContainer} onSubmit={login}>
                <div className={classes.formHeader}>
                    <p className={classes.title}>Simple Brokerage Platform</p>
                    <p className={classes.formTitle}>Log In</p>
                </div>
                <div className={classes.inputContainer}>
                    <Input className={classes.input} type='email' value={email} onChange={changeEmail} placeholder='email'/>
                </div>
                <div className={classes.inputContainer}>
                    <Input className={classes.input} type='password' value={password} onChange={changePassword} placeholder='password'/>
                </div>

                <div className={classes.buttonContainer}>
                    <Button className={classes.button} value='submit' type='submit'/>
                </div>
                <p onClick={toggleExistingUser} className={classes.subText}>Dont have an account? Click here to create one.</p>
            </form>
            {error ? <p className={classes.error}>{error}</p>:<></>}
        </div>
    )

    return(
        existingUser ? logInForm : signUpForm
    )
}

export default Authenticaion