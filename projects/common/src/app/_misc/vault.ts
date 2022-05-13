export const genderOptions = [
  { label: 'Male', value: 1 },
  { label: 'Female', value: 2 },
  { label: 'Other', value: 0 },
];

// https://stackoverflow.com/questions/6903823/regex-for-youtube-id/6904504
export const youtube_regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi;

export const ratingOptions = Array(5).fill(0).map((k, i) => i + 1);

export const COMMON_TEXT_FORM_LIMIT = 250;

export const COMMON_CURRENT_DATE = new Date();