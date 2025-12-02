import { useEffect, useState, ChangeEvent, JSX } from "react";
import { supabase } from "../../lib/supabase";
import { colors, typography } from '../../theme';

interface DocumentRow {
  id: string;
  file_name: string;
  file_url: string;
  category_id: string | null;
  status: string;
  created_at: string;
  uploaded_by: string;
}

interface CategoryRow {
  id: string;
  name: string;
}

interface DocumentWithCategory extends DocumentRow {
  category?: CategoryRow | null;
}

export default function MyDocuments(): JSX.Element {
  const [documents, setDocuments] = useState<DocumentWithCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchDocs = async () => {
      setLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch documents
        const { data: docs } = await supabase
          .from("documents")
          .select("*")
          .eq("uploaded_by", user.email)
          .order("created_at", { ascending: false }) as {
          data: DocumentRow[] | null;
        };

        if (!docs) {
          setDocuments([]);
          return;
        }

        // Fetch categories
        const { data: categories } = await supabase
          .from("categories")
          .select("id, name") as { data: CategoryRow[] | null };

        const categoryList = categories || [];

        // Merge category into docs
        const docsWithCategory: DocumentWithCategory[] = docs.map((doc) => ({
          ...doc,
          category: categoryList.find((cat) => cat.id === doc.category_id) || null,
        }));

        setDocuments(docsWithCategory);
      } catch (err: any) {
        console.error("Error fetching documents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, []);

  // Filter search
  const filteredDocs = documents.filter((doc) => {
    const nameMatch = doc.file_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const categoryMatch = (doc.category?.name || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return nameMatch || categoryMatch;
  });

  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '2.5rem', color: colors.text }}>Loading documents...</p>;
  }

  if (documents.length === 0) {
    return (
      <p style={{ textAlign: 'center', marginTop: '2.5rem', color: colors.textLight }}>
        No documents uploaded yet.
      </p>
    );
  }

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(e.target.value);

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Search Bar */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search by file name or category..."
          value={searchQuery}
          onChange={handleSearch}
          style={{
            width: '100%',
            padding: '0.5rem',
            border: `1px solid ${colors.mediumGray}`,
            borderRadius: '0.25rem',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            outline: 'none',
            fontSize: typography.fontSizes.medium
          }}
        />
      </div>

      {/* Document Cards */}
      {filteredDocs.length === 0 ? (
        <p style={{ textAlign: 'center', color: colors.textLight }}>
          No documents match your search.
        </p>
      ) : (
        filteredDocs.map((doc) => (
          <div
            key={doc.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: colors.white,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              borderRadius: '0.5rem',
              padding: '1rem',
              marginBottom: '1rem',
              transition: 'box-shadow 0.2s',
              // '&:hover': { // Removed invalid CSS pseudo-class
              //   boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              // },
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.accent,
                borderRadius: '50%',
                color: colors.text,
                fontWeight: typography.fontWeights.bold,
                fontSize: typography.fontSizes.large
              }}>
                {doc.file_name.charAt(0).toUpperCase()}
              </div>

              <div>
                <h3 style={{ fontWeight: typography.fontWeights.semibold, fontSize: typography.fontSizes.large, color: colors.text }}>{doc.file_name}</h3>

                <p style={{ color: colors.textLight, fontSize: typography.fontSizes.small }}>
                  Category: {doc.category?.name || "N/A"} | Status: {doc.status}
                </p>

                <p style={{ color: colors.textLight, fontSize: typography.fontSizes.small }}>
                  Uploaded: {new Date(doc.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            <a
              href={doc.file_url}
              target="_blank"
              style={{
                backgroundColor: colors.secondary,
                color: colors.white,
                padding: '0.5rem 1rem',
                borderRadius: '0.25rem',
                textDecoration: 'none',
                transition: 'background-color 0.2s',
                  // '&:hover': { // Removed invalid CSS pseudo-class
                //   backgroundColor: colors.primary,
                // },
              }}
            >
              View
            </a>
          </div>
        ))
      )}
    </div>
  );
}
