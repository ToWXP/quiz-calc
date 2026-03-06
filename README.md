# 🖥️ USO Quiz — Utilizarea Sistemelor de Operare

> Quiz interactiv pentru pregătirea examenului de **Utilizarea Sistemelor de Operare**, clasa 11-12.  
> Disponibil live la: **[ToWXP.github.io/quiz-calc](https://ToWXP.github.io/quiz-calc)**

---

## ✨ Funcționalități

- **300 de întrebări** organizate pe două niveluri de dificultate
- **3 tipuri de întrebări** — single choice, multi choice, și ordonare drag & drop
- **Feedback instant** după fiecare răspuns cu explicația soluției corecte
- **Statistici pe capitole** la finalul fiecărei sesiuni
- **Întrebări amestecate aleatoriu** la fiecare sesiune nouă
- **Responsive** — funcționează pe telefon și desktop
- **Fără internet necesar** după încărcare

---

## 📚 Niveluri de dificultate

| Nivel | Întrebări | Descriere |
|-------|-----------|-----------|
| 📗 **Normal** | 100 | Comenzi de bază Linux, permisiuni, bash scripting, rețea, Arduino |
| 🏆 **Județean** | 200 | Nivel examen județean — QEMU, Docker, LVM, scripting avansat, securitate |

---

## 🗂️ Teme acoperite

`Comenzi Linux` `Permisiuni & utilizatori` `Bash scripting` `Procese & semnale`
`Rețea & protocoale` `SSH & securitate` `Virtualizare & Docker` `QEMU & KVM`
`Sistemul de fișiere` `Compilare & linking` `Boot & systemd` `Arduino & IoT`
`Cron & automatizare` `Stocare & LVM` `Cloud (IaaS/PaaS/SaaS)` `Compresie & arhivare`

---

## 🚀 Rulare locală

```bash
# Clonează repo-ul
git clone https://github.com/ToWXP/quiz-calc.git
cd quiz-calc

# Instalează dependențele
npm install

# Pornește serverul de dezvoltare
npm run dev
```

Deschide [http://localhost:5173](http://localhost:5173) în browser.

---

## 📁 Structura proiectului

```
quiz-calc/
├── public/
│   └── questions.json      # Toate întrebările (easy + hard)
├── src/
│   └── App.jsx             # Componenta principală React
├── index.css               # Stiluri globale
└── vite.config.js          # Configurație Vite
```

---

## 🛠️ Tehnologii folosite

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- CSS-in-JS (stiluri inline)
- GitHub Pages pentru hosting

---

## 📦 Deploy

```bash
# Build + deploy pe GitHub Pages
npm run build && npm run deploy
```

---

## 📝 Adăugare întrebări noi

Deschide `public/questions.json` și adaugă întrebări în formatul:

```json
{
  "id": 600,
  "topic": "Numele capitolului",
  "type": "single",
  "question": "Textul întrebării?",
  "options": ["Varianta A", "Varianta B", "Varianta C", "Varianta D"],
  "answers": [0]
}
```

**Tipuri disponibile:**
- `"single"` — o singură variantă corectă, `answers: [index]`
- `"multi"` — mai multe variante corecte, `answers: [0, 2]`
- `"order"` — ordonare, `answers: [2, 0, 1]` (ordinea corectă a indexurilor)

---

*Creat pentru pregătirea examenului USO — clasa 11-12* 🎓
