import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthForm from '../../components/AuthForm/AuthForm';
import '../Auth/AuthPage.css';

function Signup() {
  const location = useLocation();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    email: location.state?.email || '',
    displayName: location.state?.displayName || '',
  });
  const [signupError, setSignupError] = useState(null);

  const updateFormValue = (fieldName, fieldValue) => {
    setFormValues({
      ...formValues,
      [fieldName]: fieldValue,
    });
  };

  const createAccount = (event) => {
    console.log('CLICK SIGNUP');
    event.preventDefault();
    setSignupError(null);

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/dev/new`, {
        email: formValues.email.trim(),
        nickname: formValues.displayName.trim(),
      })
      .then(() => {
        navigate('/login', {
          state: { email: formValues.email },
        });
      })
      .catch((error) => {
        setSignupError(
          'Impossible de creer ce compte. Ce mail existe peut-etre deja.'
        );
        console.error(error);
      });
  };

  return (
    <main className="AuthPage">
      <section className="AuthPage-panel">
        <div className="AuthPage-copy">
          <p className="AuthPage-kicker">Nouveau profil</p>
          <h1>Creation</h1>
          <p>
            Cree ton compte avec un mail et un pseudo. Les preferences viendront
            plus tard, quand elles seront stockees en DB.
          </p>
        </div>

        <div className="AuthPage-formArea">
          <AuthForm
            formValues={formValues}
            showPseudo
            submitLabel="Creer le compte"
            onSubmit={createAccount}
            onUpdateField={updateFormValue}
          />

          <p className="AuthPage-link">
            Deja un compte ? <Link to="/login">Se connecter</Link>
          </p>

          {signupError !== null && (
            <div className="AuthPage-message-error">{signupError}</div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Signup;
