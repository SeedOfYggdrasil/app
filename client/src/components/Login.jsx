import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import '../css/Login.css'
import '../css/LandingPage.css'
import '../css/fonts.css'
import '../css/Register.css'

const Login = ({ closeModal, switchToRegister }) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async e => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (!email || !password) {
      setError('Please enter both email and password.')
      setLoading(false)
      return
    }

    try {
      const auth = getAuth()
      await signInWithEmailAndPassword(auth, email, password)
      setSuccess('Logged in successfully. Redirecting...')
      navigate('/editor')
      closeModal()     
    } catch (firebaseError) {
      console.error('Error during login:', firebaseError)
      let errorMessage = 'An unexpected error occurred. Please try again.';
      switch (firebaseError.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          errorMessage = 'Incorrect email or password.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'The email address is not valid.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Your account has been disabled.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Please try again later.';
          break;
        default:
          errorMessage = 'Login failed. Please check your credentials.';
          break;
      }
      setError(errorMessage)
      setLoading(false)
    } finally {
        setLoading(false)     
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        {error && <div className='error-message'>{error}</div>}
        {success && <div className='success-message'>{success}</div>}
        <div className='text-email'>
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className='text-password'>
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <button type='submit' className='btn-submit' disabled={loading}>
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </form>
      <div className='modal-footer'>
        <p>
          Don't have an account?{' '}
          <button className='btn-register' onClick={switchToRegister}>
            Register
          </button>
        </p>
      </div>
    </div>
  )
}

Login.propTypes = {
  closeModal: PropTypes.func.isRequired,
  switchToRegister: PropTypes.func.isRequired
}

export default Login
