# 🏠 Home Page Help

The Home Page is the main page you see when you open the XOXO app. Here you can see posts from friends and go to other parts of the app.

## 📋 What's Here

- [What is This](#what-is-this)
- [Parts of the Page](#parts-of-the-page)
- [What You Can Do](#what-you-can-do)
- [How It Looks](#how-it-looks)

## 🎯 What is This

The Home Page is where you can:
- See posts from your friends
- Write new posts
- Like and comment on posts
- Go to other pages like Messages or Videos

## 🧩 Parts of the Page

### Main Parts

#### 1. **Home Page Container**
This holds everything together and makes it look good on phones and computers.

#### 2. **Left Side Menu**
- **Header**: Logo and search box
- **Menu**: Links to Videos, Groups, Friends
- **Mobile Menu**: Special menu for phones

#### 3. **Middle Area**
- **Write Posts**: Where you write new posts
- **News Feed**: See posts from friends

#### 4. **Right Side**
- **Friends List**: See who is online
- **Settings**: Change your settings

## ✨ What You Can Do

### 📝 Write Posts
- Write text posts
- Add photos and videos
- Choose who can see your post (everyone, friends only, just you)
- Add emojis

### 📰 See Posts
- Scroll down to see more posts
- Like posts by clicking the heart
- Write comments
- Share posts with friends
- See photos and videos in full size

### 🎨 How It Looks
- **Works on All Devices**: Looks good on phones, tablets, computers
- **Dark/Light Colors**: Change between dark and light colors
- **Smooth Scrolling**: Easy to scroll up and down
- **Loading**: Shows when things are loading

## 🏗 How the Page is Set Up

```
Home Page
├── Top (Logo, Search, Alerts)
├── Main Area
│   ├── Left Menu
│   │   ├── Navigation Links
│   │   ├── Quick Links
│   │   └── Phone Menu
│   ├── Middle
│   │   ├── Write New Post
│   │   └── Friends' Posts
│   └── Right Side
│       ├── Online Friends
│       ├── Click on any friend to open mini chat
│       └── Settings
└── Chat Box (floating)
```

### Different Screen Sizes

```css
/* Phone: small screens */
- One column
- Menus can hide
- Bottom menu

/* Tablet: medium screens */
- Two columns
- Smaller menus

/* Computer: big screens */
- Three columns
- Full menus
```

## 🔄 How Data Moves

### Writing Posts
```
You Write -> Check if OK -> Save -> Show to Friends
```

### Seeing Posts
```
Page Loads -> Get Posts -> Show Posts -> Load More When You Scroll
```

### Live Updates
```
New Post -> Tell Everyone -> Update Feed -> Show Alert
```

## 🔧 Connecting to Server

### Make New Post
```javascript
// Send new post to server
POST /api/posts
{
  content: "What you wrote",
  media: [photos or videos],
  privacy: "who can see it",
  location: "where you are"
}
```

### Get Posts
```javascript
// Get posts from server
GET /api/feed?page=1&limit=10
Response: {
  posts: [list of posts],
  hasMore: true or false,
  nextPage: next page number
}
```

## 🎯 Good Ways to Do Things

### Make It Fast
- Don't load everything at once
- Load images when needed
- Make search wait a bit before searching
- Remember things so you don't ask server again

### Make It Easy to Use
- Label things clearly
- Make it work with keyboard
- Work with screen readers
- Make text big enough to read

### Help Search Engines
- Good titles for shared posts
- Special tags for social media
- Organized data

## 🐛 Fix Problems

### Common Problems

1. **Posts don't load**
   - Check internet connection
   - Make sure you're logged in
   - Try refreshing the page

2. **Photos don't show**
   - Check if photo file is too big
   - Make sure photo link works
   - Check browser settings

3. **Page looks wrong on phone**
   - Check CSS code
   - Test on different phones
   - Make sure Tailwind CSS works

## 📱 Phone Things to Remember

- Make buttons big enough to touch
- Let people swipe to move around
- Make photos load fast
- Use less data when possible
- Work when internet is slow

---

*Last updated: March 8, 2025*
*For more help, see the [main README](../../README.md) or other help files.*
