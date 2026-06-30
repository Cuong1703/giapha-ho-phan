import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { supabase } from "./supabaseClient";

// ─── LOGIC CÂY PHẢ HỆ ────────────────────────────────────────────────────────

function buildAdjacencyLists(relationships, personsMap) {
  const spouses = new Map();
  const children = new Map();

  relationships.forEach((r) => {
    if (r.type === "marriage") {
      if (!spouses.has(r.person_a)) spouses.set(r.person_a, []);
      if (!spouses.has(r.person_b)) spouses.set(r.person_b, []);
      const pB = personsMap.get(r.person_b);
      if (pB) spouses.get(r.person_a).push({ person: pB, note: r.note });
      const pA = personsMap.get(r.person_a);
      if (pA) spouses.get(r.person_b).push({ person: pA, note: r.note });
    } else {
      if (!children.has(r.person_a)) children.set(r.person_a, []);
      const child = personsMap.get(r.person_b);
      if (child) children.get(r.person_a).push(child);
    }
  });

  children.forEach((arr) => {
    arr.sort((a, b) => {
      const ao = a.birth_order ?? Infinity, bo = b.birth_order ?? Infinity;
      if (ao !== bo) return ao - bo;
      return (a.birth_year ?? Infinity) - (b.birth_year ?? Infinity);
    });
  });

  return { spousesByPersonId: spouses, childrenByPersonId: children };
}

function getTreeData(personId, personsMap, adj) {
  return {
    person: personsMap.get(personId),
    spouses: adj.spousesByPersonId.get(personId) || [],
    children: adj.childrenByPersonId.get(personId) || [],
  };
}

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// ─── CSS CÂY ─────────────────────────────────────────────────────────────────

const TREE_CSS = `
.gp-tree ul {
  padding-top: 28px; position: relative;
  display: flex; justify-content: center;
  padding-left: 0; list-style: none;
}
.gp-tree li {
  float: left; text-align: center; list-style-type: none;
  position: relative; padding: 28px 4px 0 4px;
}
.gp-tree li::before, .gp-tree li::after {
  content: ''; position: absolute; top: 0; right: 50%;
  border-top: 2px solid #3a5680; width: 50%; height: 28px;
}
.gp-tree li::after { right: auto; left: 50%; border-left: 2px solid #3a5680; }
.gp-tree li:only-child::after { display: none; }
.gp-tree li:only-child::before {
  content: ''; position: absolute; top: 0; left: 50%;
  border-left: 2px solid #3a5680; width: 0; height: 28px;
}
.gp-tree ul:first-child > li { padding-top: 0; }
.gp-tree ul:first-child > li::before { display: none; }
.gp-tree li:first-child::before, .gp-tree li:last-child::after { border: 0 none; }
.gp-tree li:last-child::before { border-right: 2px solid #3a5680; border-radius: 0 10px 0 0; }
.gp-tree li:first-child::after { border-radius: 10px 0 0 0; }
.gp-tree ul ul::before {
  content: ''; position: absolute; top: 0; left: 50%;
  border-left: 2px solid #3a5680; width: 0; height: 28px;
}
`;

// ─── SHARED STYLES ────────────────────────────────────────────────────────────

const inputStyle = {
  width: "100%", padding: "9px 12px", borderRadius: 8,
  border: "1px solid #3a5680", fontSize: 13, outline: "none",
  fontFamily: "'Noto Sans', sans-serif", background: "#1a2e4e",
  color: "#e8edf7", boxSizing: "border-box",
};
const labelStyle = { fontSize: 12, color: "#a8b8d8", marginBottom: 4, display: "block", fontWeight: 600 };
const fieldWrap = { marginBottom: 12 };

// ─── LOADING SCREEN ───────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div style={{
      minHeight: "100vh", background: "#0f1f38",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 16,
    }}>
      <div style={{ fontSize: 48 }}>🌳</div>
      <div style={{ color: "#e6a23c", fontSize: 18, fontFamily: "'Noto Serif', serif", fontWeight: 700 }}>
        Đang tải Gia Phả Họ Phan...
      </div>
      <div style={{ color: "#6f84ac", fontSize: 13 }}>Kết nối cơ sở dữ liệu</div>
      <div style={{
        width: 48, height: 4, borderRadius: 2, background: "#1a2e4e",
        overflow: "hidden", marginTop: 8,
      }}>
        <div style={{
          height: "100%", background: "#e6a23c", borderRadius: 2,
          animation: "loading-bar 1.2s ease-in-out infinite",
          width: "40%",
        }} />
      </div>
      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  );
}

// ─── ERROR SCREEN ─────────────────────────────────────────────────────────────

function ErrorScreen({ message, onRetry }) {
  return (
    <div style={{
      minHeight: "100vh", background: "#0f1f38",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 16, padding: 24,
    }}>
      <div style={{ fontSize: 48 }}>⚠️</div>
      <div style={{ color: "#f0a8a8", fontSize: 16, fontWeight: 700, textAlign: "center" }}>
        Không thể kết nối cơ sở dữ liệu
      </div>
      <div style={{ color: "#8a99b8", fontSize: 13, textAlign: "center", maxWidth: 360 }}>
        {message || "Kiểm tra lại REACT_APP_SUPABASE_URL và REACT_APP_SUPABASE_ANON_KEY trong file .env"}
      </div>
      <button
        onClick={onRetry}
        style={{
          marginTop: 8, padding: "10px 28px",
          background: "#e6a23c", color: "#1a2e4e",
          border: "none", borderRadius: 10, fontSize: 14,
          fontWeight: 700, cursor: "pointer",
        }}
      >
        Thử lại
      </button>
    </div>
  );
}

// ─── NODE CARD ────────────────────────────────────────────────────────────────

function NodeCard({ person, role, isRing, isPlus, onSelect, isHighlighted }) {
  const isMale = person.gender === "male";
  const bgGrad = isMale
    ? "linear-gradient(135deg,#1a3a5c 0%,#2563a8 100%)"
    : "linear-gradient(135deg,#6b2155 0%,#c0527a 100%)";
  const initial = person.full_name.trim().split(" ").pop()?.[0] ?? "?";

  return (
    <button
      onClick={() => onSelect(person)}
      style={{
        position: "relative", display: "inline-flex", flexDirection: "column",
        alignItems: "center", gap: 4, padding: "8px 6px 6px",
        background: "none", border: "none", cursor: "pointer", width: 78,
        transition: "transform 0.2s", borderRadius: 14,
        outline: isHighlighted ? "3px solid #e6a23c" : "none", outlineOffset: 2,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
      title={person.full_name}
    >
      {isRing && <span style={{ position: "absolute", top: 8, left: 2, fontSize: 11 }}>💍</span>}
      {isPlus && <span style={{ position: "absolute", top: 8, left: 2, fontSize: 11, fontWeight: 700, color: "#888" }}>+</span>}

      {person.photo_url ? (
        <img src={person.photo_url} alt={person.full_name} style={{
          width: 44, height: 44, borderRadius: "50%", objectFit: "cover",
          border: "2.5px solid #fff",
          boxShadow: person.is_deceased ? "none" : "0 3px 10px rgba(0,0,0,0.25)",
          opacity: person.is_deceased ? 0.6 : 1,
          filter: person.is_deceased ? "grayscale(0.4)" : "none", flexShrink: 0,
        }} />
      ) : (
        <div style={{
          width: 44, height: 44, borderRadius: "50%", background: bgGrad,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 16, fontWeight: 700,
          boxShadow: person.is_deceased ? "none" : "0 3px 10px rgba(0,0,0,0.25)",
          opacity: person.is_deceased ? 0.6 : 1,
          filter: person.is_deceased ? "grayscale(0.4)" : "none",
          border: "2.5px solid #fff", flexShrink: 0,
          fontFamily: "'Noto Serif', serif",
        }}>
          {initial}
        </div>
      )}

      <span style={{
        fontSize: 10, fontWeight: 600, lineHeight: 1.3,
        color: person.is_deceased ? "#8a99b8" : "#e8edf7",
        textAlign: "center", whiteSpace: "normal", maxWidth: 74,
        fontFamily: "'Noto Sans', sans-serif",
      }}>
        {person.full_name.split(" ").map((w, i) => <span key={i} style={{ display: "block" }}>{w}</span>)}
      </span>

      <span style={{ fontSize: 9, color: "#6f84ac", fontFamily: "monospace" }}>
        {person.birth_year || "?"}
        {person.is_deceased && person.death_year ? `–${person.death_year}` : ""}
      </span>

      {role && <span style={{ fontSize: 9, color: "#f0a8c4", fontWeight: 600 }}>{role}</span>}
    </button>
  );
}

// ─── TREE NODE ────────────────────────────────────────────────────────────────

function TreeNode({ personId, personsMap, adj, collapsedNodes, toggleCollapse, onSelect, highlightId, visited, level = 0 }) {
  if (visited.has(personId)) return null;
  const newVisited = new Set(visited);
  newVisited.add(personId);

  const data = getTreeData(personId, personsMap, adj);
  if (!data.person) return null;

  const hasChildren = data.children.length > 0;
  const isCollapsed = collapsedNodes.has(personId);

  return (
    <li>
      <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{
          display: "flex", alignItems: "stretch", position: "relative",
          background: "#1a2e4ecc", borderRadius: 16, border: "1px solid #2e466e",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}>
          <NodeCard person={data.person} onSelect={onSelect} isHighlighted={highlightId === data.person.id} />
          {data.spouses.map((sd, idx) => (
            <div key={sd.person.id} style={{ display: "flex", position: "relative" }}>
              <NodeCard
                person={sd.person} isRing={idx === 0} isPlus={idx > 0}
                role={sd.person.gender === "male" ? "Chồng" : "Vợ"}
                onSelect={onSelect} isHighlighted={highlightId === sd.person.id}
              />
            </div>
          ))}
          {hasChildren && (
            <button
              onClick={(e) => { e.stopPropagation(); toggleCollapse(personId); }}
              style={{
                position: "absolute", bottom: -11, left: "50%", transform: "translateX(-50%)",
                width: 22, height: 22, borderRadius: "50%",
                background: "#1a2e4e", border: "1.5px solid #3a5680",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", zIndex: 10, boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
                fontSize: 13, color: "#e6a23c", lineHeight: 1,
              }}
              title={isCollapsed ? "Mở rộng" : "Thu gọn"}
            >
              {isCollapsed ? "＋" : "－"}
            </button>
          )}
        </div>
      </div>
      {hasChildren && !isCollapsed && (
        <ul>
          {data.children.map((child) => (
            <TreeNode
              key={child.id} personId={child.id}
              personsMap={personsMap} adj={adj}
              collapsedNodes={collapsedNodes} toggleCollapse={toggleCollapse}
              onSelect={onSelect} highlightId={highlightId}
              visited={newVisited} level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

// ─── MODAL CHI TIẾT ──────────────────────────────────────────────────────────

function PersonModal({ person, onClose, onEdit }) {
  if (!person) return null;
  const isMale = person.gender === "male";
  const basicFields = [
    ["Giới tính", isMale ? "Nam" : person.gender === "female" ? "Nữ" : "Khác"],
    ["Năm sinh", person.birth_year ?? "Không rõ"],
    ["Năm mất", person.is_deceased ? (person.death_year ?? "Không rõ") : "Còn sống"],
    ["Thế hệ", person.generation ? `Đời ${person.generation}` : "—"],
  ];
  const extraFields = [
    ["📍 Nơi sinh / sống", person.birth_place],
    ["💼 Nghề nghiệp", person.occupation],
    ["📞 Số điện thoại", person.phone],
    ["✉️ Email", person.email],
    ["⚰️ Nơi an táng", person.burial_place],
  ].filter(([, v]) => v);

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(10,10,20,0.6)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 16, overflowY: "auto",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "#1a2e4e", borderRadius: 20, padding: "28px 32px",
        maxWidth: 380, width: "100%", maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        fontFamily: "'Noto Sans', sans-serif", border: "1px solid #2e466e",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          {person.photo_url ? (
            <img src={person.photo_url} alt={person.full_name} style={{
              width: 56, height: 56, borderRadius: "50%", objectFit: "cover",
              border: "2px solid " + (isMale ? "#2563a8" : "#c0527a"), flexShrink: 0,
            }} />
          ) : (
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: isMale ? "linear-gradient(135deg,#1a3a5c,#2563a8)" : "linear-gradient(135deg,#6b2155,#c0527a)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 22, fontWeight: 700,
              fontFamily: "'Noto Serif', serif", flexShrink: 0,
            }}>
              {person.full_name.trim().split(" ").pop()?.[0]}
            </div>
          )}
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#e8edf7", fontFamily: "'Noto Serif', serif" }}>
              {person.full_name}
            </div>
            <div style={{ fontSize: 12, color: isMale ? "#6db3f2" : "#f0a8c4", fontWeight: 600, marginTop: 2 }}>
              {person.is_deceased ? "✦ Đã mất" : "✦ Còn sống"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {basicFields.map(([label, val]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #2e466e", paddingBottom: 6 }}>
              <span style={{ fontSize: 12, color: "#6f84ac" }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#e8edf7", textAlign: "right", maxWidth: "60%" }}>{val}</span>
            </div>
          ))}
        </div>

        {extraFields.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14, paddingTop: 14, borderTop: "1px dashed #2e466e" }}>
            {extraFields.map(([label, val]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span style={{ fontSize: 12, color: "#6f84ac", flexShrink: 0 }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#e8edf7", textAlign: "right" }}>{val}</span>
              </div>
            ))}
          </div>
        )}

        {person.note && (
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px dashed #2e466e" }}>
            <div style={{ fontSize: 12, color: "#6f84ac", marginBottom: 4 }}>📝 Ghi chú / Tiểu sử</div>
            <div style={{ fontSize: 13, color: "#e8edf7", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{person.note}</div>
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          {onEdit && (
            <button onClick={() => onEdit(person)} style={{
              flex: 1, padding: "10px 0", background: "#1a2e4e", color: "#e6a23c",
              border: "1px solid #e6a23c", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>
              ✏️ Sửa thông tin
            </button>
          )}
          <button onClick={onClose} style={{
            flex: 1, padding: "10px 0", background: "#e6a23c", color: "#1a2e4e",
            border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── STATS ────────────────────────────────────────────────────────────────────

function Stats({ persons }) {
  const total = persons.length;
  const males = persons.filter((p) => p.gender === "male").length;
  const females = persons.filter((p) => p.gender === "female").length;
  const deceased = persons.filter((p) => p.is_deceased).length;
  const maxGen = Math.max(...persons.map((p) => p.generation || 0), 0);
  const items = [
    { label: "Tổng thành viên", value: total, icon: "👨‍👩‍👧‍👦" },
    { label: "Nam", value: males, icon: "👨" },
    { label: "Nữ", value: females, icon: "👩" },
    { label: "Đã mất", value: deceased, icon: "🕊️" },
    { label: "Số đời", value: maxGen, icon: "🌿" },
  ];
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", padding: "12px 16px" }}>
      {items.map(({ label, value, icon }) => (
        <div key={label} style={{
          background: "#1a2e4ecc", borderRadius: 12, padding: "10px 16px",
          border: "1px solid #2e466e", textAlign: "center", minWidth: 90,
          fontFamily: "'Noto Sans', sans-serif",
        }}>
          <div style={{ fontSize: 20 }}>{icon}</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#e8edf7" }}>{value}</div>
          <div style={{ fontSize: 10, color: "#8a99b8" }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── SEARCH BAR ──────────────────────────────────────────────────────────────

function SearchBar({ persons, onJump }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return persons.filter((p) => p.full_name.toLowerCase().includes(q)).slice(0, 8);
  }, [query, persons]);

  return (
    <div style={{ position: "relative", maxWidth: 320, width: "100%", margin: "0 auto" }}>
      <input
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder="🔍 Tìm tên thành viên..."
        style={{
          width: "100%", padding: "9px 14px", borderRadius: 20,
          border: "1px solid #3a5680", fontSize: 13, outline: "none",
          fontFamily: "'Noto Sans', sans-serif", background: "#1a2e4e",
          color: "#e8edf7", boxSizing: "border-box",
        }}
      />
      {open && results.length > 0 && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          background: "#1a2e4e", borderRadius: 12, border: "1px solid #3a5680",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)", zIndex: 100,
          maxHeight: 260, overflowY: "auto",
        }}>
          {results.map((p) => (
            <button key={p.id}
              onClick={() => { onJump(p.id); setQuery(""); setOpen(false); }}
              style={{
                display: "block", width: "100%", textAlign: "left",
                padding: "8px 14px", border: "none", background: "none",
                cursor: "pointer", fontSize: 12.5, borderBottom: "1px solid #2e466e",
                fontFamily: "'Noto Sans', sans-serif", color: "#e8edf7",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#25395c")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              <strong>{p.full_name}</strong>
              <span style={{ color: "#6f84ac", marginLeft: 6 }}>· Đời {p.generation}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PERSON PICKER ────────────────────────────────────────────────────────────

function PersonPicker({ persons, value, onChange, placeholder }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const selected = persons.find((p) => p.id === value);
  const results = useMemo(() => {
    if (!query.trim()) return persons.slice(0, 8);
    const q = query.trim().toLowerCase();
    return persons.filter((p) => p.full_name.toLowerCase().includes(q)).slice(0, 8);
  }, [query, persons]);

  return (
    <div style={{ position: "relative" }}>
      <input
        value={selected ? selected.full_name : query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); if (selected) onChange(""); }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        style={inputStyle}
      />
      {selected && (
        <button onClick={() => { onChange(""); setQuery(""); }}
          style={{ position: "absolute", right: 8, top: 8, background: "none", border: "none", color: "#f0a8c4", cursor: "pointer", fontSize: 14 }}
          title="Bỏ chọn">✕</button>
      )}
      {open && !selected && results.length > 0 && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          background: "#1a2e4e", borderRadius: 8, border: "1px solid #3a5680",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)", zIndex: 100,
          maxHeight: 220, overflowY: "auto",
        }}>
          {results.map((p) => (
            <button key={p.id}
              onClick={() => { onChange(p.id); setQuery(""); setOpen(false); }}
              style={{
                display: "block", width: "100%", textAlign: "left",
                padding: "8px 12px", border: "none", background: "none",
                cursor: "pointer", fontSize: 12.5, borderBottom: "1px solid #2e466e",
                color: "#e8edf7", fontFamily: "'Noto Sans', sans-serif",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#25395c")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              {p.full_name} <span style={{ color: "#6f84ac" }}>· Đời {p.generation}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── FORM THÊM THÀNH VIÊN ────────────────────────────────────────────────────

function AddPersonForm({ allPersons, onSubmitAdd, isAdmin }) {
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("male");
  const [birthYear, setBirthYear] = useState("");
  const [deathYear, setDeathYear] = useState("");
  const [isDeceased, setIsDeceased] = useState(false);
  const [birthPlace, setBirthPlace] = useState("");
  const [parentId, setParentId] = useState("");
  const [spouseId, setSpouseId] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    if (!fullName.trim() || saving) return;
    setSaving(true);

    const parent = allPersons.find((p) => p.id === parentId);
    const spouse = allPersons.find((p) => p.id === spouseId);
    const generation = parent ? (parent.generation || 1) + 1 : spouse ? spouse.generation : 1;

    const newPerson = {
      id: uuidv4(),
      full_name: fullName.trim(),
      gender,
      birth_year: birthYear ? parseInt(birthYear, 10) : null,
      death_year: isDeceased && deathYear ? parseInt(deathYear, 10) : null,
      is_deceased: isDeceased,
      generation,
      birth_place: birthPlace.trim() || null,
      occupation: null, phone: null, email: null, burial_place: null,
      note: note.trim() || null, photo_url: null,
    };

    await onSubmitAdd(newPerson, parentId || null, spouseId || null);

    setSuccess(isAdmin
      ? `✓ Đã thêm "${newPerson.full_name}" vào gia phả!`
      : `✓ Đã gửi yêu cầu thêm "${newPerson.full_name}". Chờ quản lý duyệt.`);
    setFullName(""); setBirthYear(""); setDeathYear(""); setIsDeceased(false);
    setBirthPlace(""); setParentId(""); setSpouseId(""); setNote("");
    setSaving(false);
    setTimeout(() => setSuccess(""), 4000);
  };

  return (
    <div>
      {!isAdmin && (
        <div style={{ marginBottom: 14, padding: "10px 14px", background: "#1f3a4a", border: "1px solid #2f5a6b", borderRadius: 8, color: "#a8d4e6", fontSize: 12 }}>
          ℹ️ Yêu cầu sẽ ở trạng thái <strong>chờ duyệt</strong> cho đến khi quản lý xác nhận.
        </div>
      )}
      <div style={fieldWrap}>
        <label style={labelStyle}>Họ và tên *</label>
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="VD: Phan Văn An" style={inputStyle} />
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ ...fieldWrap, flex: 1 }}>
          <label style={labelStyle}>Giới tính</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} style={inputStyle}>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </div>
        <div style={{ ...fieldWrap, flex: 1 }}>
          <label style={labelStyle}>Năm sinh</label>
          <input value={birthYear} onChange={(e) => setBirthYear(e.target.value.replace(/\D/g, ""))} placeholder="VD: 1995" style={inputStyle} />
        </div>
      </div>
      <div style={fieldWrap}>
        <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
          <input type="checkbox" checked={isDeceased} onChange={(e) => setIsDeceased(e.target.checked)} />
          Đã mất
        </label>
        {isDeceased && (
          <input value={deathYear} onChange={(e) => setDeathYear(e.target.value.replace(/\D/g, ""))} placeholder="Năm mất" style={{ ...inputStyle, marginTop: 6 }} />
        )}
      </div>
      <div style={fieldWrap}>
        <label style={labelStyle}>📍 Nơi sinh</label>
        <input value={birthPlace} onChange={(e) => setBirthPlace(e.target.value)} placeholder="VD: Thăng Phước, Quảng Nam" style={inputStyle} />
      </div>
      <div style={fieldWrap}>
        <label style={labelStyle}>Cha hoặc Mẹ (để nối vào cây)</label>
        <PersonPicker persons={allPersons} value={parentId} onChange={setParentId} placeholder="Tìm tên cha/mẹ..." />
      </div>
      <div style={fieldWrap}>
        <label style={labelStyle}>Vợ / Chồng (nếu có)</label>
        <PersonPicker persons={allPersons} value={spouseId} onChange={setSpouseId} placeholder="Tìm tên vợ/chồng..." />
      </div>
      <div style={fieldWrap}>
        <label style={labelStyle}>Ghi chú / Tiểu sử</label>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3}
          style={{ ...inputStyle, resize: "vertical" }} placeholder="Thông tin thêm..." />
      </div>
      <button onClick={handleSubmit} disabled={!fullName.trim() || saving} style={{
        width: "100%", padding: "11px 0", marginTop: 6,
        background: fullName.trim() && !saving ? "#e6a23c" : "#3a5680",
        color: fullName.trim() && !saving ? "#1a2e4e" : "#6f84ac",
        border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700,
        cursor: fullName.trim() && !saving ? "pointer" : "not-allowed",
      }}>
        {saving ? "⏳ Đang lưu..." : isAdmin ? "➕ Thêm thành viên" : "📨 Gửi yêu cầu thêm"}
      </button>
      {success && (
        <div style={{ marginTop: 12, padding: "10px 14px", background: "#1f4a2e", border: "1px solid #2f6b44", borderRadius: 8, color: "#a8e6c0", fontSize: 13 }}>
          {success}
        </div>
      )}
      {!parentId && !spouseId && fullName.trim() && (
        <div style={{ marginTop: 12, padding: "10px 14px", background: "#4a3a1f", border: "1px solid #6b5a2f", borderRadius: 8, color: "#e6c8a8", fontSize: 12 }}>
          ⚠️ Không chọn cha/mẹ hoặc vợ/chồng → thành viên sẽ <strong>không hiển thị trên cây</strong>.
        </div>
      )}
    </div>
  );
}

// ─── FORM SỬA THÔNG TIN ──────────────────────────────────────────────────────

function EditPersonForm({ allPersons, onSubmitUpdate, editingPerson, setEditingPerson, isAdmin }) {
  const [selectedId, setSelectedId] = useState(editingPerson?.id || "");
  const person = allPersons.find((p) => p.id === selectedId);
  const [fields, setFields] = useState({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => { if (editingPerson) setSelectedId(editingPerson.id); }, [editingPerson]);
  useEffect(() => {
    if (person) {
      setFields({
        birth_place: person.birth_place || "",
        occupation: person.occupation || "",
        phone: person.phone || "",
        email: person.email || "",
        burial_place: person.burial_place || "",
        note: person.note || "",
        photo_url: person.photo_url || "",
      });
    } else { setFields({}); }
 // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [person?.id]);

  if (!person) {
    return (
      <div style={fieldWrap}>
        <label style={labelStyle}>Chọn thành viên cần sửa</label>
        <PersonPicker persons={allPersons} value={selectedId} onChange={setSelectedId} placeholder="Tìm tên thành viên..." />
      </div>
    );
  }

  const setField = (key, val) => setFields((prev) => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    const cleaned = {};
    Object.entries(fields).forEach(([k, v]) => { cleaned[k] = v.trim() ? v.trim() : null; });
    await onSubmitUpdate(person.id, cleaned, person.full_name);
    setSuccess(isAdmin
      ? `✓ Đã lưu thông tin cho "${person.full_name}"!`
      : `✓ Đã gửi yêu cầu sửa "${person.full_name}". Chờ duyệt.`);
    setSaving(false);
    setTimeout(() => setSuccess(""), 4000);
  };

  return (
    <div>
      {!isAdmin && (
        <div style={{ marginBottom: 14, padding: "10px 14px", background: "#1f3a4a", border: "1px solid #2f5a6b", borderRadius: 8, color: "#a8d4e6", fontSize: 12 }}>
          ℹ️ Yêu cầu sẽ ở trạng thái <strong>chờ duyệt</strong> cho đến khi quản lý xác nhận.
        </div>
      )}
      <div style={fieldWrap}>
        <label style={labelStyle}>Thành viên đang sửa</label>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ flex: 1, ...inputStyle, display: "flex", alignItems: "center", fontWeight: 700 }}>
            {person.full_name}
            <span style={{ color: "#6f84ac", marginLeft: 6, fontWeight: 400 }}>· Đời {person.generation}</span>
          </div>
          <button onClick={() => { setSelectedId(""); setEditingPerson(null); }}
            style={{ padding: "9px 12px", background: "#1a2e4e", border: "1px solid #3a5680", borderRadius: 8, color: "#e6a23c", cursor: "pointer", fontSize: 12 }}>
            Đổi
          </button>
        </div>
      </div>
      {[
        ["📍 Nơi sinh / sống", "birth_place", "VD: Thăng Phước, Quảng Nam"],
        ["💼 Nghề nghiệp", "occupation", "VD: Giáo viên"],
        ["⚰️ Nơi an táng / mộ phần", "burial_place", "VD: Nghĩa trang gia tộc"],
        ["🖼️ Ảnh đại diện (URL)", "photo_url", "https://..."],
      ].map(([label, key, placeholder]) => (
        <div key={key} style={fieldWrap}>
          <label style={labelStyle}>{label}</label>
          <input value={fields[key] || ""} onChange={(e) => setField(key, e.target.value)} placeholder={placeholder} style={inputStyle} />
        </div>
      ))}
      <div style={{ display: "flex", gap: 10 }}>
        {[["📞 Số điện thoại", "phone", "09xxxxxxxx"], ["✉️ Email", "email", "email@..."]].map(([label, key, placeholder]) => (
          <div key={key} style={{ ...fieldWrap, flex: 1 }}>
            <label style={labelStyle}>{label}</label>
            <input value={fields[key] || ""} onChange={(e) => setField(key, e.target.value)} placeholder={placeholder} style={inputStyle} />
          </div>
        ))}
      </div>
      <div style={fieldWrap}>
        <label style={labelStyle}>📝 Ghi chú / Tiểu sử</label>
        <textarea value={fields.note || ""} onChange={(e) => setField("note", e.target.value)}
          rows={4} style={{ ...inputStyle, resize: "vertical" }} placeholder="Thông tin thêm..." />
      </div>
      <button onClick={handleSave} disabled={saving} style={{
        width: "100%", padding: "11px 0", marginTop: 6,
        background: saving ? "#3a5680" : "#e6a23c",
        color: saving ? "#6f84ac" : "#1a2e4e",
        border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700,
        cursor: saving ? "not-allowed" : "pointer",
      }}>
        {saving ? "⏳ Đang lưu..." : isAdmin ? "💾 Lưu thông tin" : "📨 Gửi yêu cầu sửa"}
      </button>
      {success && (
        <div style={{ marginTop: 12, padding: "10px 14px", background: "#1f4a2e", border: "1px solid #2f6b44", borderRadius: 8, color: "#a8e6c0", fontSize: 13 }}>
          {success}
        </div>
      )}
    </div>
  );
}

// ─── ĐĂNG NHẬP ADMIN ─────────────────────────────────────────────────────────

function AdminLoginBox({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true); setError("");
    const ok = await onLogin(email, password);
    if (!ok) { setError("Email hoặc mật khẩu không đúng."); }
    setLoading(false);
  };

  return (
    <div style={{
      background: "#1a2e4ecc", border: "1px solid #2e466e", borderRadius: 16,
      padding: 20, marginBottom: 16,
    }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#a8b8d8", marginBottom: 12 }}>
        🔐 Đăng nhập Quản lý để duyệt thay đổi
      </div>
      <div style={fieldWrap}>
        <label style={labelStyle}>Email</label>
        <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }}
          placeholder="admin@example.com" style={inputStyle} />
      </div>
      <div style={fieldWrap}>
        <label style={labelStyle}>Mật khẩu</label>
        <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          placeholder="••••••••" style={inputStyle} />
      </div>
      <button onClick={handleLogin} disabled={loading || !email || !password} style={{
        width: "100%", padding: "10px 0", background: "#e6a23c", color: "#1a2e4e",
        border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700,
        cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
      }}>
        {loading ? "⏳ Đang đăng nhập..." : "Đăng nhập"}
      </button>
      {error && <div style={{ marginTop: 8, fontSize: 12, color: "#f0a8a8" }}>{error}</div>}
      <div style={{ marginTop: 10, fontSize: 11, color: "#6f84ac" }}>
        💡 Tạo tài khoản admin tại: Supabase → Authentication → Users → Add user
      </div>
    </div>
  );
}

// ─── CARD YÊU CẦU CHỜ DUYỆT ─────────────────────────────────────────────────

function PendingChangeCard({ change, onApprove, onReject }) {
  const isAdd = change.type === "add";
  const payload = change.payload;
  return (
    <div style={{
      background: "#1a2e4ecc", border: "1px solid #2e466e", borderRadius: 12,
      padding: "14px 16px", marginBottom: 10,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10,
            background: isAdd ? "#1f4a2e" : "#1f3a4a",
            color: isAdd ? "#a8e6c0" : "#a8d4e6", marginRight: 8,
          }}>
            {isAdd ? "THÊM MỚI" : "SỬA THÔNG TIN"}
          </span>
          <strong style={{ color: "#e8edf7", fontSize: 14 }}>
            {isAdd ? payload.newPerson?.full_name : payload.personName}
          </strong>
        </div>
        <span style={{ fontSize: 10, color: "#6f84ac", whiteSpace: "nowrap" }}>
          {new Date(change.submitted_at).toLocaleString("vi-VN")}
        </span>
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: "#a8b8d8", lineHeight: 1.6 }}>
        {isAdd ? (
          <>
            {payload.newPerson?.gender === "male" ? "Nam" : "Nữ"}
            {payload.newPerson?.birth_year ? ` · Sinh ${payload.newPerson.birth_year}` : ""}
            {payload.newPerson?.birth_place ? ` · ${payload.newPerson.birth_place}` : ""}
            {payload.newPerson?.note ? <div style={{ marginTop: 4 }}>📝 {payload.newPerson.note}</div> : null}
          </>
        ) : (
          Object.entries(payload.fields || {}).filter(([, v]) => v).map(([k, v]) => (
            <div key={k}>• {k}: <strong style={{ color: "#e8edf7" }}>{v}</strong></div>
          ))
        )}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={() => onApprove(change.id)} style={{
          flex: 1, padding: "8px 0", background: "#2f6b44", color: "#fff",
          border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
        }}>✓ Duyệt</button>
        <button onClick={() => onReject(change.id)} style={{
          flex: 1, padding: "8px 0", background: "#1a2e4e", color: "#f0a8a8",
          border: "1px solid #5a3a3a", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
        }}>✕ Từ chối</button>
      </div>
    </div>
  );
}

// ─── MANAGE PANEL ─────────────────────────────────────────────────────────────

function ManagePanel({ allPersons, editingPerson, setEditingPerson, isAdmin, onAdminLogin, onAdminLogout, pendingChanges, onApproveChange, onRejectChange, onSubmitAdd, onSubmitUpdate }) {
  const [mode, setMode] = useState(editingPerson ? "edit" : "add");
  useEffect(() => { if (editingPerson) setMode("edit"); }, [editingPerson]);

  const tabs = isAdmin
    ? [["add", "➕ Thêm"], ["edit", "✏️ Sửa"], [`approve`, `🗂️ Duyệt (${pendingChanges.length})`]]
    : [["add", "➕ Thêm thành viên"], ["edit", "✏️ Sửa thông tin"]];

  return (
    <div style={{ padding: "16px 20px 60px", maxWidth: 560, margin: "0 auto" }}>
      {!isAdmin && <AdminLoginBox onLogin={onAdminLogin} />}
      {isAdmin && (
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "#1f4a2e", border: "1px solid #2f6b44", borderRadius: 10,
          padding: "8px 14px", marginBottom: 14, fontSize: 12, color: "#a8e6c0",
        }}>
          <span>🔓 Đang ở vai <strong>Quản lý</strong></span>
          <button onClick={onAdminLogout} style={{ background: "none", border: "none", color: "#a8e6c0", textDecoration: "underline", cursor: "pointer", fontSize: 12 }}>
            Đăng xuất
          </button>
        </div>
      )}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {tabs.map(([key, label]) => (
          <button key={key} onClick={() => { setMode(key); if (key === "add") setEditingPerson(null); }} style={{
            flex: 1, padding: "10px 0", borderRadius: 10, cursor: "pointer",
            fontSize: 13, fontWeight: 600,
            background: mode === key ? "#e6a23c" : "#1a2e4ecc",
            color: mode === key ? "#1a2e4e" : "#a8b8d8",
            border: mode === key ? "none" : "1px solid #2e466e",
          }}>
            {label}
          </button>
        ))}
      </div>
      {mode === "approve" && isAdmin ? (
        pendingChanges.length === 0 ? (
          <div style={{ background: "#1a2e4ecc", border: "1px solid #2e466e", borderRadius: 16, padding: 30, textAlign: "center", color: "#6f84ac", fontSize: 13 }}>
            ✓ Không có yêu cầu nào đang chờ duyệt.
          </div>
        ) : (
          pendingChanges.map((c) => <PendingChangeCard key={c.id} change={c} onApprove={onApproveChange} onReject={onRejectChange} />)
        )
      ) : (
        <div style={{ background: "#1a2e4ecc", border: "1px solid #2e466e", borderRadius: 16, padding: 20 }}>
          {mode === "add" ? (
            <AddPersonForm allPersons={allPersons} onSubmitAdd={onSubmitAdd} isAdmin={isAdmin} />
          ) : (
            <EditPersonForm allPersons={allPersons} onSubmitUpdate={onSubmitUpdate} editingPerson={editingPerson} setEditingPerson={setEditingPerson} isAdmin={isAdmin} />
          )}
        </div>
      )}
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

const ROOT_ID = "1fcef043-b4d7-47ee-abd6-a875a09a4204";

// ─── APP CHÍNH ────────────────────────────────────────────────────────────────

export default function GiaPhaHoPhan() {
  // ── State dữ liệu từ Supabase ──────────────────────────────────────────────
  const [persons, setPersons] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [pendingChanges, setPendingChanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── State UI ───────────────────────────────────────────────────────────────
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [collapsedNodes, setCollapsedNodes] = useState(new Set());
  const [scale, setScale] = useState(0.85);
  const [tab, setTab] = useState("tree");
  const [highlightId, setHighlightId] = useState(null);
  const [editingPerson, setEditingPerson] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const containerRef = useRef(null);

  // ── Load dữ liệu từ Supabase ───────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [{ data: p, error: e1 }, { data: r, error: e2 }] = await Promise.all([
        supabase.from("persons").select("*").order("generation").order("birth_order", { nullsFirst: false }),
        supabase.from("relationships").select("*"),
      ]);
      if (e1) throw e1;
      if (e2) throw e2;
      setPersons(p || []);
      setRelationships(r || []);
    } catch (err) {
      setError(err.message || "Lỗi không xác định");
    }
    setLoading(false);
  }, []);

  const loadPending = useCallback(async () => {
    const { data } = await supabase.from("pending_changes").select("*").eq("status", "pending").order("submitted_at");
    setPendingChanges(data || []);
  }, []);

  // Kiểm tra session đăng nhập khi khởi động
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setIsAdmin(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => { if (isAdmin) loadPending(); }, [isAdmin, loadPending]);

  // ── Build cây ─────────────────────────────────────────────────────────────
  const personsMap = useMemo(() => new Map(persons.map((p) => [p.id, p])), [persons]);
  const adj = useMemo(() => buildAdjacencyLists(relationships, personsMap), [personsMap, relationships]);

  // Auto-collapse từ đời 4 trở đi
  useEffect(() => {
    if (persons.length === 0) return;
    const autoCollapsed = new Set();
    const walk = (personId, visited) => {
      if (visited.has(personId)) return;
      const nv = new Set(visited); nv.add(personId);
      const data = getTreeData(personId, personsMap, adj);
      if (!data.person) return;
      if (data.person.generation >= 4 && data.children.length > 0) {
        autoCollapsed.add(personId); return;
      }
      data.children.forEach((c) => walk(c.id, nv));
    };
    walk(ROOT_ID, new Set());
    setCollapsedNodes(autoCollapsed);
  }, [persons.length, personsMap, adj]);

  useEffect(() => {
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollLeft = (containerRef.current.scrollWidth - containerRef.current.clientWidth) / 2;
        containerRef.current.scrollTop = 0;
      }
    }, 150);
  }, [tab]);

  // ── Auth ──────────────────────────────────────────────────────────────────
  const handleAdminLogin = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return !error;
  }, []);

  const handleAdminLogout = useCallback(async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  }, []);

  // ── Thêm thành viên ────────────────────────────────────────────────────────
  const submitAddPerson = useCallback(async (newPerson, parentId, spouseId) => {
    if (isAdmin) {
      // Commit thẳng vào DB
      const { error: e1 } = await supabase.from("persons").insert(newPerson);
      if (e1) { alert("Lỗi thêm thành viên: " + e1.message); return; }

      const newRels = [];
      if (parentId) newRels.push({ id: uuidv4(), type: "biological_child", person_a: parentId, person_b: newPerson.id });
      if (spouseId) newRels.push({ id: uuidv4(), type: "marriage", person_a: newPerson.id, person_b: spouseId });
      if (newRels.length) await supabase.from("relationships").insert(newRels);

      await loadData();
    } else {
      // Gửi vào hàng chờ duyệt
      await supabase.from("pending_changes").insert({
        id: uuidv4(),
        type: "add",
        payload: { newPerson, parentId, spouseId },
        status: "pending",
      });
    }
  }, [isAdmin, loadData]);

  // ── Sửa thông tin ──────────────────────────────────────────────────────────
  const submitUpdatePerson = useCallback(async (personId, fields, personName) => {
    if (isAdmin) {
      const { error } = await supabase.from("persons").update(fields).eq("id", personId);
      if (error) { alert("Lỗi cập nhật: " + error.message); return; }
      await loadData();
    } else {
      await supabase.from("pending_changes").insert({
        id: uuidv4(),
        type: "edit",
        payload: { personId, fields, personName },
        status: "pending",
      });
    }
  }, [isAdmin, loadData]);

  // ── Duyệt yêu cầu ─────────────────────────────────────────────────────────
  const approveChange = useCallback(async (changeId) => {
    const change = pendingChanges.find((c) => c.id === changeId);
    if (!change) return;

    if (change.type === "add") {
      const { newPerson, parentId, spouseId } = change.payload;
      await supabase.from("persons").insert(newPerson);
      const newRels = [];
      if (parentId) newRels.push({ id: uuidv4(), type: "biological_child", person_a: parentId, person_b: newPerson.id });
      if (spouseId) newRels.push({ id: uuidv4(), type: "marriage", person_a: newPerson.id, person_b: spouseId });
      if (newRels.length) await supabase.from("relationships").insert(newRels);
    } else if (change.type === "edit") {
      const { personId, fields } = change.payload;
      await supabase.from("persons").update(fields).eq("id", personId);
    }

    await supabase.from("pending_changes").update({ status: "approved" }).eq("id", changeId);
    await Promise.all([loadData(), loadPending()]);
  }, [pendingChanges, loadData, loadPending]);

  // ── Từ chối yêu cầu ───────────────────────────────────────────────────────
  const rejectChange = useCallback(async (changeId) => {
    await supabase.from("pending_changes").update({ status: "rejected" }).eq("id", changeId);
    await loadPending();
  }, [loadPending]);

  // ── Collapse / expand ──────────────────────────────────────────────────────
  const toggleCollapse = useCallback((id) => {
    setCollapsedNodes((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  // ── Jump tới người ─────────────────────────────────────────────────────────
  const expandPathTo = useCallback((personId) => {
    const parentMap = new Map();
    relationships.forEach((r) => { if (r.type !== "marriage") parentMap.set(r.person_b, r.person_a); });
    const path = []; let cur = personId; const seen = new Set();
    while (cur && !seen.has(cur)) { seen.add(cur); path.push(cur); cur = parentMap.get(cur); }
    setCollapsedNodes((prev) => { const next = new Set(prev); path.forEach((id) => next.delete(id)); return next; });
    setHighlightId(personId); setTab("tree");
    setTimeout(() => {
      const el = document.getElementById("person-" + personId);
      if (el && containerRef.current) el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    }, 200);
    setTimeout(() => setHighlightId(null), 3000);
  }, [relationships]);

  // ── Zoom controls ──────────────────────────────────────────────────────────
  const handleZoomIn = () => setScale((s) => Math.min(s + 0.1, 1.5));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.1, 0.25));
  const handleReset = () => {
    setScale(0.85);
    if (containerRef.current) {
      containerRef.current.scrollLeft = (containerRef.current.scrollWidth - containerRef.current.clientWidth) / 2;
      containerRef.current.scrollTop = 0;
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} onRetry={loadData} />;

  const rootPerson = personsMap.get(ROOT_ID);

  return (
    <div style={{ minHeight: "100vh", background: "#0f1f38", fontFamily: "'Noto Sans', sans-serif" }}>
      <style>{TREE_CSS}</style>

      {/* HEADER */}
      <div style={{
        background: "linear-gradient(135deg, #2c1a0e 0%, #5a3210 100%)",
        color: "#f0e6d0", padding: "20px 24px 16px", textAlign: "center",
        borderBottom: "3px solid #b8860b",
      }}>
        <div style={{ fontSize: 11, letterSpacing: 4, color: "#c8a86a", marginBottom: 4, textTransform: "uppercase" }}>
          Gia Phả Dòng Họ
        </div>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, fontFamily: "'Noto Serif', serif", letterSpacing: 2, color: "#f5e6c0" }}>
          🌳 PHAN TỘC PHẢ HỆ
        </h1>
        <p style={{ margin: "6px 0 14px", fontSize: 12, color: "#a89060" }}>
          Ông Cố: Phan Tấn Liêu (1880–1955) · Thăng Phước
        </p>
        <SearchBar persons={persons} onJump={expandPathTo} />
      </div>

      {/* STATS */}
      <Stats persons={persons} />

      {/* TABS */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "8px 16px 0" }}>
        {[
          ["tree", "🌲 Sơ đồ cây"],
          ["list", "📋 Danh sách"],
          ["manage", `➕ Thêm vào${pendingChanges.length > 0 ? ` (${pendingChanges.length})` : ""}`],
        ].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: "8px 20px", borderRadius: 20, border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: 600,
            background: tab === key ? "#e6a23c" : "#1a2e4e",
            color: tab === key ? "#1a2e4e" : "#a8b8d8",
            boxShadow: tab === key ? "0 3px 10px rgba(230,162,60,0.4)" : "none",
            transition: "all 0.2s",
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* CÂY PHẢ HỆ */}
      {tab === "tree" && (
        <div style={{ position: "relative", height: "calc(100vh - 290px)", minHeight: 480 }}>
          <div style={{
            position: "absolute", top: 12, right: 12, zIndex: 50,
            display: "flex", flexDirection: "column", gap: 6,
          }}>
            {[["＋", handleZoomIn], ["－", handleZoomOut], ["⌂", handleReset]].map(([label, fn]) => (
              <button key={label} onClick={fn} style={{
                width: 34, height: 34, borderRadius: 8, border: "1px solid #3a5680",
                background: "#1a2e4e", cursor: "pointer", fontSize: 16, color: "#e8edf7",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {label}
              </button>
            ))}
          </div>

          {!rootPerson ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: 40 }}>⚠️</div>
              <div style={{ color: "#f0a8a8", fontSize: 14 }}>Không tìm thấy gốc cây (ROOT_ID)</div>
              <div style={{ color: "#6f84ac", fontSize: 12 }}>Kiểm tra lại dữ liệu trong bảng persons</div>
            </div>
          ) : (
            <div ref={containerRef} style={{
              width: "100%", height: "100%", overflow: "auto",
              background: "repeating-linear-gradient(0deg,transparent,transparent 39px,#25395c 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,#25395c 40px)",
              backgroundSize: "40px 40px", cursor: "grab",
            }}>
              <div className="gp-tree" style={{
                display: "inline-block", minWidth: "100%",
                padding: "40px 60px 80px",
                transform: `scale(${scale})`, transformOrigin: "top center",
                transition: "transform 0.2s",
              }}>
                <ul>
                  <TreeNode
                    personId={ROOT_ID} personsMap={personsMap} adj={adj}
                    collapsedNodes={collapsedNodes} toggleCollapse={toggleCollapse}
                    onSelect={setSelectedPerson} highlightId={highlightId}
                    visited={new Set()}
                  />
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DANH SÁCH */}
      {tab === "list" && (
        <div style={{ padding: "16px 20px 40px", maxWidth: 900, margin: "0 auto" }}>
          {[1, 2, 3, 4, 5, 6, 7].map((gen) => {
            const members = persons.filter((p) => p.generation === gen);
            if (!members.length) return null;
            return (
              <div key={gen} style={{ marginBottom: 20 }}>
                <h3 style={{
                  margin: "0 0 10px", fontSize: 14, fontWeight: 700, color: "#e6a23c",
                  borderLeft: "3px solid #e6a23c", paddingLeft: 10,
                  fontFamily: "'Noto Serif', serif",
                }}>
                  Đời {gen} <span style={{ color: "#6f84ac", fontWeight: 400, fontSize: 12 }}>({members.length} người)</span>
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 10 }}>
                  {members.map((p) => (
                    <button key={p.id} onClick={() => setSelectedPerson(p)} style={{
                      background: "#1a2e4ecc", borderRadius: 12, padding: "10px 14px",
                      border: "1px solid #2e466e", textAlign: "left", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 12,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)", transition: "transform 0.15s",
                    }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
                    >
                      <div style={{
                        width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                        background: p.gender === "male"
                          ? "linear-gradient(135deg,#1a3a5c,#2563a8)"
                          : "linear-gradient(135deg,#6b2155,#c0527a)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontSize: 14, fontWeight: 700,
                        opacity: p.is_deceased ? 0.65 : 1, fontFamily: "'Noto Serif', serif",
                      }}>
                        {p.full_name.trim().split(" ").pop()?.[0]}
                      </div>
                      <div style={{ overflow: "hidden" }}>
                        <div style={{
                          fontSize: 13, fontWeight: 600,
                          color: p.is_deceased ? "#8a99b8" : "#e8edf7",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        }}>
                          {p.full_name}
                        </div>
                        <div style={{ fontSize: 11, color: "#6f84ac" }}>
                          {p.birth_year ?? "?"}{p.is_deceased ? ` – ${p.death_year ?? "?"}` : ""}
                          {" · "}{p.gender === "male" ? "Nam" : "Nữ"}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QUẢN LÝ */}
      {tab === "manage" && (
        <ManagePanel
          allPersons={persons}
          editingPerson={editingPerson} setEditingPerson={setEditingPerson}
          isAdmin={isAdmin} onAdminLogin={handleAdminLogin} onAdminLogout={handleAdminLogout}
          pendingChanges={pendingChanges}
          onApproveChange={approveChange} onRejectChange={rejectChange}
          onSubmitAdd={submitAddPerson} onSubmitUpdate={submitUpdatePerson}
        />
      )}

      {/* MODAL */}
      <PersonModal
        person={selectedPerson}
        onClose={() => setSelectedPerson(null)}
        onEdit={(p) => { setSelectedPerson(null); setEditingPerson(p); setTab("manage"); }}
      />

      {/* FOOTER */}
      <div style={{ textAlign: "center", padding: 12, fontSize: 11, color: "#6f84ac", borderTop: "1px solid #2e466e" }}>
        Gia Phả Họ Phan · {persons.length} thành viên · Supabase + Vercel · {new Date().getFullYear()}
      </div>
    </div>
  );
}
