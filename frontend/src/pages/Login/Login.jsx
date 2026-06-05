import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthForm from '../../components/AuthForm/AuthForm';
import { buildProfile } from '../../services/authProfile';
import '../Auth/AuthPage.css';

const DEFAULT_FORM_VALUES = {
  email: '',
  displayName: '',
};

function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    ...DEFAULT_FORM_VALUES,
    email: location.state?.email || '',
  });
  const [savedProfile, setSavedProfile] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const [loginSuccess, setLoginSuccess] = useState(null);

  const updateFormValue = (fieldName, fieldValue) => {
    setFormValues({
      ...formValues,
      [fieldName]: fieldValue,
    });
  };

  const loginWithEmail = (event) => {
    event.preventDefault();
    console.log('CLICK LOGIN');
    console.log('EMAIL:', formValues.email);
    console.log('BACKEND:', import.meta.env.VITE_BACKEND_URL);

    setLoginError(null);
    setLoginSuccess(null);

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/users`)
      .then((response) => {
        console.log('USERS RESPONSE:', response.data);

        const users = response.data.users || response.data;

        const user = users.find(
          (currentUser) => currentUser.email === formValues.email.trim()
        );

        console.log('FOUND USER:', user);
        console.log('USER NICKNAME:', user.nickname);

        if (user === undefined) {
          navigate('/signup', {
            state: { email: formValues.email },
          });

          return;
        }

        const profile = buildProfile({ user });

        localStorage.setItem(
          'currentUser',
          JSON.stringify({
            id: user.id,
            email: user.email,
            nickname: user.nickname,
          })
        );

        window.location.href = '/';
      })
      .catch((error) => {
        console.error('LOGIN ERROR:', error);
        setLoginError('Adresse email non reconnue.');
      });
  };

  const clearProfile = () => {
    localStorage.removeItem('currentUser');
    setSavedProfile(null);
    setFormValues(DEFAULT_FORM_VALUES);
    setLoginError(null);
    setLoginSuccess(null);
  };

  return (
    <main className="AuthPage">
      <section className="AuthPage-panel">
        <div className="AuthPage-copy">
          <h1>Connexion</h1>
          <p>Connecte-toi avec ton mail pour retrouver ton profil Flouflix.</p>
        </div>

        <div className="AuthPage-formArea">
          <AuthForm
            formValues={formValues}
            submitLabel="Se connecter"
            onSubmit={loginWithEmail}
            onUpdateField={updateFormValue}
          />

          <p className="AuthPage-link">
            Pas encore de compte ? <Link to="/signup">Creer un compte</Link>
          </p>

          {loginSuccess !== null && (
            <div className="AuthPage-message-success">{loginSuccess}</div>
          )}
          {loginError !== null && (
            <div className="AuthPage-message-error">{loginError}</div>
          )}
        </div>
      </section>

      {savedProfile !== null && (
        <section className="AuthPage-summary">
          <h2>User connecte</h2>
          <p>{savedProfile.displayName}</p>
          <span>ID user: {savedProfile.userId}</span>
          <button
            className="AuthPage-secondary"
            type="button"
            onClick={clearProfile}
          >
            Reinitialiser
          </button>
        </section>
      )}
    </main>
  );
}

export default Login;
