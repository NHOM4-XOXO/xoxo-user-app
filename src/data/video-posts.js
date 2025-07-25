export const videoPosts = [
  {
    id: "post-1",
    author: {
      name: "Toàn Euro",
      avatar: "/default-avatar.jpg?height=40&width=40",
      isFollowing: true,
    },
    timestamp: "4 Tháng 6",
    privacy: "public",
    content: "Camera an ninh Giật hết cả mình :))",
    media: [
      {
        type: "video",
        url: "/videos/sample-video.mp4",
        thumbnail: "/example-thumbnail.png?height=400&width=600",
      },
    ],
    likes: 1200,
    commentsCount: 50,
    views: "44K",
    comments: [
      {
        id: "comment-1",
        author: {
          name: "Nguyễn Văn A",
          avatar: "/default-avatar.jpg?height=32&width=32",
        },
        content: "Haha, dễ thương quá!",
        timestamp: "1 giờ trước",
        replies: [
          {
            id: "reply-1-1",
            author: {
              name: "Trần Thị B",
              avatar: "/default-avatar.jpg?height=32&width=32",
            },
            content: "Đúng rồi, nhìn cưng ghê.",
            timestamp: "30 phút trước",
            replies: [],
          },
        ],
      },
      {
        id: "comment-2",
        author: {
          name: "Phạm Thị C",
          avatar: "/default-avatar.jpg?height=32&width=32",
        },
        content: "Nuôi heo kiểu này chắc vui lắm.",
        timestamp: "2 giờ trước",
        replies: [],
      },
    ],
  },
  {
    id: "post-2",
    author: {
      name: "Video Hay Mỗi Ngày",
      avatar: "/default-avatar.jpg?height=40&width=40",
      isFollowing: true,
    },
    timestamp: "1 Ngày trước",
    privacy: "public",
    content: "Khoảnh khắc đáng yêu của động vật hoang dã.",
    media: [
      {
        type: "video",
        url: "/videos/sample-video.mp4",
        thumbnail: "/example-thumbnail.png?height=400&width=600",
      },
    ],
    likes: 850,
    commentsCount: 30,
    views: "25K",
    comments: [
      {
        id: "comment-3",
        author: {
          name: "Lê Văn D",
          avatar: "/default-avatar.jpg?height=32&width=32",
        },
        content: "Thiên nhiên thật tuyệt vời!",
        timestamp: "3 giờ trước",
        replies: [],
      },
    ],
  },
  {
    id: "post-3",
    author: {
      name: "Tin Tức 24h",
      avatar: "/default-avatar.jpg?height=40&width=40",
      isFollowing: false,
    },
    timestamp: "2 Ngày trước",
    privacy: "friends", // This post will be filtered out
    content: "Một ngày làm việc của nông dân.",
    media: [
      {
        type: "video",
        url: "/videos/sample-video.mp4",
        thumbnail: "/example-thumbnail.png?height=400&width=600",
      },
    ],
    likes: 300,
    commentsCount: 10,
    views: "5K",
    comments: [],
  },
  {
    id: "post-4",
    author: {
      name: "Chỉ Mình Tôi",
      avatar: "/default-avatar.jpg?height=40&width=40",
      isFollowing: false,
    },
    timestamp: "3 Ngày trước",
    privacy: "onlyMe", // This post will be filtered out
    content: "Video kỷ niệm cá nhân.",
    media: [
      {
        type: "video",
        url: "/videos/sample-video.mp4",
        thumbnail: "/example-thumbnail.png?height=400&width=600",
      },
    ],
    likes: 5,
    commentsCount: 0,
    views: "10",
    comments: [],
  },
  {
    id: "post-5",
    author: {
      name: "Du Lịch Khắp Nơi",
      avatar: "/default-avatar.jpg?height=40&width=40",
      isFollowing: true,
    },
    timestamp: "5 Ngày trước",
    privacy: "public",
    content: "Khám phá vẻ đẹp của Vịnh Hạ Long qua flycam.",
    media: [
      {
        type: "video",
        url: "/videos/sample-video.mp4",
        thumbnail: "/example-thumbnail.png?height=400&width=600",
      },
    ],
    likes: 5000,
    commentsCount: 150,
    views: "100K",
    comments: [
      {
        id: "comment-4",
        author: {
          name: "Nguyễn Thị E",
          avatar: "/default-avatar.jpg?height=32&width=32",
        },
        content: "Đẹp quá đi mất!",
        timestamp: "1 ngày trước",
        replies: [],
      },
    ],
  },
  {
    id: "post-6",
    author: {
      name: "Ảnh Đẹp",
      avatar: "/default-avatar.jpg?height=40&width=40",
      isFollowing: false,
    },
    timestamp: "1 Tuần trước",
    privacy: "public",
    content: "Những bức ảnh tuyệt đẹp từ chuyến đi Đà Lạt.",
    media: [
      {
        type: "image",
        url: "/default-avatar.jpg?height=400&width=600",
      },
      {
        type: "image",
        url: "/default-avatar.jpg?height=400&width=600",
      },
    ],
    likes: 200,
    commentsCount: 5,
    views: "2K",
    comments: [],
  },
];
