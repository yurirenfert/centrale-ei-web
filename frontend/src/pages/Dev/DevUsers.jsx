import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dev.css';

function DevUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/dev/users`)
      .then((response) => {
        setUsers(response.data.users || []);
      })
      .catch((error) => {
        console.error(error);
        setError('Impossible de charger les users.');
      });
  }, []);

  const loginAsUser = (user) => {
    localStorage.setItem(
      'currentUser',
      JSON.stringify({
        id: user.id,
        email: user.email,
        nickname: user.nickname,
      })
    );

    navigate('/');
  };

  return (
    <main className="Dev-container">
      <h1>Dev · Users</h1>

      {error && <p>{error}</p>}

      <div className="Dev-actions">
        {users.map((user) => (
          <div key={user.id} className="Dev-user-row">
            <span>
              {user.nickname} — {user.email}
            </span>

            <button className="Dev-link" onClick={() => loginAsUser(user)}>
              Prendre sa place
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

export default DevUsers;
