import { useState, useEffect, useContext, createContext } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, Navigate, Outlet, NavLink } from 'react-router-dom';
import styled, { createGlobalStyle, css } from 'styled-components';


const tokens = {
  bg: '#0f172a',
  surface: '#111827',
  surfaceAlt: '#151f38',
  text: '#e2e8f0',
  muted: '#94a3b8',
  border: 'rgba(148, 163, 184, 0.24)',
  primary: '#7c3aed',
  primaryStrong: '#8b5cf6',
  success: '#22c55e',
  danger: '#ef4444',
  shadow: '0 24px 80px rgba(15, 23, 42, 0.35)',
};


const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }

  html, body, #root { min-height: 100%; }

  body {
    margin: 0;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background:
      radial-gradient(circle at top left, rgba(124,58,237,0.18), transparent 28%),
      radial-gradient(circle at top right, rgba(59,130,246,0.14), transparent 20%),
      linear-gradient(180deg, #020617 0%, #0b1225 45%, #0f172a 100%);
    color: ${tokens.text};
    background-attachment: fixed;
  }

  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background: linear-gradient(180deg, rgba(255,255,255,0.03), transparent 40%);
    pointer-events: none;
  }

  button { font: inherit; cursor: pointer; }
`;


const PageContainer = styled.div`
  width: min(100%, 720px);
  margin: 64px auto 48px;
  padding: 44px 32px;
  background: rgba(15, 23, 42, 0.88);
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 32px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(14px);

  h1, h2 { margin: 0 0 18px; line-height: 1.08; }
  p { color: ${tokens.muted}; line-height: 1.8; }

  /* tablet */
  @media (max-width: 940px) {
    width: 100%;
    margin: 48px 16px 24px;
    padding: 28px 18px;
  }

  /* mobile */
  @media (max-width: 480px) {
    margin: 24px 8px 16px;
    padding: 20px 14px;
    border-radius: 20px;
    h1 { font-size: 1.5rem; }
    h2 { font-size: 1.25rem; }
  }
`;

const FormGrid = styled.div`
  display: grid;
  gap: 18px;
  margin-top: 24px;

  label {
    display: grid;
    gap: 10px;
    font-size: 0.95rem;
    color: #cbd5e1;
  }

  input, textarea {
    width: 100%;
    padding: 16px 18px;
    border-radius: 18px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    background: rgba(255, 255, 255, 0.04);
    color: ${tokens.text};
    transition: border-color 0.2s ease, transform 0.2s ease;
    font: inherit;

    &.error  { border-color: rgba(239, 68, 68, 0.45); }
    &.ok     { border-color: rgba(34, 197, 94, 0.35); }
    &:focus  { outline: none; border-color: rgba(124, 58, 237, 0.45); transform: translateY(-1px); }
  }

  textarea {
    resize: vertical;
    min-height: 140px;
  }

  @media (max-width: 480px) {
    gap: 14px;
    input, textarea { padding: 12px 14px; }
  }
`;

const FieldMsg = styled.span`
  display: block;
  min-height: 1.2rem;
  margin-top: 6px;
  font-size: 0.9rem;
  color: ${({ $status }) =>
    $status === 'error' ? tokens.danger :
    $status === 'ok'    ? tokens.success :
    tokens.muted};
`;

const Btn = styled.button`
  min-height: 48px;
  padding: 0 20px;
  border-radius: 999px;
  border: 1px solid transparent;
  color: white;
  transition: transform 0.2s ease, filter 0.2s ease;

  ${({ $variant }) => $variant === 'secondary' ? css`
    background: rgba(148, 163, 184, 0.12);
    color: ${tokens.text};
    box-shadow: none;
    &:hover { background: rgba(148, 163, 184, 0.24); }
  ` : css`
    background: linear-gradient(135deg, ${tokens.primary}, ${tokens.primaryStrong});
    box-shadow: 0 20px 40px rgba(124, 58, 237, 0.2);
    &:hover { transform: translateY(-1px); filter: brightness(1.06); }
  `}

  @media (max-width: 480px) {
    min-height: 42px;
    padding: 0 14px;
    font-size: 0.9rem;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 18px;

  @media (max-width: 480px) {
    gap: 8px;
    ${Btn} { flex: 1 1 calc(50% - 4px); text-align: center; }
  }
`;

const RecipeCard = styled.button`
  width: 100%;
  text-align: left;
  padding: 24px;
  margin-bottom: 16px;
  border-radius: 24px;
  margin-top: 15px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(148, 163, 184, 0.16);
  color: ${tokens.text};
  transition: transform 0.2s ease, background 0.2s ease;

  &:hover { transform: translateY(-2px); background: rgba(255, 255, 255, 0.07); }

  h3 { margin: 0 0 8px; font-size: 1.1rem; }
  p  { margin: 0; color: ${tokens.muted}; font-size: 0.9rem; line-height: 1.5; }

  @media (max-width: 480px) {
    padding: 16px;
    border-radius: 16px;
  }
`;

const Tag = styled.span`
  display: inline-block;
  font-size: 0.8rem;
  color: ${tokens.muted};
  margin-top: 6px;
`;

const ErrorText = styled.p`
  color: ${tokens.danger};
  margin: 0;
`;

const ToastBox = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  max-width: 360px;
  padding: 14px 18px;
  border-radius: 16px;
  color: #fff;
  font-weight: 600;
  box-shadow: ${tokens.shadow};
  z-index: 99;
  background: ${({ $type }) => $type === 'success' ? '#16a34a' : '#dc2626'};

  @media (max-width: 480px) {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: 100%;
  }
`;

const FeaturedSection = styled.div`
  margin-top: 32px;
  h2 { margin-bottom: 16px; color: ${tokens.text}; }
`;

const MutedMsg = styled.p`
  color: ${tokens.muted};
  font-size: 0.95rem;
`;


const AdminLayout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const AdminHeader = styled.header`
  position: fixed;
  inset: 0 0 auto 0;
  height: 68px;
  padding: 0 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(15, 23, 42, 0.98);
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  backdrop-filter: blur(14px);
  z-index: 20;

  strong { display: block; font-size: 1rem; letter-spacing: 0.04em; }
  span   { display: block; margin-top: 4px; color: ${tokens.muted}; font-size: 0.95rem; }

  @media (max-width: 680px) {
    padding: 0 14px;
    height: 58px;
    strong { font-size: 0.9rem; }
    span   { display: none; }
  }
`;

const AdminBody = styled.div`
  display: flex;
  margin-top: 68px;
  min-height: calc(100vh - 68px - 56px);

  @media (max-width: 940px) {
    flex-direction: column;
    margin-top: 68px;
  }

  @media (max-width: 680px) {
    margin-top: 58px;
  }
`;

const AdminSidebar = styled.aside`
  position: fixed;
  top: 68px;
  left: 0;
  bottom: 0;
  width: 240px;
  padding: 24px 18px;
  background: rgba(15, 23, 42, 0.96);
  border-right: 1px solid rgba(148, 163, 184, 0.1);
  display: flex;
  flex-direction: column;
  gap: 14px;

  @media (max-width: 940px) {
    position: static;
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    border-right: none;
    border-bottom: 1px solid rgba(148, 163, 184, 0.1);
    padding: 12px 18px;
    gap: 8px;
  }

  @media (max-width: 480px) {
    padding: 10px 14px;
    gap: 6px;
  }
`;

const AdminLink = styled(NavLink)`
  width: 100%;
  padding: 14px 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  color: ${tokens.text};
  border: 1px solid rgba(148, 163, 184, 0.16);
  text-align: left;
  text-decoration: none;
  display: inline-flex;
  align-items: center;

  &.active {
    background: rgba(124, 58, 237, 0.22);
    border-color: rgba(124, 58, 237, 0.35);
  }

  &:hover { background: rgba(255, 255, 255, 0.08); }

  @media (max-width: 940px) {
    width: auto;
    padding: 10px 14px;
    font-size: 0.9rem;
  }
`;

const AdminContent = styled.main`
  margin-left: 240px;
  width: calc(100% - 240px);
  padding: 34px 28px 90px;

  @media (max-width: 940px) {
    width: 100%;
    margin-left: 0;
    padding: 24px 18px 90px;
  }

  @media (max-width: 480px) {
    padding: 16px 14px 80px;
  }
`;

const AdminFooter = styled.footer`
  position: fixed;
  left: 240px;
  right: 0;
  bottom: 0;
  height: 56px;
  padding: 0 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: rgba(15, 23, 42, 0.98);
  border-top: 1px solid rgba(148, 163, 184, 0.1);
  backdrop-filter: blur(14px);
  z-index: 20;
  color: ${tokens.muted};
  font-size: 0.9rem;

  @media (max-width: 940px) {
    position: static;
    left: auto;
    width: auto;
    margin: 0 16px 16px;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0 14px;
  }
`;

const AdminCard = styled.div`
  padding: 20px;
  margin-bottom: 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(148, 163, 184, 0.14);

  @media (max-width: 480px) {
    padding: 14px;
    border-radius: 14px;
  }
`;

const LS_KEY          = 'chefProUsers';
const LS_CURRENT_USER = 'chefProCurrentUser';
const LS_RECIPES      = 'chefProRecipes';
const LS_RECIPES_SEEDED = 'chefProRecipesSeeded';

const API_BASE = 'https://api-receitas-pi.vercel.app';

async function fetchRecipesFromAPI() {
  try {
    const response = await fetch(
      `${API_BASE}/receitas/todas?page=1&limit=20`
    );

    const data = await response.json();

    console.log('STATUS:', response.status);
    console.log('DATA:', data);

    return (data.items || []).map((receita) => ({
      id: receita.id,
      nome: receita.receita,
      ingredientes: receita.ingredientes
        ? receita.ingredientes
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
        : [],
      preparo: receita.modo_preparo,
      categoria: receita.tipo,
      fonte: 'API Receitas',
      imagem: receita.link_imagem,
    }));
  } catch (error) {
    console.error('Erro ao buscar receitas:', error);
    return [];
  }
}
const getRecipes      = () => JSON.parse(localStorage.getItem(LS_RECIPES) || '[]');
const saveRecipes     = (r) => localStorage.setItem(LS_RECIPES, JSON.stringify(r));
const getUsers        = () => JSON.parse(localStorage.getItem(LS_KEY) || '[]');
const saveUsers       = (u) => localStorage.setItem(LS_KEY, JSON.stringify(u));
const getCurrentUser  = () => JSON.parse(localStorage.getItem(LS_CURRENT_USER) || 'null');
const saveCurrentUser = (u) => localStorage.setItem(LS_CURRENT_USER, JSON.stringify(u));
const clearCurrentUser = () => localStorage.removeItem(LS_CURRENT_USER);

const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

const validations = {
  email: (v) => (/\S+@\S+\.\S+/.test(v) ? '' : 'Por favor, insira um endereço de email válido'),
  password: (v) => {
    if (v.length < 8)          return 'A senha deve conter pelo menos 8 caracteres';
    if (!/[A-Z]/.test(v))      return 'A senha deve conter pelo menos uma letra maiúscula';
    if (!/[a-z]/.test(v))      return 'A senha deve conter pelo menos uma letra minúscula';
    if (!/[0-9]/.test(v))      return 'A senha deve conter pelo menos um número';
    if (!/[!@#$%^&*?]/.test(v)) return 'A senha deve conter pelo menos um caractere especial (!@#$%^&*)';
    return '';
  },
  username: (v) => {
    const name = v.trim();
    if (['admin','root','superuser'].includes(name.toLowerCase()))
      return 'Este nome de usuário é reservado. Por favor, escolha outro.';
    if (name.length < 3)        return 'O nome de usuário deve conter pelo menos 3 caracteres';
    if (/[0-9]/.test(name))     return 'O nome de usuário não pode conter números';
    if (/[!@#$%^&*]/.test(name)) return 'O nome de usuário não pode conter caracteres especiais (!@#$%^&*)';
    return '';
  },
};

function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return <ToastBox $type={type}>{type === 'error' ? '❌' : '✅'} {msg}</ToastBox>;
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const users = getUsers();
    if (!users.some((u) => u.role === 'admin')) {
      saveUsers([...users, { email: 'admin@email.com', password: 'Admin123#', username: 'admin', role: 'admin' }]);
    }
    const cu = getCurrentUser();
    if (cu) setUser(cu);
  }, []);

  const login  = (u) => { saveCurrentUser(u); setUser(u); };
  const logout = ()  => { clearCurrentUser(); setUser(null); };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function ProtectedRoute({ role, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <PageContainer><p>Acesso negado</p></PageContainer>;
  return children;
}

function UserRegister({ showToast, clearToast }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const empty = { email: '', password: '', username: '' };
  const [form, setForm]       = useState(empty);
  const [touched, setTouched] = useState({});
  const [errors, setErrors]   = useState({});

  const validate = (name, value) => validations[name]?.(value) || '';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (touched[name]) setErrors((p) => ({ ...p, [name]: validate(name, value) }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    setErrors((p) => ({ ...p, [name]: validate(name, value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(form).forEach((f) => { newErrors[f] = validate(f, form[f]); });
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) {
      showToast({ msg: 'Corrija os erros antes de enviar', type: 'error' });
      return;
    }
    if (getUsers().find((u) => u.email === form.email)) {
      showToast({ msg: 'Email já cadastrado', type: 'error' }); return;
    }
    if (getUsers().find((u) => u.username === form.username)) {
      showToast({ msg: 'Nome de usuário já registrado. Por favor, escolha outro.', type: 'error' }); return;
    }
    const newUser = { ...form, role: 'user' };
    saveUsers([...getUsers(), newUser]);
    login(newUser);
    showToast({ msg: 'Cadastro efetuado com sucesso!', type: 'success' });
    setForm(empty); setTouched({}); setErrors({});
    navigate('/inicial');
  };

  const fieldStatus = (name) => {
    if (!touched[name]) return '';
    return errors[name] ? 'error' : 'ok';
  };

  return (
    <PageContainer>
      <h1>Cadastro</h1>
      <p>Crie sua conta para acessar receitas e o painel.</p>
      <FormGrid as="form" onSubmit={handleSubmit} noValidate>
        {[
          { name: 'email',    type: 'email',    label: 'Email',           placeholder: 'user@example.com' },
          { name: 'password', type: 'password', label: 'Senha',           placeholder: 'UserLegal123#' },
          { name: 'username', type: 'text',     label: 'Nome de usuário', placeholder: 'UserLegal' },
        ].map(({ name, type, label, placeholder }) => (
          <label key={name} htmlFor={name}>
            {label}
            <input
              id={name} name={name} type={type} placeholder={placeholder}
              value={form[name]} onChange={handleChange} onBlur={handleBlur}
              className={fieldStatus(name)}
            />
            <FieldMsg $status={fieldStatus(name)}>
              {touched[name] && errors[name] ? errors[name] : touched[name] && !errors[name] ? '✓ Ok' : ''}
            </FieldMsg>
          </label>
        ))}
        <ButtonRow>
          <Btn type="submit">Cadastrar</Btn>
          <Btn type="button" $variant="secondary" onClick={() => { setForm(empty); setTouched({}); setErrors({}); clearToast(); }}>Limpar</Btn>
          <Btn type="button" $variant="secondary" onClick={() => navigate('/login')}>Já tenho conta</Btn>
        </ButtonRow>
      </FormGrid>
    </PageContainer>
  );
}

function UserLogin({ showToast, clearToast }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const empty = { email: '', password: '' };
  const [form, setForm]     = useState(empty);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const existingUser = getUsers().find((u) => u.email === form.email && u.password === form.password);
    if (!existingUser) {
      setErrors({ submit: 'Email ou senha incorretos' });
      showToast({ msg: 'Email ou senha incorretos', type: 'error' });
      setForm((p) => ({ ...p, password: '' }));
      return;
    }
    login(existingUser);
    showToast({ msg: 'Login bem-sucedido!', type: 'success' });
    setForm(empty);
    navigate('/inicial');
  };

  return (
    <PageContainer>
      <h1>Login</h1>
      <p>Entre com seu email e senha para continuar.</p>
      <FormGrid as="form" onSubmit={handleSubmit} noValidate>
        {[
          { name: 'email',    type: 'email',    label: 'Email', placeholder: 'user@example.com' },
          { name: 'password', type: 'password', label: 'Senha', placeholder: 'UserLegal123#' },
        ].map(({ name, type, label, placeholder }) => (
          <label key={name} htmlFor={name}>
            {label}
            <input id={name} name={name} type={type} placeholder={placeholder} value={form[name]} onChange={handleChange} />
          </label>
        ))}
        {errors.submit && <ErrorText>{errors.submit}</ErrorText>}
        <ButtonRow>
          <Btn type="submit">Entrar</Btn>
          <Btn type="button" $variant="secondary" onClick={() => { setForm(empty); setErrors({}); clearToast(); }}>Limpar</Btn>
          <Btn type="button" $variant="secondary" onClick={() => navigate('/register')}>Criar conta</Btn>
        </ButtonRow>
      </FormGrid>
    </PageContainer>
  );
}

function LandingPage() {
  const navigate = useNavigate();
  const { user }  = useAuth();
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes]   = useState(false);
  const [fetchError, setFetchError]           = useState('');

  useEffect(() => { if (user) navigate('/inicial'); }, [user, navigate]);

  useEffect(() => {
    const existing = getRecipes();
    const seeded   = localStorage.getItem(LS_RECIPES_SEEDED);
    if (existing.length > 0) { setFeaturedRecipes(existing.slice(0, 3)); return; }
    if (seeded) return;
    setLoadingRecipes(true);
    fetchRecipesFromAPI()
      .then((recipes) => {
        if (recipes.length > 0) {
          saveRecipes(recipes);
          localStorage.setItem(LS_RECIPES_SEEDED, '1');
          setFeaturedRecipes(recipes.slice(0, 3));
        } else {
          setFetchError('Não foi possível carregar receitas da API.');
        }
      })
      .catch(() => setFetchError('Erro ao conectar à API de receitas.'))
      .finally(() => setLoadingRecipes(false));
  }, []);

  return (
    <PageContainer>
      <h1>Bem-vindo ao ChefPro!</h1>
      <p>Descubra deliciosas receitas culinárias e gerencie seu perfil. Faça login ou cadastre-se para começar.</p>
      <ButtonRow>
        <Btn onClick={() => navigate('/login')}>Entrar</Btn>
        <Btn $variant="secondary" onClick={() => navigate('/register')}>Cadastrar-se</Btn>
        <Btn $variant="secondary" onClick={() => navigate('/receitas')}>Ver Receitas</Btn>
      </ButtonRow>

      <FeaturedSection>
        <h2>Receitas em Destaque</h2>
        {loadingRecipes && <MutedMsg>⏳ Buscando receitas da API...</MutedMsg>}
        {fetchError    && <p style={{ color: tokens.danger, fontSize: '0.95rem' }}>⚠️ {fetchError}</p>}
        {!loadingRecipes && featuredRecipes.length > 0 && (
          <FormGrid>
            {featuredRecipes.map((r) => (
              <RecipeCard key={r.id} onClick={() => navigate(`/receitas/${r.id}`)}>
                <h3>{r.nome}</h3>
                <p>{r.ingredientes.slice(0, 3).join(', ')}{r.ingredientes.length > 3 ? '...' : ''}</p>
                {r.fonte && <Tag>Fonte: {r.fonte}</Tag>}
              </RecipeCard>
            ))}
          </FormGrid>
        )}
        {!loadingRecipes && !fetchError && featuredRecipes.length === 0 && (
          <MutedMsg>Nenhuma receita disponível ainda.</MutedMsg>
        )}
      </FeaturedSection>
    </PageContainer>
  );
}

function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (!user) { const t = setTimeout(() => navigate('/login'), 2000); return () => clearTimeout(t); }
  }, [user, navigate]);

  if (!user) return <PageContainer><p>Redirecionando para login...</p></PageContainer>;

  return (
    <PageContainer>
      <h1>Olá, {user.username || 'usuário'}!</h1>
      <p>Bem-vindo de volta ao ChefPro. Explore receitas e acesse o painel quando precisar.</p>
      <ButtonRow>
        <Btn onClick={() => navigate('/receitas')}>Ver Todas as Receitas</Btn>
        <Btn $variant="secondary" onClick={() => setShowProfile((p) => !p)}>
          {showProfile ? 'Ocultar perfil' : 'Exibir perfil'}
        </Btn>
        <Btn onClick={() => { logout(); navigate('/login'); }}>Sair</Btn>
        {user.role === 'admin' && <Btn onClick={() => navigate('/admin')}>Painel Admin</Btn>}
      </ButtonRow>
      {showProfile && (
        <RecipeCard as="div" style={{ cursor: 'default' }}>
          <p><strong>Nome de usuário:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Função:</strong> {user.role}</p>
        </RecipeCard>
      )}
    </PageContainer>
  );
}

function ListaDeReceitas() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id }   = useParams();
  const [receitas, setReceitas]       = useState([]);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [busca, setBusca]             = useState('');

  useEffect(() => {
    const existing = getRecipes();
    const seeded   = localStorage.getItem(LS_RECIPES_SEEDED);
    if (existing.length > 0) { setReceitas(existing); return; }
    if (seeded) return;
    setLoadingFetch(true);
    fetchRecipesFromAPI()
      .then((recipes) => {
        if (recipes.length > 0) { saveRecipes(recipes); localStorage.setItem(LS_RECIPES_SEEDED, '1'); setReceitas(recipes); }
      })
      .catch(console.warn)
      .finally(() => setLoadingFetch(false));
  }, []);

  if (loadingFetch) return <PageContainer><MutedMsg>⏳ Carregando receitas da API...</MutedMsg></PageContainer>;

  if (id) {
    const receita = receitas.find((item) => item.id === Number(id));
    if (!receita) return (
      <PageContainer>
        <RecipeCard as="div" style={{ cursor: 'default' }}>
          <p>Receita não encontrada</p>
          <ButtonRow><Btn $variant="secondary" onClick={() => navigate('/receitas')}>Voltar</Btn></ButtonRow>
        </RecipeCard>
      </PageContainer>
    );
    return (
      <PageContainer>
        <RecipeCard as="div" style={{ cursor: 'default' }}>
          <h2>{receita.nome}</h2>
          {receita.categoria && <Tag>Categoria: {receita.categoria}</Tag>}
          <p style={{ marginTop: 12 }}><strong>Ingredientes:</strong> {receita.ingredientes.join(', ')}</p>
          <p>{receita.preparo}</p>
          {receita.fonte && <Tag>Fonte: {receita.fonte}</Tag>}
          <ButtonRow><Btn $variant="secondary" onClick={() => navigate('/receitas')}>Voltar</Btn></ButtonRow>
        </RecipeCard>
      </PageContainer>
    );
  }

  const receitasFiltradas = receitas.filter((r) =>
    r.nome.toLowerCase().includes(busca.toLowerCase()) ||
    r.ingredientes.some((i) => i.toLowerCase().includes(busca.toLowerCase()))
  );

  return (
    <PageContainer>
      <h2>Receitas</h2>
      <FormGrid style={{ marginTop: 0, marginBottom: 8 }}>
        <label htmlFor="busca">
          Buscar receita
          <input id="busca" type="text" placeholder="Ex: frango, macarrão..." value={busca} onChange={(e) => setBusca(e.target.value)} />
        </label>
      </FormGrid>
      {receitas.length === 0 && <MutedMsg>Nenhuma receita disponível.</MutedMsg>}
      {receitasFiltradas.length === 0 && receitas.length > 0 && <MutedMsg>Nenhuma receita encontrada para "{busca}".</MutedMsg>}
      <FormGrid>
        {receitasFiltradas.map((r) => (
          <RecipeCard key={r.id} onClick={() => navigate(`/receitas/${r.id}`)}>
            <h3>{r.nome}</h3>
            <p>{r.ingredientes.slice(0, 4).join(', ')}{r.ingredientes.length > 4 ? '...' : ''}</p>
            {r.fonte && <Tag>Fonte: {r.fonte}</Tag>}
          </RecipeCard>
        ))}
      </FormGrid>
      <ButtonRow style={{ marginTop: 16 }}>
        {user
          ? <Btn $variant="secondary" onClick={() => navigate('/inicial')}>Página Inicial</Btn>
          : <Btn $variant="secondary" onClick={() => navigate('/')}>Voltar</Btn>}
      </ButtonRow>
    </PageContainer>
  );
}

function AdminLayoutPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <AdminHeader>
        <div>
          <strong>Admin ChefPro</strong>
          <span>{user?.username || 'Administrador'}</span>
        </div>
        <ButtonRow style={{ marginTop: 0 }}>
          <Btn $variant="secondary" onClick={() => navigate('/inicial')}>Home</Btn>
          <Btn $variant="secondary" onClick={() => navigate('/admin/lista')}>Lista</Btn>
          <Btn $variant="secondary" onClick={() => navigate('/admin/nova')}>Nova</Btn>
          <Btn $variant="secondary" onClick={() => { logout(); navigate('/login'); }}>Logout</Btn>
        </ButtonRow>
      </AdminHeader>

      <AdminBody>
        <AdminSidebar>
          <AdminLink to="lista" className={({ isActive }) => isActive ? 'active' : ''}>Lista de receitas</AdminLink>
          <AdminLink to="nova"  className={({ isActive }) => isActive ? 'active' : ''}>Nova receita</AdminLink>
          <Btn $variant="secondary" onClick={() => navigate('/receitas')}>Ver site</Btn>
        </AdminSidebar>
        <AdminContent><Outlet /></AdminContent>
      </AdminBody>

      <AdminFooter>
        <span>ChefPro Admin</span>
        <span>© 2026 • Gestão de receitas</span>
      </AdminFooter>
    </AdminLayout>
  );
}

function AdminNewPage() {
  const [form, setForm] = useState({ nome: '', ingredientes: '', preparo: '' });
  const navigate = useNavigate();

  const handleChange = (e) => { const { name, value } = e.target; setForm((p) => ({ ...p, [name]: value })); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRecipe = {
      id: Date.now(), ...form,
      ingredientes: form.ingredientes.split(',').map((i) => i.trim()).filter(Boolean),
    };
    saveRecipes([...getRecipes(), newRecipe]);
    navigate('/admin/lista');
  };

  return (
    <AdminCard>
      <h2>Criar nova receita</h2>
      <FormGrid as="form" onSubmit={handleSubmit}>
        <label>Nome<input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome da receita" /></label>
        <label>Ingredientes<input name="ingredientes" value={form.ingredientes} onChange={handleChange} placeholder="ovo, leite, farinha" /></label>
        <label>Preparo<textarea name="preparo" value={form.preparo} onChange={handleChange} placeholder="Modo de preparo" /></label>
        <ButtonRow>
          <Btn type="submit">Salvar</Btn>
          <Btn type="button" $variant="secondary" onClick={() => navigate('/admin/lista')}>Cancelar</Btn>
        </ButtonRow>
      </FormGrid>
    </AdminCard>
  );
}

function AdminEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm]     = useState({ nome: '', ingredientes: '', preparo: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const recipe = getRecipes().find((r) => r.id === Number(id));
    if (recipe) { setForm({ nome: recipe.nome, ingredientes: recipe.ingredientes.join(', '), preparo: recipe.preparo }); setLoading(false); }
    else navigate('/admin/lista');
  }, [id, navigate]);

  const handleChange = (e) => { const { name, value } = e.target; setForm((p) => ({ ...p, [name]: value })); };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveRecipes(getRecipes().map((r) =>
      r.id === Number(id) ? { ...r, ...form, ingredientes: form.ingredientes.split(',').map((i) => i.trim()).filter(Boolean) } : r
    ));
    navigate('/admin/lista');
  };

  if (loading) return <AdminCard><p>Carregando...</p></AdminCard>;

  return (
    <AdminCard>
      <h2>Editar receita</h2>
      <FormGrid as="form" onSubmit={handleSubmit}>
        <label>Nome<input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome da receita" /></label>
        <label>Ingredientes<input name="ingredientes" value={form.ingredientes} onChange={handleChange} placeholder="ovo, leite, farinha" /></label>
        <label>Preparo<textarea name="preparo" value={form.preparo} onChange={handleChange} placeholder="Modo de preparo" /></label>
        <ButtonRow>
          <Btn type="submit">Salvar Mudanças</Btn>
          <Btn type="button" $variant="secondary" onClick={() => navigate('/admin/lista')}>Cancelar</Btn>
        </ButtonRow>
      </FormGrid>
    </AdminCard>
  );
}

function AdminListPage() {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { setRecipes(getRecipes()); }, []);

  const handleDelete = (id) => {
    const updated = recipes.filter((r) => r.id !== id);
    setRecipes(updated); saveRecipes(updated);
  };

  return (
    <AdminCard>
      <h2>Lista de receitas</h2>
      {recipes.length === 0 ? (
        <MutedMsg>Nenhuma receita cadastrada.</MutedMsg>
      ) : (
        recipes.map((r) => (
          <RecipeCard as="div" key={r.id} style={{ cursor: 'default' }}>
            <h3>{r.nome}</h3>
            <p>{r.ingredientes.join(', ')}</p>
            <ButtonRow>
              <Btn onClick={() => navigate(`/admin/editar/${r.id}`)}>Editar</Btn>
              <Btn $variant="secondary" onClick={() => handleDelete(r.id)}>Deletar</Btn>
            </ButtonRow>
          </RecipeCard>
        ))
      )}
    </AdminCard>
  );
}

export default function App() {
  const [toast, setToast] = useState(null);
  const showToast = ({ msg, type }) => setToast({ msg, type });
  const clearToast = () => setToast(null);

  return (
    <AuthProvider>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/"         element={<LandingPage />} />
          <Route path="/register" element={<UserRegister showToast={showToast} clearToast={clearToast} />} />
          <Route path="/login"    element={<UserLogin    showToast={showToast} clearToast={clearToast} />} />
          <Route path="/inicial"  element={<DashboardPage />} />
          <Route path="/receitas"     element={<ListaDeReceitas />} />
          <Route path="/receitas/:id" element={<ListaDeReceitas />} />
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayoutPage /></ProtectedRoute>}>
            <Route index          element={<Navigate replace to="lista" />} />
            <Route path="lista"        element={<AdminListPage />} />
            <Route path="nova"         element={<AdminNewPage />} />
            <Route path="editar/:id"   element={<AdminEditPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={clearToast} />}
    </AuthProvider>
  );
}
