
const getRandomDuration = () => {
  return Math.floor(Math.random() * (15 * 60 - 30 + 1)) + 30;
};

const getRandomViews = () => {
  return Math.floor(Math.random() * 10000000) + 1000;
};

const getRandomDate = () => {
  const now = new Date();
  const pastDate = new Date(now);

  pastDate.setDate(now.getDate() - Math.floor(Math.random() * 365));

  return pastDate.toTimeString();
};

const items = Array.from({ length: 100 }, (_, i) => {
  const durationSeconds = getRandomDuration();
  const viewCount = getRandomViews();
  const createdDate = getRandomDate();

  return {
    id: (i + 1).toString(),
    title: getRandomTitle(),
    description: getRandomDescription(),
    videoURL: getRandomVideoURL(i),
    thumbnailURL: `${BASE_THUMBNAIL_URL}${i + 1}`,
    creator: getRandomUser(i + 1),
    likes: getRandomLikes(),
    duration: durationSeconds,
    views: viewCount,
    createdAt: createdDate,
  };
});