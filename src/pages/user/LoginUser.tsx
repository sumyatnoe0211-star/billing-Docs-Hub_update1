import { useState, ChangeEvent, JSX } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate, Link } from "react-router-dom";
import { colors, typography } from '../../theme';
import { STORAGE_KEY } from '../../constants/auth';

interface UserRow {
  id: string;
  email: string;
  password?: string;
  nickname?: string;
  avatar?: string;
  role?: string;
  approved?: boolean;
}

export default function LoginUser(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Enter email and password");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Check if user is approved (This logic should ideally be handled by RLS or a Supabase Function)
      const { data: userProfile, error: profileError } = await supabase
        .from("users")
        .select("approved")
        .eq("email", email)
        .single();

      if (profileError || !userProfile) {
        setError("Login failed: User not found. Ask admin to register your email.");
        setLoading(false);
        return;
      }

      if (!userProfile.approved) {
        setError("Your registration is pending admin approval.");
        setLoading(false);
        return;
      }

      // 2️⃣ Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        setError("Login failed: Invalid email or password.");
        setLoading(false);
        return;
      }

      // 3️⃣ Save user info (simplified for now, full profile fetched in LayoutUser)
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ email: data.user.email, id: data.user.id }));

      navigate("/user/documents", { replace: true });
    } catch (err: any) {
      console.error(err);
      setError("Something went wrong during login: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  return (
    <div style={{
      display: 'grid',
      placeItems: 'center',
      minHeight: '100vh',
      background: colors.background,
      padding: '2rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: colors.white,
        padding: '2rem',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        border: `1px solid ${colors.lightGray}`
      }}>
        <h1 style={{ marginBottom: '1rem', color: colors.primary, fontSize: typography.fontSizes.xLarge }}>Billing Docs Hub</h1>
        <h2 style={{ fontSize: typography.fontSizes.large, marginBottom: '1rem', color: colors.text }}>User Login</h2>

        <form onSubmit={handleLogin} style={{ display: 'grid', gap: '1rem' }}>
          <label style={{ color: colors.text }}>
            <span style={{ display: 'block', marginBottom: '.4rem' }}>Email</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              required
              style={{
                width: '100%',
                padding: '.75rem',
                borderRadius: '8px',
                border: `1px solid ${colors.mediumGray}`,
                fontSize: typography.fontSizes.medium
              }}
            />
          </label>

          <label style={{ color: colors.text }}>
            <span style={{ display: 'block', marginBottom: '.4rem' }}>Password</span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              required
              style={{
                width: '100%',
                padding: '.75rem',
                borderRadius: '8px',
                border: `1px solid ${colors.mediumGray}`,
                fontSize: typography.fontSizes.medium
              }}
            />
          </label>

          {error && <div style={{ color: colors.danger, fontSize: typography.fontSizes.small }}>{error}</div>}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: colors.primary,
              color: colors.white,
              padding: '0.8rem',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: typography.fontWeights.bold,
              fontSize: typography.fontSizes.medium
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ fontSize: typography.fontSizes.small, color: colors.textLight, marginTop: '1rem', textAlign: 'center' }}>
          Don't have an account?{" "}
          <Link to="/register/user" style={{ color: colors.secondary, textDecoration: 'underline' }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
