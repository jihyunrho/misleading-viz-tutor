function getGitHubImageUrl(imageFilename: string) {
  const encodedFilename = encodeURIComponent(imageFilename);
  return `https://github.com/jihyunrho/misleading-viz-tutor/blob/main/public/images/visualizations/${encodedFilename}?raw=true`;
}

export default getGitHubImageUrl;
