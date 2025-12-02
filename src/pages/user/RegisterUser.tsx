import { useState, ChangeEvent, JSX } from "react";
// import axios, { AxiosError } from "axios"; // Commented out axios for now
import { useNavigate, Link } from "react-router-dom";
import { colors, typography } from '../../theme';

// interface RegisterResponse {
//   message: string;
// }

// interface ErrorResponse {
//   error: string;
// }

export default function RegisterUser(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) {
      setMessage("Please enter your email");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Placeholder for registration logic.
      // If using Supabase, you would use:
      // const { user, error } = await supabase.auth.signUp({ email, password: 'some_default_password' });
      // if (error) throw error;
      // setMessage("✅ Registration request sent. Please check your email for confirmation.");

      // For now, simulating a successful registration request
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessage("✅ Registration request received. An admin will review your request.");

      // Original axios call (commented out):
      // const res = await axios.post<RegisterResponse>("http://localhost:3000/register", {
      //   email,
      // });
      // setMessage(res.data.message);

    } catch (err: any) {
      console.error("Registration error:", err);
      setMessage("❌ Something went wrong. Try again later.");
      // const axiosErr = err as AxiosError<ErrorResponse>;
      // setMessage(
      //   axiosErr.response?.data?.error ||
      //     "❌ Something went wrong. Try again later."
      // );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

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
        <h2 style={{ fontSize: typography.fontSizes.large, marginBottom: '1rem', color: colors.text }}>User Registration</h2>

        <form onSubmit={handleRegister} style={{ display: 'grid', gap: '1rem' }}>
          <label style={{ color: colors.text }}>
            <span style={{ display: 'block', marginBottom: '.4rem' }}>Email</span>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={handleInputChange}
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
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {message && <p style={{ fontSize: typography.fontSizes.small, marginTop: '1rem', textAlign: 'center', color: message.startsWith('❌') ? colors.danger : colors.success }}>{message}</p>}

        <p style={{ fontSize: typography.fontSizes.small, color: colors.textLight, marginTop: '1rem', textAlign: 'center' }}>
          Already registered?{" "}
          <Link to="/login/user" style={{ color: colors.secondary, textDecoration: 'underline' }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
