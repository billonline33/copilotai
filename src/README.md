# To-Do List App with Math Practice Feature

This is a Next.js application that combines a to-do list with an educational math practice feature designed specifically for 7-year-old Bianca. The app helps children learn counting patterns through interactive exercises.

## Features

### 📝 To-Do List

- Add, edit, and delete tasks
- Mark tasks as complete
- Persistent storage

### 🧮 Math Practice (New!)

- **Counting Patterns**: Practice counting by 2s, 3s, 5s, and 10s
- **Directional Counting**: Forward and backward counting
- **Interactive Questions**: Fill-in-the-blank, sequence completion, and next/previous number
- **Reward System**: Points, achievements, and celebration animations
- **Progress Tracking**: Session and historical progress with localStorage
- **Mobile Optimized**: Touch-friendly interface for tablets and phones
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── components/         # Reusable React components
│   │   ├── Navigation.tsx  # App navigation
│   │   ├── MathQuestion.tsx # Math question display
│   │   ├── RewardSystem.tsx # Points and achievements
│   │   ├── ProgressTracker.tsx # Progress tracking
│   │   └── Badge.tsx       # Achievement badges
│   ├── math-practice/      # Math practice page
│   ├── types/             # TypeScript interfaces
│   ├── utils/             # Utility functions
│   └── api/               # API routes
doc/
└── phase2/                # Documentation
    ├── 01_ProjectBrief.md
    ├── 02_ProjectRequirementsDocument.md
    ├── 03_TechnicalChecklist.md
    ├── UserGuide.md
    ├── ParentTeacherGuide.md
    └── DeploymentChecklist.md
```

## Educational Goals

The Math Practice feature is designed to help children:

- Develop number sense and pattern recognition
- Master skip counting (essential for multiplication)
- Build confidence with positive reinforcement
- Practice problem-solving skills
- Enjoy learning through gamification

## Technical Highlights

- **TypeScript**: Full type safety
- **CSS Modules**: Scoped styling with SCSS
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 compliant
- **Progressive Enhancement**: Works without JavaScript
- **Local Storage**: Progress persistence
- **Performance Optimized**: <3s load times

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run Cypress tests

## Testing

End-to-end tests are available using Cypress:

```bash
npx cypress run --spec "cypress/e2e/math-practice.cy.js"
```

## Browser Support

- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

Please refer to the technical checklist in `/doc/phase2/03_TechnicalChecklist.md` for development guidelines and implementation progress.

## Documentation

- **User Guide**: `/doc/phase2/UserGuide.md` - For children and families
- **Parent/Teacher Guide**: `/doc/phase2/ParentTeacherGuide.md` - Educational context
- **Technical Checklist**: `/doc/phase2/03_TechnicalChecklist.md` - Development progress
- **Deployment Guide**: `/doc/phase2/DeploymentChecklist.md` - Production deployment

## License

This project is created for educational purposes.

- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
