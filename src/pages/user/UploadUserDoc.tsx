import { useState, useEffect, useRef } from "react";
import { supabase } from "../../lib/supabase";
import { colors, typography } from '../../theme';

interface Category {
  id: string; // Assuming category ID is string based on other user pages
  name: string;
}

export default function UploadUserDoc() {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [user, setUser] = useState<any>(null); // Supabase User type
  const [userLoading, setUserLoading] = useState(true);
  const [catLoading, setCatLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const dropRef = useRef<HTMLDivElement>(null);

  // Fetch logged in user
  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (error || !data?.user) {
        setMessage("❌ You must be logged in to upload");
      } else {
        setUser(data.user);
      }
      setUserLoading(false);
    });
  }, []);

  // Fetch categories
  useEffect(() => {
    supabase
      .from("categories")
      .select("id, name")
      .then(({ data }) => {
        if (data) setCategories(data as Category[]);
        setCatLoading(false);
      });
  }, []);

  // Drag & drop handlers
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length > 0) {
      setFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  // Upload handler
  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userLoading) return;
    if (!user) return setMessage("❌ User not logged in.");
    if (!file || !category) return setMessage("❌ Select file AND category.");

    setLoading(true);
    setMessage("Uploading...");

    try {
      const filePath = `${user.email}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file, { upsert: false });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("documents")
        .getPublicUrl(filePath);

      await supabase.from("documents").insert({
        file_name: file.name,
        file_url: urlData.publicUrl,
        uploaded_by: user.email,
        user_id: user.id,
        category_id: category,
        status: "pending",
      });

      setMessage("✅ Uploaded successfully!");
      setFile(null);
      setCategory("");
    } catch (err: any) {
      setMessage("❌ Upload failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '40rem', margin: 'auto' }}>
      <h2 style={{ fontSize: typography.fontSizes.xLarge, fontWeight: typography.fontWeights.semibold, marginBottom: '1rem', color: colors.primary }}>Upload Document</h2>

      <form onSubmit={handleUpload}>
        {/* Drag & Drop */}
        <div
          ref={dropRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{
            border: `2px dashed ${loading ? colors.mediumGray : colors.secondary}`,
            borderRadius: '0.375rem',
            padding: '1.5rem',
            textAlign: 'center',
            marginBottom: '1rem',
            backgroundColor: loading ? colors.lightGray : colors.accent,
            transition: 'background-color 0.2s',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {file ? (
            <p style={{ color: colors.primary, fontWeight: typography.fontWeights.medium }}>{file.name}</p>
          ) : (
            <p style={{ color: colors.textLight }}>
              Drag & drop your file here or{" "}
              <label style={{ color: colors.secondary, textDecoration: 'underline', cursor: 'pointer' }}>
                click to select
                <input
                  type="file"
                  style={{ display: 'none' }}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </label>
            </p>
          )}
        </div>

        {/* Category + Upload */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <select
            style={{ flex: 1, padding: '0.5rem', border: `1px solid ${colors.mediumGray}`, borderRadius: '0.25rem', fontSize: typography.fontSizes.medium }}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={loading || catLoading}
          >
            <option value="">Select Category</option>
            {categories.map((cat: any) => (
              <option value={cat.id} key={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            style={{
              backgroundColor: colors.primary,
              color: colors.white,
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              fontWeight: typography.fontWeights.bold,
              cursor: 'pointer',
              border: 'none',
              opacity: (loading || userLoading) ? 0.6 : 1,
              fontSize: typography.fontSizes.medium
            }}
            disabled={loading || userLoading}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>

      {message && (
        <p style={{ fontSize: typography.fontSizes.small, marginTop: '1rem', color: message.includes("✅") ? colors.success : colors.danger }}>
          {message}
        </p>
      )}
    </div>
  );
}
