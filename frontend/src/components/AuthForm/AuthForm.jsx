import './AuthForm.css';

function AuthForm({
  formValues,
  onSubmit,
  onUpdateField,
  submitLabel,
  showPseudo = false,
}) {
  return (
    <form className="AuthForm" onSubmit={onSubmit}>
      <label className="AuthForm-field">
        Mail
        <input
          required
          type="email"
          value={formValues.email}
          onChange={(event) => onUpdateField('email', event.target.value)}
        />
      </label>

      {showPseudo && (
        <label className="AuthForm-field">
          Pseudo
          <input
            required
            value={formValues.displayName}
            onChange={(event) =>
              onUpdateField('displayName', event.target.value)
            }
          />
        </label>
      )}

      <div className="AuthForm-actions">
        <button className="AuthForm-submit" type="submit">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

export default AuthForm;
