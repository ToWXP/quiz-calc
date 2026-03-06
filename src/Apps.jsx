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
function Menu({ allQ, onStart }) {
  const [count, setCount] = useState("20");
  const [difficulty, setDifficulty] = useState("easy");

  const activeQ = allQ[difficulty] || [];
  const types = activeQ.reduce((a,q)=>{a[q.type]=(a[q.type]||0)+1;return a},{});
  const total = activeQ.length;

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
        {total} întrebări — {difficulty === "easy" ? "nivel normal (clasa 11-12)" : difficulty === "medium" ? "nivel mediu (intermediar)" : "nivel județean (dificil)"}
      </p>

      {/* Difficulty selector */}
      <div style={{ display:"flex", gap:8, marginBottom:24, width:"100%" }}>
        {[
          {v:"easy", label:"📗 Normal", col:T.green},
          {v:"medium", label:"📘 Mediu", col:T.yellow},
          {v:"hard", label:"🏆 Județean", col:T.red},
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
    </div>
  );
}

/* ─── APP ─────────────────────────────────────────────────── */
export default function App() {
  const [screen, setScreen] = useState("loading");
  const [allQ, setAllQ] = useState({easy:[], hard:[]});
  const [questions, setQuestions] = useState([]);
  const [finalScore, setFinalScore] = useState(0);
  const [finalHistory, setFinalHistory] = useState([]);
  const [pendingCount, setPendingCount] = useState(20);
  const [pendingDiff, setPendingDiff] = useState("easy");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("./questions.json")
      .then(r => {
        if (!r.ok) throw new Error("Nu s-a putut încărca questions.json");
        return r.json();
      })
      .then(data => {
        setAllQ(data);
        setScreen("menu");
      })
      .catch(e => {
        setError(e.message);
        setScreen("error");
      });
  }, []);

  function start(count, diff) {
    const pool = allQ[diff] || [];
    const picked = shuffle(pool).slice(0, Math.min(count, pool.length));
    setQuestions(picked);
    setPendingCount(count);
    setPendingDiff(diff);
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

      {screen === "loading" && (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:20, marginTop:80 }}>
          <div style={{
            width:48, height:48, borderRadius:"50%",
            border:`3px solid ${T.border}`, borderTop:`3px solid ${T.accent}`,
            animation:"spin 0.9s linear infinite",
          }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
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

      {screen === "menu" && <Menu allQ={allQ} onStart={start} />}

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
