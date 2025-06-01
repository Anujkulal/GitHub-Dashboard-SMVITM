import axios from "axios";

const githubToken = import.meta.env.VITE_GITHUB_TOKEN

const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Accept': 'application/vnd.github+json',
    'Authorization': `Bearer ${githubToken}`,
  },
});

export default githubApi;