# 🧠 AI-Powered Dialogue Generator (Language Learning App)

This project is a modern SaaS web application that helps users improve their communication skills in foreign languages. It allows users to generate contextual dialogues based on selected topics, tone, language, and proficiency level, using AI models (Google's PaLM/Gemini). It also supports instant translation to enhance learning outcomes.

---

## ✨ Features

- ✅ Dynamic dialogue generation based on selected topic, tone, and difficulty
- 🌍 Multilingual translation support
- 👤 Subscription control (free vs. paid users)
- 💅 Clean UI built with Tailwind CSS
- 🔐 Authentication with Supabase
- 📄 Form validation using Zod + React Hook Form
- ⚡ Responsive design with serverless architecture

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Next.js, TypeScript |
| Styling | Tailwind CSS |
| Backend | Supabase (Auth + DB), Server Actions |
| AI Services | Google Genini API |
| Forms | React Hook Form + Zod |
| Deployment | Vercel |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/dialogue-app.git
cd dialogue-app
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file and add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
GOOGLE_API_KEY=your_ai_key
```

### 4. Run the app locally

```bash
pnpm dev
```

---

## 📁 Project Structure

```
/public
/src
  /app
    /dialogue
        - dialogue.tsx            # UI layout and logic for dialogue generation
        - dialogue-form.tsx       # Form with dynamic field logic
  /components
    - dialog-card.tsx             # Output card for displaying results
    - tones/, topics/, levels/    # Selectable dropdowns
  /context
    - user.tsx                    # Authentication context
  /lib
    - utils.ts                    # Helper functions (e.g. language formatting)
```

---

## 🧪 Example
https://content-edit.vercel.app/

Generate a friendly Spanish dialogue about "Ordering Coffee" for an intermediate learner:

1. Choose the topic: `Food and Drink – Ordering Coffee`
2. Set tone: `Friendly and Approachable`
3. Level: `Intermediate`
4. Language: `es-ES`

The app will generate the dialogue and offer a translation in your preferred language.

---

## 🧱 Sustainable Coding Practices

- Modular component-based architecture
- Schema-based form validation
- Context API for auth and global state
- DRY principles and reusable logic
- Clean separation of concerns between layout, data, and actions

---

## 📌 Contributions

While this project is not open source at the moment, I’ve built it with scalability in mind. It can easily integrate with CMS platforms like Drupal or WordPress by replacing the AI dialogue generator with real content endpoints.

---

## 🙋‍♂️ Author

**Piotr**  
Front-End Developer  
