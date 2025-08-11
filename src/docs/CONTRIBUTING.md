# 🤝 How to Help

Thank you for wanting to help make the XOXO app better! This guide shows you how to help.

## 📋 What's Here

- [Rules](#rules)
- [Getting Started](#getting-started)
- [How to Work](#how-to-work)
- [Code Rules](#code-rules)
- [How to Send Changes](#how-to-send-changes)
- [How to Report Problems](#how-to-report-problems)
- [Community](#community)

## 📜 Rules

### Our Promise
We want everyone to feel welcome when helping with this project. We don't care about your age, size, disability, race, gender, experience level, nationality, looks, religion, or sexual identity.

### Our Rules
- Use nice and welcoming words
- Be respectful of different opinions
- Accept helpful criticism nicely
- Focus on what's best for everyone
- Be kind to other people

## 🚀 Getting Started

### What You Need to Know
- Node.js 18.0 or newer
- Git
- Code editor (VS Code is good)
- Basic knowledge of React, Next.js, and JavaScript

### Setup Your Computer
1. **Make your own copy**
   ```bash
   # Make a copy on GitHub, then download your copy
   git clone https://github.com/NHOM4-XOXO/xoxo-user-app.git
   cd xoxo-app
   ```

2. **Connect to original**
   ```bash
   git remote add upstream https://github.com/NHOM4-XOXO/xoxo-user-app.git
   ```

3. **Install parts**
   ```bash
   npm install
   ```

4. **Set up settings**
   ```bash
   cp .env.example .env.local
   # Change .env.local with your info
   ```

5. **Start the app**
   ```bash
   npm run dev
   ```

## 🔄 How to Work

### Branch Strategy
We use different branches for different work:

```
main (live website)
├── dev (developing)
    ├── feature/user-login
    ├── feature/video-upload
    ├── bugfix/chat-scroll-problem
    └── hotfix/security-fix
```

### Making a New Feature Branch
```bash
# Update your main branch
git checkout main
git pull upstream main

# Make and switch to new branch
git checkout -b feature/your-new-thing

# Make your changes and save
git add .
git commit -m "feat: add user login system"

# Send to your copy
git push origin feature/your-new-thing
```

### How to Write Commit Messages
We use a special way to write commit messages:

```
<type>[optional part]: <what you did>

[optional longer explanation]

[optional footer]
```

#### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (making it look nice)
- `refactor`: Code cleanup
- `test`: Adding or updating tests
- `chore`: Maintenance work

#### Examples
```bash
feat(auth): add Google login
fix(chat): fix scroll problem in messages
docs(readme): update install instructions
style(components): make code look nice with prettier
refactor(api): clean up user endpoints
test(utils): add tests for helper functions
chore(deps): update to newer versions
```

## 📝 Code Rules

### JavaScript/React Rules

#### 1. **How to Write Components**
```javascript
// Use function components with hooks
import { useState, useEffect } from 'react'

export default function ComponentName({ prop1, prop2 }) {
  // Hooks at the top
  const [state, setState] = useState(startValue)
  
  // Effects
  useEffect(() => {
    // Effect code
  }, [dependencies])
  
  // Event handlers
  const handleClick = () => {
    // Handler code
  }
  
  // What to show
  return (
    <div className="component-container">
      {/* Your HTML here */}
    </div>
  )
}
```

#### 2. **How to Name Files**
- Components: `PascalCase.jsx` (like `UserProfile.jsx`)
- Utilities: `camelCase.js` (like `formatDate.js`)
- Constants: `UPPER_SNAKE_CASE.js` (like `API_ENDPOINTS.js`)
- Hooks: `use + PascalCase.js` (like `useWindowWidth.js`)

#### 3. **How to Order Imports**
```javascript
// 1. React and Next.js imports
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// 2. Other libraries
import axios from 'axios'
import { format } from 'date-fns'

// 3. Our components
import Button from '@/components/ui/Button'
import Modal from '@/components/common/Modal'

// 4. Utilities and constants
import { formatDate } from '@/utils/dateUtils'
import { API_ENDPOINTS } from '@/constants/api'

// 5. Types (if using TypeScript)
import type { User } from '@/types/user'
```

### CSS/Styling Rules

#### 1. **How to Use Tailwind CSS**
```javascript
// Use Tailwind classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-gray-800">Title</h2>
  <button className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
    Action
  </button>
</div>

// For complex styles, use CSS modules
import styles from './Component.module.css'

<div className={styles.complexComponent}>
  {/* Content */}
</div>
```

#### 2. **Responsive Design**
```javascript
// Mobile-first approach
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Content that changes size */}
</div>

// Screen sizes we use
// sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px
```

### Code Quality Tools

#### 1. **ESLint Setup**
```json
{
  "extends": [
    "next/core-web-vitals",
    "eslint:recommended"
  ],
  "rules": {
    "no-unused-vars": "error",
    "no-console": "warn",
    "prefer-const": "error"
  }
}
```

#### 2. **Prettier Setup**
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
```

## 🔍 How to Send Changes

### Before You Send
1. **Test your changes**
   ```bash
   npm run dev    # Test while developing
   npm run build  # Test production build
   npm run lint   # Check for code problems
   ```

2. **Update documentation**
   - Update README if needed
   - Add/update component docs
   - Update API docs if needed

3. **Write tests** (if needed)
   ```bash
   npm run test
   ```

### Pull Request Template
```markdown
## What I Changed
Brief description of what you changed.

## Type of Change
- [ ] Bug fix (fixes a problem)
- [ ] New feature (adds something new)
- [ ] Breaking change (changes how existing things work)
- [ ] Documentation update

## Testing
- [ ] I tested these changes on my computer
- [ ] I added tests that prove my fix works or my feature works
- [ ] All tests pass with my changes

## Screenshots (if needed)
Add pictures to help explain your changes.

## Checklist
- [ ] My code follows the style rules of this project
- [ ] I checked my own code
- [ ] I added comments to help others understand hard parts
- [ ] I updated the documentation
- [ ] My changes don't create new warnings
```

### Review Process
1. **Automatic Checks**: All changes must pass automatic checks
2. **Code Review**: At least one maintainer must review
3. **Testing**: Changes must be tested
4. **Documentation**: Docs must be updated if needed

## 🐛 How to Report Problems

### Bug Reports
Use this template:

```markdown
**What's the problem?**
Clear description of what's wrong.

**How to make it happen again**
Steps to see the problem:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**What should happen instead**
Clear description of what you expected.

**Screenshots**
If helpful, add pictures of the problem.

**Your setup:**
- Operating System: [like Windows, Mac, Linux]
- Browser [like Chrome, Safari]
- Version [like 22]

**Other info**
Any other details about the problem.
```

### Feature Requests
Use this template:

```markdown
**Is this about a problem?**
Clear description of what problem this would solve.

**What solution do you want?**
Clear description of what you want to happen.

**What other solutions did you think of?**
Other ways you thought about solving this.

**Other info**
Any other details or pictures about the idea.
```

## 🏷️ Labels

We use these labels to organize issues and changes:

### Type Labels
- `bug`: Something doesn't work
- `enhancement`: New feature idea
- `documentation`: Improve or add docs
- `question`: Need more info

### Priority Labels
- `priority: high`: Very important
- `priority: medium`: Somewhat important
- `priority: low`: Not urgent

### Status Labels
- `status: needs review`: Needs someone to look at code
- `status: needs testing`: Needs testing
- `status: blocked`: Can't work on this yet
- `status: ready`: Ready to add to main code

### Area Labels
- `area: frontend`: About what users see
- `area: backend`: About server stuff
- `area: ui/ux`: About design and user experience
- `area: performance`: About making things faster

## 🎯 Good Ways to Do Things

### Performance
- Make images and videos smaller
- Load things only when needed
- Use caching to make things faster
- Watch file sizes

### Accessibility
- Use proper HTML elements
- Add alt text to images
- Make sure keyboard navigation works
- Test with screen readers

### Security
- Check all user inputs
- Use HTTPS for live websites
- Use proper login systems
- Follow security best practices

### Testing
- Write tests for utility functions
- Test components with React Testing Library
- Test important user flows
- Test on different devices

## 🌟 Recognition

People who help will be mentioned in:
- README.md contributors section
- Release notes for big contributions
- Special mentions in project updates

## 📞 Getting Help

### Ways to Talk
- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general talk
- **Discord**: Real-time chat (link in README)
- **Email**: nhom4@xoxo-app.com

### Resources
- [Project Documentation](../../README.md)

---

Thank you for helping make XOXO better! 🎉

*For more help, see the [main README](../../README.md) or other help files.*
