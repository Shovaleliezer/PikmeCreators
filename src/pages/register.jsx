import { useState } from 'react'
import { Formik, Field, Form } from 'formik'
import { TextField } from '@material-ui/core'
import { createTheme } from "@material-ui/core/styles"
import { MuiThemeProvider } from "@material-ui/core/styles"

export const Register = () => {

    const [isLogin, setIsLogin] = useState(true)
    const [invalidMsg,setInvalidMsg] = useState('')

    const signupInitialValues = {
        username: '',
        password: '',
        repassword: '',
        imgUrl: '',
    }

    const loginInitialValues = {
        username: '',
        password: ''
    }

    const theme = createTheme({
        overrides: {
            MuiOutlinedInput: {
                root: {
                    // Hover state
                    "&:hover $notchedOutline": {
                        borderColor: '#1976d2'
                    },
                    // Focused state
                    "&$focused $notchedOutline": {
                        borderColor: '#1976d2'
                    }
                },
                // Default State
                notchedOutline: {
                    borderColor: '#1976d2'
                }
            }
        }
    });

    const onSignup = (user) => {
        console.log(user)
    }

    const onLogin = (credentials) => {
        console.log(credentials)
    }

    const onValidate = ({ username, password, repassword }) => {
        const errors = {}
        if (!username) errors.username = 'Requierd'
        if (!password || !repassword) errors.password = 'Requierd'
        if (password !== repassword) errors.repassword = 'Passwords are not the same'
        return errors
    }

    return (
        <section className="register">

            {!isLogin && <Formik validateOnChange={false} validateOnBlur={false} validate={onValidate} initialValues={signupInitialValues} onSubmit={onSignup}>
                {({ errors }) => (
                    <Form>
                        <h1 className="center">Sign up</h1>
                        <MuiThemeProvider theme={theme}>
                            <Field size="small" name="username" type="text" as={TextField} variant="outlined" label="Username" fullWidth />
                            {<span className="error">{errors.username}</span>}
                            <Field size="small" name="password" type="password" as={TextField} variant="outlined" label="Password" fullWidth />
                            {<span className="error">{errors.password}</span>}
                            <Field size="small" name="repassword" type="password" as={TextField} variant="outlined" label="Repeat password" fullWidth />
                            {<span className="error">{errors.repassword}</span>}
                            <Field size="small" name="imgUrl" type="text" as={TextField} variant="outlined" label="your image URL (optional)" fullWidth />
                        <button className="clickable register-button"> Continue </button>
                        </MuiThemeProvider>
                        <h3 className='clickable center' onClick={() => setIsLogin(!isLogin)}>I already have an account</h3>
                    </Form>
                )}
            </Formik>}

            {isLogin && <Formik validateOnChange initialValues={loginInitialValues} onSubmit={onLogin}>
                <Form>
                    <h1 className='center'>Log in</h1>
                    <MuiThemeProvider theme={theme}>
                        <Field size="small" name="username" type="text" as={TextField} variant="outlined" label="Username" fullWidth InputLabelProps={{ style: { color: '#222222' } }} />
                        <Field size="small" name="password" type="password" as={TextField} variant="outlined" label="Password" fullWidth style={{ marginTop: '12px' }} InputLabelProps={{ style: { color: '#222222' } }} />
                    </MuiThemeProvider>
                    <div className='center'>
                        {invalidMsg && <h3 style={{color:'red'}}>Invalid username/password</h3>}
                    </div>
                    <button className="clickable register-button"> Continue </button>
                    <h3 className='clickable center' onClick={() => setIsLogin(!isLogin)}>New user</h3>
                </Form>
            </Formik>}
        </section>
    )
}