# XOXO Social Media App

<div align="center">
  <h1>🌟 XOXO - Connect with Friends 🌟</h1>
  <p>A simple social media app made with Next.js</p>
  
  ![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)
  ![React](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
  ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript)
</div>

## 📋 What's Inside

- [About This App](#about-this-app)
- [What You Can Do](#what-you-can-do)
- [How to Start](#how-to-start)
- [App Structure](#app-structure)
- [Help Files](#help-files)
- [How to Help](#how-to-help)

## 🎯 About This App

XOXO is a social media app where people can talk to friends, share photos and videos, and join groups. It works on phones, tablets, and computers.

### Why This App is Good

- 🚀 **Fast**: Made with new web tools
- 📱 **Works Everywhere**: Good on all devices
- 🎨 **Looks Nice**: Clean and easy to use
- ⚡ **Quick**: Loads fast
- 🔒 **Safe**: Keeps your info private

## ✨ What You Can Do

### 🏠 Main Things
- **News Feed**: See posts from friends
- **Chat**: Send messages to friends
- **Videos**: Watch and share videos
- **Groups**: Join groups you like
- **Shop**: Buy and sell things
- **Music**: Share music you like

### 👤 Your Account
- **Profile**: Make your own page
- **Friends**: Add friends and talk to them
- **Privacy**: Choose who sees your posts
- **Alerts**: Get told when something happens

### 🎨 How It Looks
- **Dark/Light**: Change colors
- **Mobile Ready**: Works on phones
- **Easy Scroll**: Smooth scrolling
- **Emojis**: Use fun emojis
- **Photo View**: See big photos

## 🛠 What We Used to Make This

### Front End (What You See)
- **Next.js 15**: Main framework
- **React 19**: For making pages
- **Tailwind CSS**: For making it look good
- **Lucide React**: For icons

### Back End (Behind the Scenes)
- **Login System**: Custom way to log in
- **Email**: EmailJS for sending emails
- **Files**: Cloudinary for storing photos and videos

## 🚀 How to Start

### What You Need First

- Node.js 18.0 or newer
- npm or yarn
- A web browser

### Steps to Install

1. **Get the code**
   ```bash
   git clone https://github.com/NHOM4-XOXO/xoxo-user-app.git
   cd xoxo-app
   ```

2. **Install parts**
   ```bash
   npm install
   ```

3. **Set up settings**
   ```bash
   cp .env.example .env.local
   ```
   
   Add these settings:
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   EMAILJS_SERVICE_ID=your_service_id
   EMAILJS_TEMPLATE_ID=your_template_id
   EMAILJS_PUBLIC_KEY=your_public_key
   ```

4. **Start the app**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Go to [http://localhost:3000](http://localhost:3000)

### Make It Ready for Everyone

```bash
npm run build
npm start
```

## 📁 App Structure

```
src/
├── app/                  # All pages
│   ├── friends/           # Friends page
│   ├── groups/            # Groups page
│   ├── marketplace/       # Marketplace page
│   ├── messages/          # Chat page
│   ├── musics/            # Musics page
│   ├── profile/           # Your profile
│   └── videos/            # Videos page
├── components/            # Parts we use again
│   ├── common/           # Parts used everywhere
│   └── main/             # Main app parts
├── data/                 # Sample data
├── hooks/                # Custom hooks
└── utils/                # Helper tools
```

## 📚 Help Files

Learn more about each part:

- [🏠 **Home Page**](./src/docs/HOME.md) - Main page and menu
- [💬 **Messages**](./src/docs/MESSAGES.md) - How to chat
- [🎥 **Videos**](./src/docs/VIDEOS.md) - How to share videos
- [👥 **Groups**](./src/docs/GROUPS.md) - How groups work
- [👤 **Profile**](./src/docs/PROFILE.md) - Your account page
- [🛒 **Shop**](./src/docs/MARKETPLACE.md) - Buy and sell things
- [🎵 **Music**](./src/docs/MUSIC.md) - Share music
- [🔐 **Login**](./src/docs/AUTH.md) - How to log in

## 🤝 How to Help

We want your help! See our [Help Guide](./src/docs/CONTRIBUTING.md) for details.

### How to Add New Things

1. Make a copy of the project
2. Make a new branch (`git checkout -b new-thing`)
3. Make your changes (`git commit -m 'Add new thing'`)
4. Send your changes (`git push origin new-thing`)
5. Ask us to add it

## 📄 Rules

This project uses the MIT License - see the [LICENSE](LICENSE) file.

## 🙏 Thank You

- Next.js team for the great tools
- Tailwind CSS for easy styling
- Lucide for nice icons
- Everyone who helps make this better

---

<div align="center">
  <p>Made with ❤️ by the XOXO Team</p>
  <p>
    <a href="#top">Go to Top ⬆️</a>
  </p>
</div>
