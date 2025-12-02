import { useEffect, useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { DEFAULT_AVATAR } from "../../lib/constants";
import { colors, typography } from '../../theme';
import { STORAGE_KEY } from '../../constants/auth';

// Type definitions
interface UserProfileType {
  id: string;
  email: string;
  nickname: string | null;
  avatar: string | null;
  role: string | null;
}

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfileType | null>(null); // Local state for profile
  const [loading, setLoading] = useState<boolean>(true);
  const [nickname, setNickname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);

      try {
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !authUser) {
          navigate("/login/user");
          return;
        }

        const { data: userProfile, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("email", authUser.email)
          .single();

        if (profileError || !userProfile) {
          setMessage("❌ No profile found in the database.");
          setLoading(false);
          return;
        }

        setUser(userProfile as UserProfileType);
        setNickname(userProfile.nickname || "");
        setEmail(userProfile.email || "");
      } catch (err: any) {
        console.error("UserProfile fetch error:", err);
        setMessage("❌ Failed to load profile: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setMessage("Updating profile...");
    setLoading(true);

    let avatarUrl = user.avatar;

    // Upload avatar if selected
    if (avatarFile) {
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `${user.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, avatarFile, { upsert: true });

      if (uploadError) {
        setMessage("❌ Failed to upload avatar: " + uploadError.message);
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      avatarUrl = urlData.publicUrl;
    }

    const { error: userError } = await supabase
      .from("users")
      .update({ nickname, avatar: avatarUrl })
      .eq("id", user.id);

    if (userError) {
      setMessage("❌ Failed to update profile: " + userError.message);
      setLoading(false);
      return;
    }

    const authUpdate: { email?: string; password?: string } = {};

    if (email && email !== user.email) authUpdate.email = email;
    if (password && password.length >= 6) authUpdate.password = password;

    if (Object.keys(authUpdate).length > 0) {
      const { error: authErr } = await supabase.auth.updateUser(authUpdate);
      if (authErr) {
        setMessage("⚠️ Auth update failed: " + authErr.message);
        setLoading(false);
        return;
      }
    }

    const updatedUser: UserProfileType = {
      ...user,
      nickname,
      email,
      avatar: avatarUrl,
      role: user.role,
    };

    setUser(updatedUser);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser)); // Update session storage

    setMessage("✅ Profile updated successfully!");
    setPassword("");
    setAvatarFile(null);
    setLoading(false);
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '2.5rem', color: colors.text }}>Loading profile...</p>;
  if (!user)
    return (
      <p style={{ textAlign: 'center', marginTop: '2.5rem', color: colors.danger }}>
        {message || "No profile found."}
      </p>
    );

  return (
    <div style={{ padding: '1.5rem', maxWidth: '400px', margin: 'auto', backgroundColor: colors.white, borderRadius: '0.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: typography.fontSizes.xLarge, fontWeight: typography.fontWeights.bold, textAlign: 'center', marginBottom: '1rem', color: colors.primary }}>User Profile</h2>

      <div style={{ textAlign: 'center', fontSize: typography.fontSizes.small, color: colors.textLight, marginBottom: '1rem' }}>
        <p>
          Role:{" "}
          <span style={{ fontWeight: typography.fontWeights.semibold, color: colors.text }}>
            {user.role || "User"}
          </span>
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <img
          src={
            avatarFile
              ? URL.createObjectURL(avatarFile)
              : user.avatar || DEFAULT_AVATAR
          }
          alt="Avatar"
          style={{ width: '6rem', height: '6rem', borderRadius: '50%', objectFit: 'cover', border: `1px solid ${colors.mediumGray}` }}
        />

        <label style={{ cursor: 'pointer', backgroundColor: colors.secondary, color: colors.white, padding: '0.5rem 1rem', borderRadius: '0.375rem' }}>
          {avatarFile ? "Change Avatar" : "Change Picture"}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label style={{ color: colors.text }}>
          Nickname
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: `1px solid ${colors.mediumGray}`, fontSize: typography.fontSizes.medium }}
          />
        </label>

        <label style={{ color: colors.text }}>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: `1px solid ${colors.mediumGray}`, fontSize: typography.fontSizes.medium }}
          />
        </label>

        <label style={{ color: colors.text }}>
          New Password
          <p style={{ fontSize: typography.fontSizes.small, color: colors.danger, marginTop: '0.25rem' }}>
            (leave blank if you don't want to change)
          </p>
          <input
            type="password"
            placeholder="Leave blank to keep current password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: `1px solid ${colors.mediumGray}`, fontSize: typography.fontSizes.medium }}
          />
        </label>

        <button
          type="submit"
          style={{
            backgroundColor: colors.primary,
            color: colors.white,
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            border: 'none',
            fontWeight: typography.fontWeights.bold,
            fontSize: typography.fontSizes.medium
          }}
        >
          Update Profile
        </button>
      </form>

      {message && <p style={{ textAlign: 'center', fontSize: typography.fontSizes.small, marginTop: '1rem', color: message.startsWith('❌') ? colors.danger : colors.success }}>{message}</p>}
    </div>
  );
}
