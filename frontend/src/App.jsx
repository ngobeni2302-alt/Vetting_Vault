import { useEffect, useState } from 'react';
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

const candidateJobs = [
  {
    id: 'fraud-analyst',
    title: 'Junior Fraud Analyst',
    company: 'Nedbank Group',
    location: 'Johannesburg, Gauteng',
    type: 'Full-time',
    posted: '2 days ago'
  },
  {
    id: 'compliance-associate',
    title: 'Compliance Screening Associate',
    company: 'Discovery Limited',
    location: 'Sandton, Gauteng',
    type: 'Hybrid',
    posted: '1 week ago'
  },
  {
    id: 'hr-coordinator',
    title: 'HR Vetting Coordinator',
    company: 'Shoprite Group',
    location: 'Cape Town, Western Cape',
    type: 'Full-time',
    posted: '3 days ago'
  },
  {
    id: 'background-check-specialist',
    title: 'Background Check Specialist',
    company: 'Standard Bank',
    location: 'Remote, South Africa',
    type: 'Remote',
    posted: 'Today'
  }
];

const qualificationOptions = [
  'High School / Matric / Grade 12',
  'Certificate',
  'Diploma',
  'Advanced Diploma',
  'Associate Degree',
  "Bachelor's Degree",
  'Honours Degree',
  'Postgraduate Certificate',
  'Postgraduate Diploma',
  "Master's Degree",
  'Doctorate / PhD'
];

const provinceOptions = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape'
];

function App() {
  const [role, setRole] = useState(null);
  const [message, setMessage] = useState('');
  const [session, setSession] = useState(null);
  const [planeProfile, setPlaneProfile] = useState(null);
  const [planeError, setPlaneError] = useState('');

  useEffect(() => {
    if (!session?.token) {
      setPlaneProfile(null);
      return;
    }

    let isCurrent = true;
    const loadProfile = session.role === 'CANDIDATE'
      ? api.getCandidateProfile
      : api.getEmployerProfile;

    setPlaneError('');
    loadProfile(session.token)
      .then((profile) => {
        if (isCurrent) {
          setPlaneProfile(profile);
        }
      })
      .catch((err) => {
        if (isCurrent) {
          setPlaneError(err.message);
          setPlaneProfile(null);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [session]);

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
            setSession(null);
          }}
        />
        <RoleCard
          title="Employer"
          description="Corporate-only onboarding with disposable email blocking."
          active={role === 'employer'}
          onClick={() => {
            setRole('employer');
            setMessage('');
            setSession(null);
          }}
        />
      </section>

      {!session && role === 'candidate' && (
        <CandidatePlane onAuthenticated={(nextSession) => {
          setMessage(nextSession.message);
          setSession(nextSession);
        }} />
      )}

      {!session && role === 'employer' && (
        <EmployerPlane onAuthenticated={(nextSession) => {
          setMessage(nextSession.message);
          setSession(nextSession);
        }} />
      )}

      {session?.role === 'CANDIDATE' && (
        <CandidateWorkspace
          profile={planeProfile}
          error={planeError}
          onLogout={() => {
            setSession(null);
            setMessage('Candidate session ended.');
          }}
        />
      )}

      {session?.role === 'EMPLOYER' && (
        <EmployerWorkspace
          profile={planeProfile}
          error={planeError}
          onLogout={() => {
            setSession(null);
            setMessage('Employer session ended.');
          }}
        />
      )}

      {(message || session) && (
        <section className="status-panel">
          {message && <p className="status-message">{message}</p>}
          {session && (
            <div className="token-box">
              <p><strong>Role:</strong> {session.role}</p>
              <p><strong>Expires:</strong> {session.expiresAt}</p>
              <p className="token"><strong>JWT:</strong> {session.token}</p>
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

function CandidatePlane({ onAuthenticated }) {
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
          const response = await api.registerCandidate(payload);
          onAuthenticated(response);
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
          onAuthenticated(response);
        }}
      />
    </section>
  );
}

function EmployerPlane({ onAuthenticated }) {
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
          const response = await api.registerEmployer(payload);
          onAuthenticated(response);
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
          onAuthenticated(response);
        }}
      />
    </section>
  );
}

function CandidateWorkspace({ profile, error, onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const candidateName = [profile?.name, profile?.surname].filter(Boolean).join(' ');
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const visibleJobs = candidateJobs.filter((job) => {
    const searchable = `${job.title} ${job.company} ${job.location} ${job.type}`.toLowerCase();
    return searchable.includes(normalizedSearch);
  });

  return (
    <section className="workspace candidate-workspace">
      <CandidateJobSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        jobs={visibleJobs}
      />
      <WorkspaceHeader
        title="Candidate Workspace"
        eyebrow={candidateName || profile?.plane}
        profile={profile}
        error={error}
        onLogout={onLogout}
      />
      <CandidateProfileForm profile={profile} />
    </section>
  );
}

function EmployerWorkspace({ profile, error, onLogout }) {
  return (
    <section className="workspace employer-workspace">
      <WorkspaceHeader
        title="Employer Workspace"
        eyebrow={profile?.plane}
        profile={profile}
        error={error}
        onLogout={onLogout}
      />
      <div className="workspace-grid">
        <ActionPanel
          title="Candidate Pipeline"
          items={['Create vetting requests', 'Review candidate submissions', 'Move applicants through screening stages']}
        />
        <ActionPanel
          title="Company Controls"
          items={['Manage corporate access', 'Keep compliance details current', 'Use only verified work contact points']}
        />
        <ActionPanel
          title="Screening Queue"
          items={['Check pending verifications', 'Resolve flagged records', 'Export hiring-ready summaries']}
        />
      </div>
    </section>
  );
}

function CandidateJobSearch({ searchTerm, onSearchChange, jobs }) {
  return (
    <div className="candidate-search">
      <label className="job-search-label" htmlFor="candidate-job-search">
        <span>Search jobs</span>
        <input
          id="candidate-job-search"
          type="search"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by role, company, location, or work type"
          autoComplete="off"
        />
      </label>

      <div className="job-results" aria-live="polite">
        {jobs.length > 0 ? jobs.map((job) => (
          <article className="job-result" key={job.id}>
            <div>
              <h3>{job.title}</h3>
              <p>{job.company}</p>
              <span>{job.location}</span>
            </div>
            <div className="job-meta">
              <span>{job.type}</span>
              <span>{job.posted}</span>
            </div>
          </article>
        )) : (
          <p className="empty-results">No jobs match that search.</p>
        )}
      </div>
    </div>
  );
}

function CandidateProfileForm({ profile }) {
  const [formData, setFormData] = useState(() => buildCandidateProfile(profile));
  const [documents, setDocuments] = useState([]);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    setFormData(buildCandidateProfile(profile));
    setDocuments([]);
    setSavedMessage('');
  }, [profile]);

  const sections = [
    {
      legend: 'Personal Information',
      fields: [
        { name: 'name', label: 'First Name', type: 'text' },
        { name: 'surname', label: 'Surname', type: 'text' },
        { name: 'idNumber', label: 'ID Number', type: 'text', inputMode: 'numeric' },
        { name: 'dateOfBirth', label: 'Date of Birth', type: 'date' }
      ]
    },
    {
      legend: 'Contact Details',
      fields: [
        { name: 'emailAddress', label: 'Email Address', type: 'email' },
        { name: 'phoneNumber', label: 'Phone Number', type: 'tel' },
        { name: 'city', label: 'City', type: 'text' },
        { name: 'province', label: 'Province', type: 'select', options: provinceOptions, placeholder: 'Select province' }
      ]
    },
    {
      legend: 'Application Details',
      fields: [
        { name: 'desiredRole', label: 'Desired Role', type: 'text' },
        { name: 'highestQualification', label: 'Highest Qualification', type: 'select', options: qualificationOptions },
        { name: 'yearsExperience', label: 'Years of Experience', type: 'number', min: '0' },
        { name: 'availability', label: 'Availability', type: 'text' }
      ]
    }
  ];

  return (
    <form
      className="application-form"
      onSubmit={(event) => {
        event.preventDefault();
        setSavedMessage('Profile details saved for this session.');
      }}
    >
      <div className="application-form-header">
        <div>
          <p className="eyebrow">Profile</p>
          <h3>Candidate Application Form</h3>
        </div>
        <button type="submit">Save profile</button>
      </div>

      {sections.map((section) => (
        <fieldset key={section.legend}>
          <legend>{section.legend}</legend>
          <div className="application-fields">
            {section.fields.map((field) => (
              <label key={field.name}>
                <span>{field.label}</span>
                {field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={formData[field.name]}
                    onChange={(event) => setFormData((current) => ({
                      ...current,
                      [field.name]: event.target.value
                    }))}
                  >
                    <option value="">{field.placeholder || 'Select option'}</option>
                    {field.options.map((option) => (
                      <option value={option} key={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={(event) => setFormData((current) => ({
                      ...current,
                      [field.name]: event.target.value
                    }))}
                    inputMode={field.inputMode}
                    min={field.min}
                    autoComplete="off"
                  />
                )}
              </label>
            ))}
          </div>
        </fieldset>
      ))}

      <label className="full-span">
        <span>Professional Summary</span>
        <textarea
          name="summary"
          value={formData.summary}
          onChange={(event) => setFormData((current) => ({
            ...current,
            summary: event.target.value
          }))}
          rows="4"
        />
      </label>

      <fieldset>
        <legend>Supporting Documents</legend>
        <div className="document-upload-grid">
          {[
            { name: 'cv', label: 'CV or Resume' },
            { name: 'identityDocument', label: 'Identity Document' },
            { name: 'qualification', label: 'Qualification Certificate' },
            { name: 'consentForm', label: 'Consent Form' }
          ].map((documentType) => (
            <label className="document-upload" key={documentType.name}>
              <span>{documentType.label}</span>
              <input
                type="file"
                name={documentType.name}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(event) => {
                  const [file] = event.target.files;

                  if (!file) {
                    return;
                  }

                  setDocuments((current) => [
                    ...current.filter((document) => document.type !== documentType.name),
                    {
                      type: documentType.name,
                      label: documentType.label,
                      name: file.name,
                      size: file.size
                    }
                  ]);
                }}
              />
            </label>
          ))}
        </div>

        <div className="submitted-documents">
          <h4>Submitted Documents</h4>
          {documents.length > 0 ? (
            <ul>
              {documents.map((document) => (
                <li key={document.type}>
                  <span>{document.label}</span>
                  <strong>{document.name}</strong>
                  <small>{formatFileSize(document.size)}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p>No documents submitted yet.</p>
          )}
        </div>
      </fieldset>

      {savedMessage && <p className="save-message">{savedMessage}</p>}
    </form>
  );
}

function formatFileSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function buildCandidateProfile(profile) {
  return {
    name: profile?.name || '',
    surname: profile?.surname || '',
    idNumber: '',
    dateOfBirth: '',
    emailAddress: profile?.emailAddress || profile?.subject || '',
    phoneNumber: profile?.phoneNumber || '',
    city: '',
    province: '',
    desiredRole: '',
    highestQualification: '',
    yearsExperience: '',
    availability: '',
    summary: ''
  };
}

function WorkspaceHeader({ title, eyebrow, profile, error, onLogout }) {
  return (
    <div className="workspace-header">
      <div>
        <p className="eyebrow">{eyebrow || 'Loading secure plane'}</p>
        <h2>{title}</h2>
        <p>{error || profile?.message || 'Checking your protected access...'}</p>
        {profile?.subject && <p className="subject-line">{profile.subject}</p>}
      </div>
      <button type="button" onClick={onLogout}>Log out</button>
    </div>
  );
}

function ActionPanel({ title, items }) {
  return (
    <article className="action-panel">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </article>
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
