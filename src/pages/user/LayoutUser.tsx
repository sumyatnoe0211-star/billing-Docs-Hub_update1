import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { JSX, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { DEFAULT_AVATAR } from "../../lib/constants";
import { colors, typography } from '../../theme';
import { STORAGE_KEY } from '../../constants/auth';

interface UserProfile {
    id: string;
    nickname?: string;
    avatar?: string;
    email: string;
    role?: string;
}

export default function LayoutUser(): JSX.Element {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (session) {
                    const { user: supabaseUser } = session;
                    const { data: profileData, error: profileError } = await supabase
                        .from("users")
                        .select("*")
                        .eq("email", supabaseUser?.email)
                        .single();

                    if (profileError || !profileData) {
                        console.error("No user profile found for authenticated user.");
                        setUser(null);
                        setLoading(false);
                        navigate("/login/user");
                        return;
                    }

                    const freshUser: UserProfile = {
                        id: profileData.id,
                        nickname: profileData.nickname || "User",
                        avatar: profileData.avatar || DEFAULT_AVATAR,
                        email: profileData.email,
                        role: profileData.role,
                    };
                    setUser(freshUser);
                    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(freshUser));
                    setLoading(false);
                } else {
                    setUser(null);
                    setLoading(false);
                    navigate("/login/user");
                }
            }
        );

        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (session) {
                const { user: supabaseUser } = session;
                const { data: profileData, error: profileError } = await supabase
                    .from("users")
                    .select("*")
                    .eq("email", supabaseUser?.email)
                    .single();

                if (profileError || !profileData) {
                    console.error("No user profile found for initial session.");
                    setUser(null);
                    setLoading(false);
                    navigate("/login/user");
                    return;
                }

                const freshUser: UserProfile = {
                    id: profileData.id,
                    nickname: profileData.nickname || "User",
                    avatar: profileData.avatar || DEFAULT_AVATAR,
                    email: profileData.email,
                    role: profileData.role,
                };
                setUser(freshUser);
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(freshUser));
            }
            setLoading(false);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        sessionStorage.removeItem(STORAGE_KEY);
        navigate("/login/user");
    };

    if (loading) return <p style={{ textAlign: 'center', marginTop: '2.5rem', color: colors.text }}>Loading...</p>;
    if (!user) return <></>;

    const menuItems: { to: string; label: string }[] = [
        { to: "/user/documents", label: "📄 My Documents" },
        { to: "/user/upload", label: "⬆️ Upload Document" },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: colors.background }}>
            {/* Sidebar */}
            <aside style={{
                width: '240px',
                background: `linear-gradient(to bottom, ${colors.success}, ${colors.success})`,
                color: colors.text,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{ padding: '1.5rem' }}>
                    <h2 style={{ fontSize: typography.fontSizes.xLarge, fontWeight: typography.fontWeights.bold, marginBottom: '0.5rem' }}>Billing Docs Hub</h2>
                    <p style={{ color: colors.textLight, marginBottom: '1.5rem' }}>User Panel</p>

                    <div
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem', cursor: 'pointer' }}
                        onClick={() => navigate("/user/profile")}
                    >
                        <img
                            src={user.avatar || DEFAULT_AVATAR}
                            alt="Profile"
                            style={{ width: '5rem', height: '5rem', borderRadius: '50%', marginBottom: '0.5rem', objectFit: 'cover', border: `2px solid ${colors.success}` }}
                        />
                        <p style={{ fontWeight: typography.fontWeights.semibold, color: colors.text }}>{user.nickname || "User"}</p>
                    </div>

                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                style={({ isActive }) => ({
                                    padding: '0.5rem 1rem',
                                    borderRadius: '0.5rem',
                                    fontWeight: typography.fontWeights.medium,
                                    transition: 'background-color 0.2s',
                                    textDecoration: 'none',
                                    color: colors.text,
                                    backgroundColor: isActive ? colors.accent : 'transparent',
                                    // '&:hover': { // Removed invalid CSS pseudo-class
                                    //   backgroundColor: colors.accent,
                                    // },
                                })}
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div style={{ padding: '1.5rem' }}>
                    <button
                        style={{
                            width: '100%',
                            backgroundColor: colors.darkGray,
                            color: colors.white,
                            padding: '0.75rem 1rem',
                            borderRadius: '0.5rem',
                            fontWeight: typography.fontWeights.bold,
                            cursor: 'pointer',
                            border: 'none',
                        }}
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem' }}>
                <Outlet />
            </main>
        </div>
    );
}
