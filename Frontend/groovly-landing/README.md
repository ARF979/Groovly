# Groovly Landing Page

Experience a high-energy landing page for Groovly, the collaborative music app built for parties, trips, and every shared playlist moment.

## 🚀 Quickstart

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to explore the page.

## 🧱 Tech Stack
- Next.js (App Router, TypeScript)
- Tailwind CSS
- Framer Motion
- clsx utility helper

## 📁 Project Structure
```
groovly-landing/
├─ app/
│  ├─ layout.tsx
│  └─ page.tsx
├─ public/
│  └─ assets/
├─ src/
│  └─ components/
│     ├─ AlternatingRow.tsx
│     ├─ CD.tsx
│     └─ HeroDynamicText.tsx
├─ styles/
│  └─ globals.css
├─ tailwind.config.js
├─ tsconfig.json
└─ README.md
```

## 📸 Assets
Drop four artwork images inside `public/assets` named `cd1.jpg`, `cd2.jpg`, `cd3.jpg`, and `cd4.jpg`. These power the drawer animation cards.

## ♿ Accessibility
- Keyboard focus triggers hover interactions.
- Prefers-reduced-motion is respected for core animations.
- Smooth scrolling and high-contrast text.

## ✅ Acceptance Checklist
- [ ] Add CD artwork images under `public/assets`.
- [ ] `npm run dev` starts the Next.js dev server.
- [ ] Hover and focus interactions feel smooth.
- [ ] Responsive layout verified across breakpoints.
