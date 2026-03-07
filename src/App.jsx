import { useState, useEffect } from "react";

/* ─── THEME ─────────────────────────────────────────────── */
const T = {
  bg:"#03080f", surface:"#080f1a", card:"#0b1520", border:"#0e2035",
  borderHi:"#1a3a5c", text:"#e2eaf5", muted:"#4a6380",
  accent:"#00d4ff", purple:"#a78bfa", green:"#22d3a0",
  red:"#f87171", yellow:"#fbbf24", orange:"#fb923c",
};

/* ─── HELPERS ────────────────────────────────────────────── */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function Tag({ children, color = T.accent, bg = "#001a22" }) {
  return (
    <span style={{
      fontSize:10, fontWeight:700, letterSpacing:".1em",
      textTransform:"uppercase", padding:"3px 9px", borderRadius:5,
      background:bg, color, border:`1px solid ${color}22`,
    }}>{children}</span>
  );
}

/* ─── ORDER QUESTION ─────────────────────────────────────── */
function OrderQuestion({ options, userOrder, onReorder, confirmed, correctOrder }) {
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  function move(pos, dir) {
    const newOrder = [...userOrder];
    const target = pos + dir;
    if (target < 0 || target >= newOrder.length) return;
    [newOrder[pos], newOrder[target]] = [newOrder[target], newOrder[pos]];
    onReorder(newOrder);
  }

  function handleDrop(e, i) {
    e.preventDefault();
    if (dragging === null || dragging === i) { setDragging(null); setDragOver(null); return; }
    const newOrder = [...userOrder];
    const item = newOrder.splice(dragging, 1)[0];
    newOrder.splice(i, 0, item);
    onReorder(newOrder);
    setDragging(null); setDragOver(null);
  }

  const btnStyle = (disabled) => ({
    width:28, height:28, borderRadius:6, border:`1px solid ${T.border}`,
    background:T.surface, color: disabled ? T.border : T.muted,
    fontSize:14, cursor: disabled ? "default" : "pointer",
    display:"flex", alignItems:"center", justifyContent:"center",
    flexShrink:0, transition:"color .15s",
  });

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      <div style={{ fontSize:12, color:T.muted, marginBottom:4, fontFamily:"'JetBrains Mono',monospace" }}>
        {confirmed ? "Ordinea corectă:" : "↕ Trage sau folosește săgețile"}
      </div>
      {confirmed ? correctOrder.map((idx, pos) => {
        const isRight = userOrder[pos] === idx;
        return (
          <div key={pos} style={{
            display:"flex", gap:10, alignItems:"center", padding:"10px 14px", borderRadius:9,
            background: isRight ? "#0d2e1a" : "#2d0f0f",
            border:`1.5px solid ${isRight ? T.green : T.red}`,
          }}>
            <span style={{ fontSize:11, fontFamily:"'JetBrains Mono',monospace", color:T.muted, minWidth:20 }}>{pos+1}.</span>
            <code style={{ flex:1, fontSize:13, color: isRight ? T.green : T.red, fontFamily:"'JetBrains Mono',monospace", whiteSpace:"pre-wrap" }}>
              {options[idx]}
            </code>
            <span style={{ fontSize:14 }}>{isRight ? "✓" : "✗"}</span>
          </div>
        );
      }) : userOrder.map((optIdx, pos) => (
        <div key={pos} draggable
          onDragStart={() => setDragging(pos)}
          onDragOver={(e) => { e.preventDefault(); setDragOver(pos); }}
          onDrop={(e) => handleDrop(e, pos)}
          onDragEnd={() => { setDragging(null); setDragOver(null); }}
          style={{
            display:"flex", gap:8, alignItems:"center", padding:"10px 12px",
            borderRadius:9, userSelect:"none",
            background: dragOver === pos ? "#1a2e45" : T.surface,
            border:`1.5px solid ${dragOver===pos ? T.accent : dragging===pos ? T.purple : T.border}`,
            transition:"border-color .15s, background .15s",
          }}>
          <span style={{ fontSize:11, color:T.muted, fontFamily:"'JetBrains Mono',monospace", minWidth:18 }}>{pos+1}.</span>
          <code style={{ flex:1, fontSize:13, color:T.text, fontFamily:"'JetBrains Mono',monospace", whiteSpace:"pre-wrap", cursor:"grab" }}>{options[optIdx]}</code>
          <div style={{ display:"flex", flexDirection:"column", gap:3, flexShrink:0 }}>
            <button onClick={() => move(pos, -1)} disabled={pos===0} style={btnStyle(pos===0)}>▲</button>
            <button onClick={() => move(pos, 1)} disabled={pos===userOrder.length-1} style={btnStyle(pos===userOrder.length-1)}>▼</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── CHOICE OPTION ─────────────────────────────────────── */
function ChoiceOpt({ label, text, i, sel, confirmed, isCorrect, isWrong, onToggle }) {
  let bg=T.surface, bc=T.border, col="#94a3b8", lbg="#080f1a";
  if (confirmed) {
    if (isCorrect) { bg="#061c10"; bc=T.green; col=T.green; lbg="#0a2e18"; }
    else if (isWrong) { bg="#1c0606"; bc=T.red; col=T.red; lbg="#2e0a0a"; }
  } else if (sel) { bg="#0a1e38"; bc=T.accent; col="#7dd3fc"; lbg="#0c2a4a"; }
  return (
    <button disabled={confirmed} onClick={() => onToggle(i)} style={{
      display:"flex", alignItems:"center", gap:12, padding:"11px 14px",
      borderRadius:10, background:bg, border:`1.5px solid ${bc}`, color:col,
      cursor:confirmed?"default":"pointer", textAlign:"left",
      fontFamily:"'Outfit',sans-serif", fontSize:14, width:"100%",
      transition:"all .15s", outline:"none",
    }}>
      <span style={{
        width:26, height:26, borderRadius:6, flexShrink:0,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:11, fontWeight:800, fontFamily:"'JetBrains Mono',monospace",
        background:lbg, border:`1px solid ${bc}44`,
      }}>{label}</span>
      <span style={{ flex:1, lineHeight:1.5, textAlign:"left", whiteSpace:"pre-wrap" }}>{text}</span>
      {confirmed && <span style={{ fontSize:14, fontWeight:700 }}>{isCorrect?"✓":isWrong?"✗":""}</span>}
    </button>
  );
}

/* ─── QUIZ SCREEN ────────────────────────────────────────── */
function Quiz({ questions, onFinish, onMenu }) {
  const [cur, setCur] = useState(0);
  const [sel, setSel] = useState([]);
  const [orderState, setOrderState] = useState(null);
  const [states, setStates] = useState(() => new Array(questions.length).fill(null));
  const [score, setScore] = useState(0);
  const [shake, setShake] = useState(false);

  const q = questions[cur];
  const st = states[cur];
  const confirmed = st !== null;
  const isLast = cur + 1 >= questions.length;
  const isOrder = q.type === "order";

  useEffect(() => {
    if (st) {
      setSel(st.selected || []);
      setOrderState(st.orderState || null);
    } else {
      setSel([]);
      setOrderState(isOrder ? shuffle(q.options.map((_, i) => i)) : null);
    }
  }, [cur]);

  function toggle(i) {
    if (confirmed) return;
    if (q.type === "single") setSel([i]);
    else setSel(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);
  }

  function confirm() {
    if (isOrder) {
      const correct = JSON.stringify(orderState) === JSON.stringify(q.answers);
      if (correct) setScore(s => s + 1);
      setStates(p => { const n=[...p]; n[cur]={orderState:[...orderState],correct}; return n; });
    } else {
      if (!sel.length) { setShake(true); setTimeout(() => setShake(false), 400); return; }
      const correct = [...sel].sort().join(",") === [...q.answers].sort().join(",");
      if (correct) setScore(s => s + 1);
      setStates(p => { const n=[...p]; n[cur]={selected:[...sel],correct}; return n; });
    }
  }

  function next() {
    if (isLast) {
      const history = states.map((s, i) => s ? { topic:questions[i].topic, correct:s.correct } : null);
      onFinish(score, history);
    } else setCur(c => c + 1);
  }

  let fbBg="", fbBc="", fbCol="", fbIcon="", fbTxt="";
  if (confirmed) {
    if (st.correct) { fbBg="#061c10"; fbBc=T.green; fbCol=T.green; fbIcon="✅"; fbTxt="Corect!"; }
    else {
      fbBg="#1c0606"; fbBc=T.red; fbCol="#fca5a5"; fbIcon="❌";
      if (isOrder) fbTxt="Ordinea corectă: "+q.answers.map(i=>q.options[i]).join(" → ");
      else fbTxt="Răspuns"+(q.answers.length>1?"urile corecte: ":" corect: ")+q.answers.map(i=>q.options[i]).join(", ");
    }
  }

  const pct = Math.round((cur / questions.length) * 100);

  return (
    <div style={{ width:"100%", maxWidth:680 }}>
      <style>{`
        @keyframes cardIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }
      `}</style>

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, paddingBottom:16, borderBottom:`1px solid ${T.border}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }} onClick={onMenu}>
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:18, fontWeight:700, color:T.accent }}>USO</span>
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:T.muted }}>quiz</span>
        </div>
        <div style={{ display:"flex", gap:12, alignItems:"center" }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, padding:"4px 12px", borderRadius:7, background:T.surface, border:`1px solid ${T.border}` }}>
            <span style={{ color:T.green, fontWeight:700 }}>{score}</span>
            <span style={{ color:T.muted }}>/{cur}</span>
          </div>
          <span style={{ fontSize:11, color:T.muted, fontFamily:"'JetBrains Mono',monospace" }}>{cur+1}/{questions.length}</span>
        </div>
      </div>

      {/* Progress */}
      <div style={{ height:3, background:T.surface, borderRadius:2, overflow:"hidden", marginBottom:22 }}>
        <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${T.accent},${T.purple})`, borderRadius:2, transition:"width .5s ease" }} />
      </div>

      {/* Card */}
      <div style={{
        background:T.card, border:`1px solid ${T.border}`, borderRadius:16,
        padding:"24px 22px 20px",
        animation: shake ? "shake .4s ease" : "cardIn .3s ease",
        boxShadow:`0 0 60px ${T.accent}08`,
      }}>
        <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
          <Tag color={T.accent} bg="#001e2a">{q.topic}</Tag>
          <Tag color={isOrder?T.orange:q.type==="multi"?T.purple:T.muted} bg="#0f0f1a">
            {isOrder?"⇅ Ordonare":q.type==="multi"?"☑ Multi":"◉ Single"}
          </Tag>
        </div>

        <p style={{ fontSize:15, lineHeight:1.7, marginBottom:20, color:T.text, whiteSpace:"pre-wrap", fontFamily:"'Outfit',sans-serif" }}>
          {q.question}
        </p>

        {isOrder ? (
          <OrderQuestion
            options={q.options}
            userOrder={orderState || q.options.map((_,i)=>i)}
            onReorder={setOrderState}
            confirmed={confirmed}
            correctOrder={q.answers}
          />
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {q.options.map((opt,i) => (
              <ChoiceOpt key={i}
                label={["A","B","C","D","E"][i]} text={opt} i={i}
                sel={sel.includes(i)} confirmed={confirmed}
                isCorrect={q.answers.includes(i)}
                isWrong={confirmed && st.selected?.includes(i) && !q.answers.includes(i)}
                onToggle={toggle}
              />
            ))}
          </div>
        )}

        {confirmed && (
          <div style={{
            display:"flex", gap:10, alignItems:"flex-start", marginTop:16,
            padding:"12px 14px", borderRadius:10,
            background:fbBg, border:`1px solid ${fbBc}`, color:fbCol, fontSize:13, lineHeight:1.6,
          }}>
            <span>{fbIcon}</span><span>{fbTxt}</span>
          </div>
        )}

        <div style={{ marginTop:20, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <button onClick={() => cur>0 && setCur(c=>c-1)} disabled={cur===0} style={{
            padding:"10px 18px", borderRadius:9, border:`1px solid ${T.border}`,
            background:"transparent", color:cur===0?T.border:T.muted,
            fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:600,
            cursor:cur===0?"default":"pointer",
          }}>← Înapoi</button>
          <div style={{ display:"flex", gap:10 }}>
            {!confirmed && (
              <button onClick={confirm} style={{
                padding:"10px 22px", borderRadius:9, border:"none",
                background:`linear-gradient(135deg,#1d4ed8,#6d28d9)`,
                color:"#fff", fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:700, cursor:"pointer",
              }}>Confirmă</button>
            )}
            <button onClick={next} style={{
              padding:"10px 22px", borderRadius:9, border:"none",
              background:`linear-gradient(135deg,#047857,#0369a1)`,
              color:"#fff", fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:700, cursor:"pointer",
            }}>{isLast ? "Termină ✓" : "Următoarea →"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── RESULTS ────────────────────────────────────────────── */
function Results({ score, total, history, onMenu, onRetry }) {
  const pct = score / total;
  const [emoji, grade, col] =
    pct>=.9 ? ["🏆","Excelent!",T.green] :
    pct>=.7 ? ["👍","Bine!",T.accent] :
    pct>=.5 ? ["📚","Mai studiază",T.yellow] :
    ["💡","Continuă!",T.red];

  const stats = {};
  history.filter(Boolean).forEach(h => {
    if (!stats[h.topic]) stats[h.topic]={c:0,t:0};
    stats[h.topic].t++;
    if (h.correct) stats[h.topic].c++;
  });

  return (
    <div style={{
      width:"100%", maxWidth:580, background:T.card,
      border:`1px solid ${T.border}`, borderRadius:20,
      padding:"36px 28px 32px", display:"flex", flexDirection:"column",
      alignItems:"center", boxShadow:`0 0 80px ${col}15`,
    }}>
      <div style={{ fontSize:56, marginBottom:8 }}>{emoji}</div>
      <div style={{ fontSize:18, fontWeight:600, color:T.muted, marginBottom:10 }}>{grade}</div>
      <div style={{ display:"flex", alignItems:"baseline", gap:4, marginBottom:4 }}>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:80, fontWeight:700, color:col }}>{score}</span>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:28, color:T.border }}>/{total}</span>
      </div>
      <div style={{ fontSize:12, color:T.muted, marginBottom:32, fontFamily:"'JetBrains Mono',monospace" }}>
        {Math.round(pct*100)}% corect
      </div>

      {Object.keys(stats).length>0 && (
        <div style={{ width:"100%", marginBottom:28 }}>
          <div style={{ fontSize:10, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:".1em", marginBottom:12 }}>Pe capitole</div>
          {Object.entries(stats).map(([topic,s]) => {
            const p=s.c/s.t;
            const c=p===1?T.green:p>=.5?T.yellow:T.red;
            return (
              <div key={topic} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:7 }}>
                <span style={{ fontSize:11, color:T.muted, width:160, flexShrink:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{topic}</span>
                <div style={{ flex:1, height:4, background:T.surface, borderRadius:2, overflow:"hidden" }}>
                  <div style={{ width:`${p*100}%`, height:"100%", background:c, borderRadius:2, transition:"width .6s ease" }} />
                </div>
                <span style={{ fontSize:10, color:T.muted, fontFamily:"'JetBrains Mono',monospace", width:26, textAlign:"right" }}>{s.c}/{s.t}</span>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ display:"flex", gap:12 }}>
        <button onClick={onRetry} style={{
          padding:"11px 28px", borderRadius:10, border:"none",
          background:`linear-gradient(135deg,#047857,#0369a1)`,
          color:"#fff", fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight:700, cursor:"pointer",
        }}>↺ Reia Quiz</button>
        <button onClick={onMenu} style={{
          padding:"11px 28px", borderRadius:10,
          border:`1px solid ${T.borderHi}`, background:"transparent",
          color:T.muted, fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight:600, cursor:"pointer",
        }}>Meniu</button>
      </div>
    </div>
  );
}

/* ─── MENU ───────────────────────────────────────────────── */
function Menu({ allQ, generatedBatches, onStart, onDeleteBatch, onImportBatches, onRenameBatch }) {
  const [count, setCount] = useState("20");
  const [difficulty, setDifficulty] = useState("easy");

  const isAI = difficulty === "ai";
  const [publishing, setPublishing] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteLog, setDeleteLog] = useState("");
  const [renameModal, setRenameModal] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [importLog, setImportLog] = useState("");
  // For AI tab: all questions flat
  const allAIQ = (generatedBatches || []).flatMap(b => b.questions);
  const activeQ = isAI ? allAIQ : (allQ[difficulty] || []);
  const types = activeQ.reduce((a,q)=>{a[q.type]=(a[q.type]||0)+1;return a},{});
  const total = activeQ.length;

  // Group batches by difficulty for AI view
  const batchesByDiff = {};
  (generatedBatches || []).forEach(b => {
    if (!batchesByDiff[b.difficulty]) batchesByDiff[b.difficulty] = [];
    batchesByDiff[b.difficulty].push(b);
  });
  const diffColors = { easy: T.green, medium: T.yellow, hard: T.red };
  const diffLabels = { easy: "📗 Normal", medium: "📘 Mediu", hard: "🏆 Județean" };

  return (
    <div style={{
      width:"100%", maxWidth:560, background:T.card,
      border:`1px solid ${T.border}`, borderRadius:20,
      padding:"44px 36px", display:"flex", flexDirection:"column",
      alignItems:"center", boxShadow:`0 0 80px ${T.accent}0a`,
    }}>
      <div style={{ marginBottom:6 }}>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:38, fontWeight:700, color:T.accent }}>USO</span>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:16, color:T.muted, marginLeft:10 }}>quiz</span>
      </div>
      <p style={{ color:T.muted, fontSize:13, marginBottom:24, textAlign:"center", lineHeight:1.6, maxWidth:380 }}>
        {isAI
          ? `${total} întrebări generate cu Gemini AI`
          : `${total} întrebări — ${difficulty === "easy" ? "nivel normal (clasa 11-12)" : difficulty === "medium" ? "nivel mediu (intermediar)" : "nivel județean (dificil)"}`
        }
      </p>

      {/* Difficulty selector */}
      <div style={{ display:"flex", gap:8, marginBottom:24, width:"100%" }}>
        {[
          {v:"easy", label:"📗 Normal", col:T.green},
          {v:"medium", label:"📘 Mediu", col:T.yellow},
          {v:"hard", label:"🏆 Județean", col:T.red},
          {v:"ai", label:"🤖 Gemini AI", col:T.purple},
        ].map(({v,label,col}) => (
          <button key={v} onClick={() => setDifficulty(v)} style={{
            flex:1, padding:"11px", borderRadius:10,
            border:`2px solid ${difficulty===v ? col : T.border}`,
            background: difficulty===v ? col+"18" : T.surface,
            color: difficulty===v ? col : T.muted,
            fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:700, cursor:"pointer",
            transition:"all .2s",
          }}>{label}</button>
        ))}
      </div>

      {/* AI section — batches grouped by difficulty */}
      {isAI ? (
        <div style={{ width:"100%", marginBottom:16 }}>
          {total === 0 ? (
            <div style={{
              textAlign:"center", padding:"24px 16px",
              background:T.surface, border:`1px dashed ${T.purple}44`,
              borderRadius:12, marginBottom:16,
            }}>
              <div style={{ fontSize:32, marginBottom:8 }}>🤖</div>
              <div style={{ color:T.muted, fontSize:13, lineHeight:1.7 }}>
                Nu ai întrebări generate încă.<br/>
                Mergi la <span style={{ color:T.purple, fontWeight:600 }}>⚙ admin</span> și generează din carte.
              </div>
            </div>
          ) : (
            Object.entries(batchesByDiff).map(([diff, batches]) => (
              <div key={diff} style={{ marginBottom:20 }}>
                <div style={{
                  fontSize:12, fontWeight:700, color:diffColors[diff],
                  textTransform:"uppercase", letterSpacing:".08em",
                  marginBottom:8, display:"flex", alignItems:"center", gap:8,
                }}>
                  {diffLabels[diff]}
                  <span style={{ color:T.muted, fontWeight:400 }}>
                    ({batches.reduce((s,b)=>s+b.questions.length,0)} întrebări)
                  </span>
                </div>
                {batches.map(batch => (
                  <div key={batch.id} style={{
                    background:T.surface, border:`1px solid ${T.border}`,
                    borderRadius:10, padding:"10px 14px", marginBottom:8,
                    display:"flex", alignItems:"center", gap:10,
                  }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, color:T.text, fontWeight:600 }}>
                        {batch.name || `${batch.questions.length} întrebări`}
                      </div>
                      <div style={{ fontSize:11, color:T.muted, fontFamily:"'JetBrains Mono',monospace", marginTop:2 }}>
                        {batch.questions.length} întrebări • {batch.date} • {batch.source}
                      </div>
                    </div>
                    <button onClick={() => onStart(batch.questions.length, "ai_batch_"+batch.id)} style={{
                      background:T.green+"18", border:`1px solid ${T.green}`,
                      color:T.green, borderRadius:7, padding:"5px 12px",
                      cursor:"pointer", fontSize:12, fontWeight:600,
                    }}>▶ Joacă</button>
                    <button onClick={() => { setRenameModal(batch); setRenameValue(batch.name || ""); }} title="Redenumește" style={{
                      background:T.accent+"18", border:`1px solid ${T.accent}44`,
                      color:T.accent, borderRadius:7, padding:"5px 10px",
                      cursor:"pointer", fontSize:13,
                    }}>✏️</button>
                    <button onClick={() => { setDeleteModal(batch); setDeleteLog(""); }} style={{
                      background:"transparent", border:`1px solid ${T.red}44`,
                      color:T.red, borderRadius:7, padding:"5px 10px",
                      cursor:"pointer", fontSize:12,
                    }}>🗑</button>
                  </div>
                ))}
              </div>
            ))
          )}

          {total > 0 && (
            <div style={{ display:"flex", gap:8, marginTop:4, width:"100%" }}>
              <button onClick={() => onStart(total, "ai")} style={{
                background:`linear-gradient(135deg,#4c1d95,#6d28d9)`,
                color:"#fff", padding:"13px 28px", fontSize:14, borderRadius:12,
                border:"none", fontFamily:"'Outfit',sans-serif", fontWeight:700,
                cursor:"pointer", flex:1,
              }}>
                ▶ Joacă toate ({total} întrebări)
              </button>
              <button title="Exportă tot ca JSON" onClick={() => {
                const blob = new Blob([JSON.stringify(generatedBatches, null, 2)], { type:"application/json" });
                const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
                a.download = `ai_questions_${Date.now()}.json`; a.click();
              }} style={{
                background:"#0a1a10", border:"1px solid #22c55e44",
                color:"#22c55e", borderRadius:12, padding:"13px 16px",
                cursor:"pointer", fontSize:13, fontWeight:700, whiteSpace:"nowrap",
              }}>⬇ Export</button>
              <label title="Importă JSON" style={{
                background:T.accent+"18", border:`1px solid ${T.accent}44`,
                color:T.accent, borderRadius:12, padding:"13px 16px",
                cursor:"pointer", fontSize:13, fontWeight:700, whiteSpace:"nowrap",
              }}>
                ⬆ Import
                <input type="file" accept=".json" style={{ display:"none" }} onChange={e => {
                  const file = e.target.files[0]; if (!file) return;
                  const reader = new FileReader();
                  reader.onload = ev => {
                    try {
                      const data = JSON.parse(ev.target.result);
                      const batches = Array.isArray(data) ? data : [];
                      if (!batches.length) { setImportLog("❌ JSON invalid sau gol"); return; }
                      onImportBatches(batches);
                      setImportLog(`✅ ${batches.length} batch-uri importate!`);
                      setTimeout(() => setImportLog(""), 3000);
                    } catch { setImportLog("❌ Eroare la citirea JSON"); }
                  };
                  reader.readAsText(file);
                  e.target.value = "";
                }} />
              </label>
            </div>
          )}
          {!total && (
            <label title="Importă JSON" style={{
              background:T.accent+"18", border:`1px solid ${T.accent}44`,
              color:T.accent, borderRadius:12, padding:"13px 16px",
              cursor:"pointer", fontSize:13, fontWeight:700, display:"block",
              textAlign:"center", width:"100%", boxSizing:"border-box",
            }}>
              ⬆ Importă întrebări (.json)
              <input type="file" accept=".json" style={{ display:"none" }} onChange={e => {
                const file = e.target.files[0]; if (!file) return;
                const reader = new FileReader();
                reader.onload = ev => {
                  try {
                    const data = JSON.parse(ev.target.result);
                    const batches = Array.isArray(data) ? data : [];
                    if (!batches.length) { setImportLog("❌ JSON invalid sau gol"); return; }
                    onImportBatches(batches);
                    setImportLog(`✅ ${batches.length} batch-uri importate!`);
                    setTimeout(() => setImportLog(""), 3000);
                  } catch { setImportLog("❌ Eroare la citirea JSON"); }
                };
                reader.readAsText(file);
                e.target.value = "";
              }} />
            </label>
          )}
          {importLog && (
            <div style={{
              fontSize:12, padding:"8px 12px", borderRadius:8, marginTop:4,
              background: importLog.startsWith("✅") ? "#061c10" : "#1c0606",
              color: importLog.startsWith("✅") ? T.green : T.red,
              border: `1px solid ${importLog.startsWith("✅") ? T.green : T.red}44`,
              fontFamily:"'JetBrains Mono',monospace",
            }}>{importLog}</div>
          )}

          {/* Delete modal */}
          {deleteModal && (
            <div style={{
              position:"fixed", inset:0, background:"#000a",
              display:"flex", alignItems:"center", justifyContent:"center", zIndex:999,
            }} onClick={() => !deleting && setDeleteModal(null)}>
              <div onClick={e => e.stopPropagation()} style={{
                background:T.card, border:`1px solid ${T.red}66`,
                borderRadius:14, padding:24, width:320, maxWidth:"90vw",
              }}>
                <div style={{ fontSize:18, fontWeight:700, color:T.text, marginBottom:6 }}>🗑 Șterge batch</div>
                <div style={{ fontSize:13, color:T.muted, marginBottom:20 }}>
                  {deleteModal.name || `${deleteModal.questions.length} întrebări`} • {deleteModal.date}
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  <button disabled={deleting} onClick={() => {
                    onDeleteBatch(deleteModal.id);
                    setDeleteModal(null);
                  }} style={{
                    background:T.surface, border:`1px solid ${T.border}`,
                    color:T.text, borderRadius:9, padding:"10px 16px",
                    cursor:"pointer", fontSize:13, textAlign:"left",
                  }}>
                    🗑 Confirmă ștergerea
                    <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>Dispare din browserul tău</div>
                  </button>
                  {deleteLog && (
                    <div style={{ fontSize:11, color: deleteLog.startsWith("❌") ? T.red : T.green,
                      fontFamily:"'JetBrains Mono',monospace" }}>{deleteLog}</div>
                  )}
                  <button disabled={deleting} onClick={() => setDeleteModal(null)} style={{
                    background:"transparent", border:`1px solid ${T.border}`,
                    color:T.muted, borderRadius:9, padding:"8px 16px",
                    cursor:"pointer", fontSize:13,
                  }}>Anulează</button>
                </div>
              </div>
            </div>
          )}

          {/* Rename modal */}
          {renameModal && (
            <div style={{
              position:"fixed", inset:0, background:"#000a",
              display:"flex", alignItems:"center", justifyContent:"center", zIndex:999,
            }} onClick={() => setRenameModal(null)}>
              <div onClick={e => e.stopPropagation()} style={{
                background:T.card, border:`1px solid ${T.accent}66`,
                borderRadius:14, padding:24, width:320, maxWidth:"90vw",
              }}>
                <div style={{ fontSize:18, fontWeight:700, color:T.text, marginBottom:16 }}>✏️ Redenumește batch</div>
                <input
                  autoFocus
                  value={renameValue}
                  onChange={e => setRenameValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") { onRenameBatch(renameModal.id, renameValue); setRenameModal(null); }
                    if (e.key === "Escape") setRenameModal(null);
                  }}
                  placeholder={`${renameModal.questions.length} întrebări`}
                  style={{
                    width:"100%", background:T.surface, border:`1px solid ${T.accent}`,
                    borderRadius:9, padding:"10px 14px", color:T.text, fontSize:14,
                    outline:"none", boxSizing:"border-box", marginBottom:12,
                    fontFamily:"'Outfit',sans-serif",
                  }}
                />
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={() => { onRenameBatch(renameModal.id, renameValue); setRenameModal(null); }} style={{
                    flex:1, background:T.accent+"22", border:`1px solid ${T.accent}`,
                    color:T.accent, borderRadius:9, padding:"9px", cursor:"pointer", fontSize:13, fontWeight:600,
                  }}>Salvează</button>
                  <button onClick={() => setRenameModal(null)} style={{
                    background:"transparent", border:`1px solid ${T.border}`,
                    color:T.muted, borderRadius:9, padding:"9px 16px", cursor:"pointer", fontSize:13,
                  }}>Anulează</button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Type badges */}
          <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap", justifyContent:"center" }}>
            {[
              {icon:"◉", label:`Single (${types.single||0})`, col:T.muted},
              {icon:"☑", label:`Multi (${types.multi||0})`, col:T.purple},
              {icon:"⇅", label:`Ordonare (${types.order||0})`, col:T.orange},
            ].map(({icon,label,col}) => (
              <div key={label} style={{
                padding:"8px 14px", borderRadius:10,
                background:T.surface, border:`1px solid ${T.border}`,
                fontSize:13, color:col, display:"flex", alignItems:"center", gap:7,
              }}>
                <span>{icon}</span><span>{label}</span>
              </div>
            ))}
          </div>

          {/* Count selector */}
          <div style={{ fontSize:13, color:T.muted, marginBottom:10 }}>Număr de întrebări:</div>
          <select value={count} onChange={e=>setCount(e.target.value)} style={{
            background:T.surface, color:T.text, border:`1px solid ${T.borderHi}`,
            borderRadius:9, padding:"9px 16px", fontSize:14,
            fontFamily:"'Outfit',sans-serif", cursor:"pointer", outline:"none",
            marginBottom:24, minWidth:220,
          }}>
            <option value="10">10 întrebări (rapid)</option>
            <option value="20">20 întrebări</option>
            <option value="50">50 întrebări</option>
            <option value="100">100 întrebări</option>
            <option value={String(total)}>Toate ({total})</option>
          </select>

          <button onClick={() => onStart(parseInt(count), difficulty)} style={{
            background:`linear-gradient(135deg,#1d4ed8,#6d28d9)`,
            color:"#fff", padding:"14px 48px", fontSize:15, borderRadius:12,
            border:"none", fontFamily:"'Outfit',sans-serif", fontWeight:700,
            cursor:"pointer", letterSpacing:".02em",
          }}>
            Începe Quiz →
          </button>

          <div style={{ marginTop:20, fontSize:11, color:T.muted, textAlign:"center", lineHeight:1.6 }}>
            Întrebările sunt amestecate aleatoriu la fiecare sesiune.<br/>
            Fără internet necesar.
          </div>
        </>
      )}
    </div>
  );
}

/* ─── APP ─────────────────────────────────────────────────── */

/* ─── ADMIN PANEL ─────────────────────────────────────────── */
function AdminPanel({ allQ, chapters, onAddQuestions, onPlayNow, onBack }) {
  const [step, setStep] = useState("config");
  const [apiKey, setApiKey] = useState(() => sessionStorage.getItem("gemini_key") || "");
  const [inputMode, setInputMode] = useState("pdf"); // "pdf" | "text" | "multi" | "chapters"
  const [pdfFiles, setPdfFiles] = useState([]); // [{file, name}]
  const [pastedText, setPastedText] = useState("");
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [difficulty, setDifficulty] = useState("medium");
  const [count, setCount] = useState(50);
  const [topic, setTopic] = useState("");
  const [log, setLog] = useState([]);
  const [generated, setGenerated] = useState([]);

  function addLog(msg, type = "info") {
    setLog(l => [...l, { msg, type }]);
  }

  function handlePDFSingle(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPdfFiles([{ file, name: file.name }]);
  }

  function handlePDFMulti(e) {
    const files = Array.from(e.target.files).map(f => ({ file: f, name: f.name }));
    setPdfFiles(prev => {
      const existing = new Set(prev.map(p => p.name));
      const newOnes = files.filter(f => !existing.has(f.name));
      return [...prev, ...newOnes];
    });
  }

  function removePDF(name) {
    setPdfFiles(prev => prev.filter(p => p.name !== name));
  }

  async function toBase64(file) {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result.split(",")[1]);
      r.onerror = rej;
      r.readAsDataURL(file);
    });
  }

  async function toText(file) {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.onerror = rej;
      r.readAsText(file);
    });
  }

  async function handleGenerate() {
    if (!apiKey) { addLog("Introdu API key-ul Gemini!", "error"); return; }
    if (inputMode === "pdf" && pdfFiles.length === 0) { addLog("Selectează un PDF!", "error"); return; }
    if (inputMode === "multi" && pdfFiles.length === 0) { addLog("Selectează cel puțin un PDF!", "error"); return; }
    if (inputMode === "text" && !pastedText.trim()) { addLog("Lipește text mai întâi!", "error"); return; }
    if (inputMode === "chapters" && selectedChapters.length === 0) { addLog("Selectează cel puțin un capitol!", "error"); return; }

    setLog([]);
    setStep("generating");

    try {
      const diffLabel = difficulty === "easy" ? "ușoare (nivel clasa 11-12, comenzi de bază)" :
                        difficulty === "medium" ? "intermediare (comenzi avansate, scripting, procese)" :
                        "dificile (nivel județean, subiecte complexe)";

      const topicHint = topic ? `Focusează-te pe subiectul: ${topic}.` : "Acoperă toate subiectele din document uniform.";

      const singleCount = Math.round(count * 0.6);
      const multiCount = Math.round(count * 0.25);
      const orderCount = count - singleCount - multiCount;

      const prompt = `Ești un profesor de informatică. Generează exact ${count} întrebări de tip quiz ${diffLabel} bazate pe materialul atașat.

${topicHint}

TIPURI DE ÎNTREBĂRI — generează OBLIGATORIU toate cele 3 tipuri în proporțiile exacte:
- ${singleCount} întrebări de tip "single" (un singur răspuns corect)
- ${multiCount} întrebări de tip "multi" (2-3 răspunsuri corecte din 4-5 variante)
- ${orderCount} întrebări de tip "order" (ordonează pașii/comenzile în ordinea corectă)

REGULI CRITICE:
1. Toate variantele de răspuns trebuie să aibă lungimi SIMILARE (±15 caractere) — nu da de gol răspunsul corect prin lungime
2. Răspunsul corect distribuit uniform la pozițiile 0, 1, 2, 3
3. Variantele greșite să fie plauzibile și tehnic corecte parțial
4. Întrebările să testeze înțelegerea, nu memorarea
5. Pentru "order": options = lista de pași/comenzi în ordine amestecată, answers = [indexul corect al pasului 1, indexul pasului 2, ...] adică ordinea corectă ca indici

FORMAT JSON — Returnează DOAR un array JSON valid, fără markdown, fără \`\`\`json:
[
  {
    "id": 1000,
    "topic": "Numele capitolului",
    "type": "single",
    "question": "Întrebare cu un singur răspuns?",
    "options": ["Varianta A", "Varianta B", "Varianta C", "Varianta D"],
    "answers": [2]
  },
  {
    "id": 1001,
    "topic": "Numele capitolului",
    "type": "multi",
    "question": "Care dintre următoarele sunt corecte?",
    "options": ["Varianta A", "Varianta B", "Varianta C", "Varianta D"],
    "answers": [0, 2]
  },
  {
    "id": 1002,
    "topic": "Numele capitolului",
    "type": "order",
    "question": "Ordonează pașii pentru a instala un pachet:",
    "options": ["apt-get install pachet", "sudo su", "apt-get update", "exit"],
    "answers": [1, 3, 2, 0]
  }
]

ID-urile să înceapă de la 1000 și să fie consecutive. Generează EXACT ${count} întrebări (${singleCount} single + ${multiCount} multi + ${orderCount} order).`;

      let parts = [];

      if (inputMode === "chapters") {
        const selected = chapters.filter(c => selectedChapters.includes(c.id));
        const combined = selected.map(c => `=== ${c.label} ===\n\n${c.text}`).join("\n\n");
        const totalTokens = selected.reduce((s,c) => s+c.tokens, 0);
        addLog(`Capitole: ${selected.map(c=>c.label).join(", ")}`, "info");
        addLog(`~${totalTokens.toLocaleString()} tokens. Trimit la Gemini...`, "info");
        parts = [{ text: `Materialul de studiu:\n\n${combined}\n\n---\n\n${prompt}` }];
      } else if (inputMode === "text") {
        addLog(`Text: ${pastedText.length.toLocaleString()} caractere. Trimit la Gemini...`, "info");
        parts = [{ text: `Materialul de studiu:\n\n${pastedText}\n\n---\n\n${prompt}` }];
      } else {
        const filesToProcess = inputMode === "multi" ? pdfFiles : [pdfFiles[0]];
        for (const { file, name } of filesToProcess) {
          addLog(`Procesez ${name} (${(file.size/1024/1024).toFixed(1)} MB)...`, "info");
          if (name.endsWith(".txt")) {
            const txt = await toText(file);
            parts.push({ text: `Conținut fișier ${name}:

${txt}` });
          } else {
            const b64 = await toBase64(file);
            parts.push({ inline_data: { mime_type: "application/pdf", data: b64 } });
          }
        }
        parts.push({ text: prompt });
        addLog(`${filesToProcess.length} fișier(e) trimise. Gemini procesează...`, "info");
      }

      const body = {
        contents: [{ parts }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 65536 }
      };

      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
      );

      const data = await resp.json();

      if (data.error) {
        addLog(`Eroare API: ${data.error.message}`, "error");
        setStep("config"); return;
      }

      addLog("Răspuns primit. Parsez JSON-ul...", "info");
      const responseParts = data.candidates?.[0]?.content?.parts || [];
      let text = responseParts.find(p => !p.thought)?.text || responseParts[responseParts.length - 1]?.text || "";
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();

      let questions;
      try {
        questions = JSON.parse(text);
      } catch(e) {
        const match = text.match(/\[[\s\S]*\]/);
        if (match) {
          try { questions = JSON.parse(match[0]); }
          catch(e2) { addLog(`Eroare parsare JSON: ${e2.message}`, "error"); setStep("config"); return; }
        } else {
          addLog("Nu am găsit JSON valid în răspuns.", "error");
          console.error("Full response:", JSON.stringify(data));
          setStep("config"); return;
        }
      }

      // Validate
      questions = questions.filter(q => q.question && q.options?.length >= 2 && q.answers?.length >= 1);
      if (!questions.length) { addLog("Nicio întrebare validă.", "error"); setStep("config"); return; }

      const base = Date.now() % 100000;
      questions = questions.map((q, i) => ({ ...q, id: base + i }));

      addLog(`✅ ${questions.length} întrebări valide!`, "success");
      setGenerated(questions);
      sessionStorage.setItem("gemini_key", apiKey);
      onAddQuestions(difficulty, questions);
      setStep("done");

    } catch(e) {
      addLog(`Eroare: ${e.message}`, "error");
      setStep("config");
    }
  }

  function downloadJSON() {
    const blob = new Blob([JSON.stringify(generated, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `questions_${difficulty}_${Date.now()}.json`;
    a.click();
  }



  const S = {
    wrap: { width:"100%", maxWidth:560, margin:"0 auto" },
    card: { background:T.card, border:`1px solid ${T.border}`, borderRadius:16, padding:28 },
    title: { fontSize:22, fontWeight:700, color:T.accent, marginBottom:6, fontFamily:"'JetBrains Mono',monospace" },
    sub: { fontSize:13, color:T.muted, marginBottom:24 },
    label: { fontSize:12, color:T.muted, marginBottom:6, display:"block", textTransform:"uppercase", letterSpacing:".08em" },
    input: { width:"100%", background:T.surface, border:`1px solid ${T.border}`, borderRadius:8,
             padding:"10px 14px", color:T.text, fontSize:14, outline:"none", boxSizing:"border-box" },
    btn: (col) => ({ background:col+"18", border:`1px solid ${col}`, color:col,
                     borderRadius:8, padding:"11px 22px", cursor:"pointer", fontWeight:600,
                     fontSize:14, width:"100%", marginTop:8 }),
    tabBtn: (active, col) => ({
      flex:1, padding:"8px", borderRadius:8, cursor:"pointer", fontSize:13,
      background: active ? col+"22" : T.surface,
      border: `1px solid ${active ? col : T.border}`,
      color: active ? col : T.muted, fontWeight: active ? 600 : 400,
    }),
    logBox: { background:T.surface, border:`1px solid ${T.border}`, borderRadius:8,
              padding:14, maxHeight:200, overflowY:"auto", fontFamily:"'JetBrains Mono',monospace", fontSize:12 },
  };

  if (step === "config") return (
    <div style={S.wrap}>
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{ fontSize:32, marginBottom:6 }}>⚙️</div>
        <div style={S.title}>Generează întrebări</div>
        <div style={S.sub}>Folosește Gemini AI pentru a genera din PDF sau text</div>
      </div>
      <div style={{ ...S.card, display:"flex", flexDirection:"column", gap:20 }}>

        {/* API Key */}
        <div>
          <label style={S.label}>Gemini API Key</label>
          <input style={S.input} type="password" placeholder="AIza..." autoComplete="off"
            value={apiKey} onChange={e => setApiKey(e.target.value)} />
          <div style={{ fontSize:11, color:T.muted, marginTop:4 }}>
            Obții gratuit de la{" "}
            <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" style={{ color:T.accent }}>
              aistudio.google.com
            </a>{" "}• Nu se salvează permanent
          </div>
        </div>

        {/* Input mode tabs */}
        <div>
          <label style={S.label}>Sursă material</label>
          <div style={{ display:"flex", gap:6, marginBottom:12, flexWrap:"wrap" }}>
            {[["pdf","📄 Un PDF"], ["multi","📚 Mai multe fișiere"], ["text","📋 Paste text"], ["chapters","📖 Capitole USO"]].map(([mode, label]) => (
              <button key={mode} onClick={() => setInputMode(mode)} style={{...S.tabBtn(inputMode===mode, T.accent), flex:"none", padding:"7px 12px"}}>
                {label}
              </button>
            ))}
          </div>

          {/* Single PDF */}
          {inputMode === "pdf" && (
            <label style={{ ...S.input, display:"flex", alignItems:"center", gap:10,
                            cursor:"pointer", color: pdfFiles[0] ? T.text : T.muted }}>
              <span style={{ fontSize:20 }}>📄</span>
              <span>{pdfFiles[0]?.name || "Click pentru a selecta PDF-ul..."}</span>
              <input type="file" accept=".pdf" onChange={handlePDFSingle} style={{ display:"none" }} />
            </label>
          )}

          {/* Multiple PDFs */}
          {inputMode === "multi" && (
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <label style={{ ...S.input, display:"flex", alignItems:"center", gap:10,
                              cursor:"pointer", color:T.muted }}>
                <span style={{ fontSize:20 }}>➕</span>
                <span>Adaugă PDF-uri...</span>
                <input type="file" accept=".pdf,.txt" multiple onChange={handlePDFMulti} style={{ display:"none" }} />
              </label>
              {pdfFiles.map(({ name, file }) => (
                <div key={name} style={{ display:"flex", alignItems:"center", gap:8,
                                         padding:"8px 12px", background:T.surface,
                                         border:`1px solid ${T.border}`, borderRadius:8 }}>
                  <span style={{ fontSize:14 }}>📄</span>
                  <span style={{ flex:1, fontSize:13, color:T.text }}>{name}</span>
                  <span style={{ fontSize:11, color:T.muted }}>{(file.size/1024).toFixed(0)}KB</span>
                  <button onClick={() => removePDF(name)} style={{
                    background:"transparent", border:"none", color:T.red,
                    cursor:"pointer", fontSize:16, padding:"0 4px",
                  }}>×</button>
                </div>
              ))}
              {pdfFiles.length > 0 && (
                <div style={{ fontSize:11, color:T.muted }}>
                  Total: {pdfFiles.length} fișiere • {(pdfFiles.reduce((s,p)=>s+p.file.size,0)/1024/1024).toFixed(1)} MB
                </div>
              )}
            </div>
          )}

          {/* Paste text */}
          {inputMode === "text" && (
            <div>
              <textarea
                style={{ ...S.input, height:140, resize:"vertical", fontSize:12,
                         fontFamily:"'JetBrains Mono',monospace", lineHeight:1.5 }}
                placeholder="Lipește textul unui capitol aici..."
                value={pastedText}
                onChange={e => setPastedText(e.target.value)}
              />
              <div style={{ fontSize:11, color:T.muted, marginTop:4 }}>
                {pastedText.length > 0
                  ? `${pastedText.length.toLocaleString()} caractere (~${Math.round(pastedText.length/4).toLocaleString()} tokens)`
                  : "0 caractere"}
              </div>
            </div>
          )}

          {/* Chapters selector */}
          {inputMode === "chapters" && (
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <span style={{ fontSize:11, color:T.muted }}>
                  {selectedChapters.length === 0 ? "Niciun capitol selectat" :
                   `${selectedChapters.length} capitol(e) — ~${chapters.filter(c=>selectedChapters.includes(c.id)).reduce((s,c)=>s+c.tokens,0).toLocaleString()} tokens`}
                </span>
                <div style={{ display:"flex", gap:6 }}>
                  <button onClick={() => setSelectedChapters(chapters.map(c=>c.id))} style={{
                    fontSize:11, color:T.accent, background:"transparent",
                    border:`1px solid ${T.accent}44`, borderRadius:5, padding:"3px 8px", cursor:"pointer"
                  }}>Toate</button>
                  <button onClick={() => setSelectedChapters([])} style={{
                    fontSize:11, color:T.muted, background:"transparent",
                    border:`1px solid ${T.border}`, borderRadius:5, padding:"3px 8px", cursor:"pointer"
                  }}>Niciuna</button>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:4, maxHeight:280, overflowY:"auto" }}>
                {chapters.map(c => {
                  const sel = selectedChapters.includes(c.id);
                  return (
                    <div key={c.id} onClick={() => setSelectedChapters(prev =>
                      sel ? prev.filter(id=>id!==c.id) : [...prev, c.id]
                    )} style={{
                      display:"flex", alignItems:"center", gap:10,
                      padding:"8px 12px", borderRadius:8, cursor:"pointer",
                      background: sel ? T.accent+"18" : T.surface,
                      border:`1px solid ${sel ? T.accent : T.border}`,
                      transition:"all .15s",
                    }}>
                      <div style={{
                        width:16, height:16, borderRadius:4, flexShrink:0,
                        background: sel ? T.accent : "transparent",
                        border:`1.5px solid ${sel ? T.accent : T.muted}`,
                        display:"flex", alignItems:"center", justifyContent:"center",
                      }}>
                        {sel && <span style={{ color:"#000", fontSize:11, fontWeight:700 }}>✓</span>}
                      </div>
                      <span style={{ flex:1, fontSize:13, color: sel ? T.text : T.muted }}>{c.label}</span>
                      <span style={{ fontSize:10, color:T.muted, fontFamily:"'JetBrains Mono',monospace" }}>
                        ~{c.tokens.toLocaleString()}t
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Difficulty + Count */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div>
            <label style={S.label}>Nivel dificultate</label>
            <select style={S.input} value={difficulty} onChange={e => setDifficulty(e.target.value)}>
              <option value="easy">📗 Normal</option>
              <option value="medium">📘 Mediu</option>
              <option value="hard">🏆 Județean</option>
            </select>
          </div>
          <div>
            <label style={S.label}>Număr întrebări</label>
            <select style={S.input} value={count} onChange={e => setCount(parseInt(e.target.value))}>
              {[10,20,30,50,100].map(n => <option key={n} value={n}>{n} întrebări</option>)}
            </select>
          </div>
        </div>

        {/* Topic */}
        <div>
          <label style={S.label}>Topic specific (opțional)</label>
          <input style={S.input} type="text" placeholder="ex: Permisiuni, Docker, Bash scripting..."
            value={topic} onChange={e => setTopic(e.target.value)} />
        </div>

        <button style={S.btn(T.accent)} onClick={handleGenerate}>
          ✨ Generează {count} întrebări
        </button>
        <button style={S.btn(T.muted)} onClick={onBack}>← Înapoi la quiz</button>
      </div>
    </div>
  );

  if (step === "generating") return (
    <div style={S.wrap}>
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{ width:48, height:48, borderRadius:"50%", border:`3px solid ${T.border}`,
                      borderTop:`3px solid ${T.accent}`, animation:"spin 0.9s linear infinite",
                      margin:"0 auto 16px" }} />
        <div style={S.title}>Se generează...</div>
        <div style={S.sub}>Gemini procesează materialul și creează întrebările</div>
      </div>
      <div style={S.logBox}>
        {log.map((l, i) => (
          <div key={i} style={{ color: l.type==="error" ? T.red : l.type==="success" ? T.green : T.muted, marginBottom:4 }}>
            › {l.msg}
          </div>
        ))}
      </div>
    </div>
  );

  if (step === "done") return (
    <div style={S.wrap}>
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{ fontSize:48, marginBottom:8 }}>🎉</div>
        <div style={S.title}>Gata!</div>
        <div style={S.sub}>{generated.length} întrebări generate — nivel {difficulty}</div>
      </div>
      <div style={S.logBox}>
        {log.map((l, i) => (
          <div key={i} style={{ color: l.type==="error" ? T.red : l.type==="success" ? T.green : T.muted, marginBottom:4 }}>
            › {l.msg}
          </div>
        ))}
      </div>
      <div style={{ marginTop:16, display:"flex", flexDirection:"column", gap:8 }}>
        <button style={S.btn(T.green)} onClick={() => onPlayNow(difficulty, generated)}>
          ▶ Joacă acum ({generated.length} întrebări)
        </button>
        <button style={S.btn(T.accent)} onClick={onBack}>
          🤖 Vezi toate întrebările AI
        </button>

        <button style={S.btn(T.yellow)} onClick={downloadJSON}>
          ⬇ Descarcă questions.json
        </button>
        <button style={S.btn(T.muted)} onClick={() => { setStep("config"); setGenerated([]); setLog([]); }}>
          ↺ Generează din nou
        </button>
      </div>
    </div>
  );

  return null;
}


/* ─── MAIN APP ───────────────────────────────────────────── */
export default function App() {
  const [screen, setScreen] = useState("loading");
  const [allQ, setAllQ] = useState({easy:[], medium:[], hard:[]});
  // generatedBatches: [{id, difficulty, date, source, questions:[]}]
  const [chapters, setChapters] = useState([]);
  const [generatedBatches, setGeneratedBatches] = useState(() => {
    try { return JSON.parse(localStorage.getItem("generated_batches") || "[]"); }
    catch { return []; }
  });
  const [questions, setQuestions] = useState([]);
  const [finalScore, setFinalScore] = useState(0);
  const [finalHistory, setFinalHistory] = useState([]);
  const [pendingCount, setPendingCount] = useState(20);
  const [pendingDiff, setPendingDiff] = useState("easy");
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch("./questions.json").then(r => { if (!r.ok) throw new Error("Nu s-a putut încărca questions.json"); return r.json(); }),
      fetch("./ai_questions.json").then(r => r.ok ? r.json() : []).catch(() => []),
      fetch("./chapters.json").then(r => r.ok ? r.json() : []).catch(() => []),
    ]).then(([qData, aiData, chapData]) => {
      setAllQ(qData);
      setChapters(chapData);
      // Merge remote AI batches with local ones (remote takes priority, deduplicate by id)
      const localBatches = JSON.parse(localStorage.getItem("generated_batches") || "[]");
      const remoteIds = new Set(aiData.map(b => b.id));
      const localOnly = localBatches.filter(b => !remoteIds.has(b.id)).map(b => ({...b, _local: true}));
      const remoteMarked = aiData.map(b => ({...b, _local: false}));
      setGeneratedBatches([...remoteMarked, ...localOnly]);
      setScreen("menu");
    }).catch(e => { setError(e.message); setScreen("error"); });
  }, []);

  function saveBatches(batches) {
    setGeneratedBatches(batches);
    localStorage.setItem("generated_batches", JSON.stringify(batches));
  }

  function addGeneratedQuestions(difficulty, newQ, source) {
    const now = new Date();
    const date = now.toLocaleDateString("ro-RO") + " " + now.toLocaleTimeString("ro-RO", {hour:"2-digit", minute:"2-digit"});
    const batch = { id: Date.now(), difficulty, date, source: source || "PDF", questions: newQ };
    saveBatches([...generatedBatches, batch]);
  }

  function deleteBatch(id) {
    saveBatches(generatedBatches.filter(b => b.id !== id));
  }

  function importBatches(batches) {
    const existingIds = new Set(generatedBatches.map(b => b.id));
    const newBatches = batches.filter(b => !existingIds.has(b.id));
    const merged = [...generatedBatches, ...newBatches];
    saveBatches(merged);
  }

  function renameBatch(batchId, newName) {
    const updated = generatedBatches.map(b => b.id === batchId ? {...b, name: newName} : b);
    saveBatches(updated);
  }

  function start(count, diff) {
    let pool, pendDiff;
    if (diff === "ai") {
      pool = generatedBatches.flatMap(b => b.questions);
      pendDiff = "ai";
    } else if (diff.startsWith("ai_batch_")) {
      const batchId = parseInt(diff.replace("ai_batch_", ""));
      const batch = generatedBatches.find(b => b.id === batchId);
      pool = batch ? batch.questions : [];
      pendDiff = "ai";
    } else {
      pool = allQ[diff] || [];
      pendDiff = diff;
    }
    const picked = shuffle(pool).slice(0, Math.min(count, pool.length));
    setQuestions(picked);
    setPendingCount(count);
    setPendingDiff(pendDiff);
    setScreen("quiz");
  }

  function finish(score, history) {
    setFinalScore(score);
    setFinalHistory(history);
    setScreen("results");
  }

  return (
    <div style={{
      background:T.bg, fontFamily:"'Outfit',sans-serif", color:T.text,
      minHeight:"100vh", display:"flex", flexDirection:"column",
      alignItems:"center", padding:"28px 16px 80px",
      backgroundImage:`
        radial-gradient(ellipse 70% 50% at 10% 5%, #00d4ff08 0%, transparent 60%),
        radial-gradient(ellipse 50% 40% at 90% 95%, #a78bfa08 0%, transparent 60%)
      `,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {screen === "loading" && (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:20, marginTop:80 }}>
          <div style={{
            width:48, height:48, borderRadius:"50%",
            border:`3px solid ${T.border}`, borderTop:`3px solid ${T.accent}`,
            animation:"spin 0.9s linear infinite",
          }} />
          <span style={{ color:T.muted, fontFamily:"'JetBrains Mono',monospace", fontSize:13 }}>se încarcă întrebările...</span>
        </div>
      )}

      {screen === "error" && (
        <div style={{ marginTop:80, textAlign:"center", color:T.red, maxWidth:400 }}>
          <div style={{ fontSize:40, marginBottom:16 }}>⚠️</div>
          <div style={{ fontSize:15, marginBottom:8 }}>Eroare la încărcarea întrebărilor</div>
          <div style={{ fontSize:12, color:T.muted }}>{error}</div>
          <div style={{ fontSize:12, color:T.muted, marginTop:12 }}>
            Asigură-te că <code style={{color:T.accent}}>questions.json</code> se află în folderul <code style={{color:T.accent}}>public/</code>
          </div>
        </div>
      )}

      {screen === "menu" && (
        <>
          <Menu
            allQ={allQ}
            generatedBatches={generatedBatches}
            onStart={start}
            onDeleteBatch={deleteBatch}
            onImportBatches={importBatches}
            onRenameBatch={renameBatch}
          />
          <button
            onClick={() => setScreen("admin")}
            style={{
              marginTop:16, background:"transparent", border:`1px solid ${T.border}`,
              color:T.muted, borderRadius:8, padding:"8px 18px", cursor:"pointer",
              fontSize:12, fontFamily:"'JetBrains Mono',monospace",
            }}
          >⚙ admin</button>
        </>
      )}

      {screen === "admin" && (
        <AdminPanel
          allQ={allQ}
          chapters={chapters}
          onAddQuestions={addGeneratedQuestions}
          onPlayNow={(diff, qs) => {
            setQuestions(shuffle(qs));
            setPendingCount(qs.length);
            setPendingDiff(diff);
            setScreen("quiz");
          }}
          onBack={() => setScreen("menu")}
        />
      )}

      {screen === "quiz" && questions.length > 0 && (
        <Quiz questions={questions} onFinish={finish} onMenu={() => setScreen("menu")} />
      )}

      {screen === "results" && (
        <Results
          score={finalScore} total={questions.length}
          history={finalHistory}
          onMenu={() => setScreen("menu")}
          onRetry={() => start(pendingCount, pendingDiff)}
        />
      )}
    </div>
  );
}
