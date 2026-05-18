import { useState } from 'react';
import { api } from './api';

const initialCandidateRegister = {
  name: '',
  surname: '',
  idNumber: '',
  emailAddress: '',
  phoneNumber: ''
};

const initialCandidateLogin = {
  emailAddress: '',
  idNumber: ''
};

const initialEmployerRegister = {
  companyName: '',
  corporateEmail: '',
  workPhoneNumber: '',
  password: ''
};

const initialEmployerLogin = {
  corporateEmail: '',
  password: ''
};

function App() {
  const [role, setRole] = useState(null);
  const [message, setMessage] = useState('');
  const [tokenInfo, setTokenInfo] = useState(null);

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Secure-by-Design Recruitment</p>
          <h1>VettingVault Onboarding</h1>
          <p className="lede">
            Separate candidate and employer access from the very first screen, with validation and security policy enforcement built into each path.
          </p>
        </div>
        <div className="security-panel">
          <p>Security Boundaries</p>
          <ul>
            <li>Dedicated candidate plane</li>
            <li>Dedicated employer plane</li>
            <li>JWT session issuance on login</li>
            <li>Disposable email interception for employers</li>
          </ul>
        </div>
      </header>

      <section className="split-view">
        <RoleCard
          title="Candidate"
          description="Identity-first registration and ID-number backed login."
          active={role === 'candidate'}
          onClick={() => {
            setRole('candidate');
            setMessage('');
            setTokenInfo(null);
          }}
        />
        <RoleCard
          title="Employer"
          description="Corporate-only onboarding with disposable email blocking."
          active={role === 'employer'}
          onClick={() => {
            setRole('employer');
            setMessage('');
            setTokenInfo(null);
          }}
        />
      </section>

      {role === 'candidate' && (
        <CandidatePlane
          onResult={(nextMessage, nextToken) => {
            setMessage(nextMessage);
            setTokenInfo(nextToken || null);
          }}
        />
      )}

      {role === 'employer' && (
        <EmployerPlane
          onResult={(nextMessage, nextToken) => {
            setMessage(nextMessage);
            setTokenInfo(nextToken || null);
          }}
        />
      )}

      {(message || tokenInfo) && (
        <section className="status-panel">
          {message && <p className="status-message">{message}</p>}
          {tokenInfo && (
            <div className="token-box">
              <p><strong>Role:</strong> {tokenInfo.role}</p>
              <p><strong>Expires:</strong> {tokenInfo.expiresAt}</p>
              <p className="token"><strong>JWT:</strong> {tokenInfo.token}</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function RoleCard({ title, description, active, onClick }) {
  return (
    <button type="button" className={`role-card ${active ? 'active' : ''}`} onClick={onClick}>
      <span>{title}</span>
      <p>{description}</p>
    </button>
  );
}

function CandidatePlane({ onResult }) {
  return (
    <section className="plane-grid">
      <FormCard
        title="Candidate Registration"
        subtitle="Restricted to identity-backed candidate onboarding."
        initialState={initialCandidateRegister}
        fields={[
          { name: 'name', label: 'Name', type: 'text' },
          { name: 'surname', label: 'Surname', type: 'text' },
          { name: 'idNumber', label: 'ID Number', type: 'text', pattern: '[0-9]{13}', title: 'ID Number must contain exactly 13 digits', inputMode: 'numeric' },
          { name: 'emailAddress', label: 'Email Address', type: 'email' },
          { name: 'phoneNumber', label: 'Phone Number', type: 'tel', pattern: '\\+?[0-9]{10,15}', title: 'Phone number must contain 10 to 15 digits', inputMode: 'tel' }
        ]}
        buttonLabel="Register Candidate"
        action={async (payload) => {
          await api.registerCandidate(payload);
          onResult('Candidate registered successfully.', null);
        }}
      />
      <FormCard
        title="Candidate Login"
        subtitle="Email plus validated ID number login."
        initialState={initialCandidateLogin}
        fields={[
          { name: 'emailAddress', label: 'Email Address', type: 'email' },
          { name: 'idNumber', label: 'ID Number', type: 'text', pattern: '[0-9]{13}', title: 'ID Number must contain exactly 13 digits', inputMode: 'numeric' }
        ]}
        buttonLabel="Login Candidate"
        action={async (payload) => {
          const response = await api.loginCandidate(payload);
          onResult('Candidate login succeeded.', response);
        }}
      />
    </section>
  );
}

function EmployerPlane({ onResult }) {
  return (
    <section className="plane-grid">
      <FormCard
        title="Employer Registration"
        subtitle="Corporate access only. Disposable domains are blocked."
        initialState={initialEmployerRegister}
        fields={[
          { name: 'companyName', label: 'Company Name', type: 'text' },
          { name: 'corporateEmail', label: 'Corporate Email', type: 'email' },
          { name: 'workPhoneNumber', label: 'Work Phone Number', type: 'tel', pattern: '\\+?[0-9]{10,15}', title: 'Work phone number must contain 10 to 15 digits', inputMode: 'tel' },
          { name: 'password', label: 'Secure Password', type: 'password', minLength: 12, title: 'Password must be at least 12 characters long' }
        ]}
        buttonLabel="Register Employer"
        action={async (payload) => {
          await api.registerEmployer(payload);
          onResult('Employer registered successfully.', null);
        }}
      />
      <FormCard
        title="Employer Login"
        subtitle="Password-protected employer plane session."
        initialState={initialEmployerLogin}
        fields={[
          { name: 'corporateEmail', label: 'Corporate Email', type: 'email' },
          { name: 'password', label: 'Password', type: 'password' }
        ]}
        buttonLabel="Login Employer"
        action={async (payload) => {
          const response = await api.loginEmployer(payload);
          onResult('Employer login succeeded.', response);
        }}
      />
    </section>
  );
}

function FormCard({ title, subtitle, initialState, fields, buttonLabel, action }) {
  const [formData, setFormData] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await action(formData);
      setFormData(initialState);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="card-header">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      {fields.map((field) => (
        <label key={field.name}>
          <span>{field.label}</span>
          <input
            type={field.type}
            name={field.name}
            value={formData[field.name]}
            onChange={(event) => setFormData((current) => ({
              ...current,
              [field.name]: event.target.value
            }))}
            pattern={field.pattern}
            title={field.title}
            minLength={field.minLength}
            inputMode={field.inputMode}
            required
            autoComplete="off"
          />
        </label>
      ))}

      {error && <p className="error-banner">{error}</p>}
      <button type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : buttonLabel}
      </button>
    </form>
  );
}

export default App;
