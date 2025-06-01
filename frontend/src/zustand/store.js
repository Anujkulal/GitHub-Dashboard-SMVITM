import { create } from "zustand";
import githubApi from "@/services/githubApi.js";
import axios from "axios";

const base_backend_url = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const useStore = create((set, get) => ({
  showPopup: false,
  showSignin: false,
  showProfile: false,
  loading: false,
  error: null,
  users: [],
  notFound: false,
  isLoggedIn: false,

  setShowPopup: (value) => set({ showPopup: value }),
  setShowSignin: (value) => set({ showSignin: value }),
  setShowProfile: (value) => set({ showProfile: value }),
  setLoading: (value) => set({ loading: value }),

  searchGitHubUsers: async (query) => {
    if (!query || query.trim() === "") {
      set({ error: "Please enter a search query.", loading: false });
      // console.log("Please enter a search query");

      return;
    }
    set({ loading: true, error: null });

    try {
      const searchResponse = await githubApi.get("/search/users", {
        params: {
          q: query,
          per_page: 15,
        },
      });
      
      if(searchResponse.data.items.length === 0) {
        set({ notFound: true, loading: false });
      }

      const fetchAllRepos = async (username) => {
        let page = 1;
        let allRepos = [];
        while (true) {
          const response = await githubApi.get(`/users/${username}/repos`, {
            params: { sort: "updated", per_page: 100, page },
          });
          allRepos = allRepos.concat(response.data);
          if (response.data.length < 100) {
            break; // No more repos to fetch
          }
          page++;
        }
        return allRepos;
      };

      const usersList = searchResponse.data.items.map(async (user) => {
        // console.log("user::: ", user);

        const [userResponse, reposResponse] = await Promise.all([
          githubApi.get(`/users/${user.login}`),
          githubApi.get(`/users/${user.login}/repos`, {
            params: { sort: "updated", per_page: 100 },
          }),
        ]);

        const profile = userResponse.data;
        // const repos = reposResponse.data;
        const repos = await fetchAllRepos(user.login);
        // console.log("profile:::", profile);
        // console.log("repos:::", repos);
        const repoScore = Math.min(profile.public_repos / 30, 1) * 25; // Max 25 points
        const followerScore = Math.min(profile.followers / 50, 1) * 15; // Max 15 points

        // Repo quality metrics
        let commitScore = 0;
        let updatedScore = 0;
        let stargazerScore = 0;

        if (repos.length > 0) {
          const now = new Date();
          const recentUpdates = repos.filter((repo) => {
            const updatedAt = new Date(repo.updated_at);
            // console.log("getMonth:::", now.getMonth());
            // console.log("updatedAt.getMonth:::", updatedAt.getMonth());

            const monthsAgo =
              (now.getFullYear() - updatedAt.getFullYear()) * 12 +
              (now.getMonth() - updatedAt.getMonth());
            return monthsAgo <= 1; // Updated in the last month
          }).length;

          updatedScore = (recentUpdates / repos.length) * 20; // Max 20 points

          let activitySum = 0;
          repos.forEach((repo) => {
            const createdDate = new Date(repo.created_at);
            const updatedDate = new Date(repo.updated_at);
            const daysDiff =
              (updatedDate - createdDate) / (1000 * 60 * 60 * 24);

            if (daysDiff > 0 && repo.updated_at !== repo.created_at) {
              activitySum += Math.min(daysDiff / 30, 10); // Cap at 10 months of activity
            }
          });

          commitScore = Math.round(Math.min(activitySum / 30, 1) * 20);
        }

        const activityPercent = Math.round(
          repoScore + followerScore + updatedScore + commitScore
        );

        return {
          ...profile,
          repos,
          totalRepos: repos.length,
          totalCommits: commitScore,
          activityPercent,
        };
      });
      //   console.log("searchResponse::: ", searchResponse)

      const enhancedUsers = await Promise.all(usersList);
      console.log("enhancedUsers::: ", enhancedUsers);
      set({ users: enhancedUsers, loading: false });
    } catch (error) {
      console.error("GitHub API Error:", error);
      set({
        error:
          error.response?.data?.message ||
          "Failed to fetch GitHub data. Please try again later.",
        loading: false,
      });
    }
  },

  calculateActivityScore: (totalCommits, totalRepos) => {
    if (!totalRepos || totalRepos === 0) return 0;
    const maxCommits = totalRepos * 100; // You can adjust this threshold
    const percent = Math.min(
      Math.round((totalCommits / maxCommits) * 100),
      100
    );
    return percent;
  },

  checkAuth: () => {
    const token = localStorage.getItem("token");
    // console.log("token::: ", token);
    set({ isLoggedIn: !!token });
  },

  signinUser: async (email, password) => {
    axios.defaults.withCredentials = true;

    set({loading: true, error: null});
    try{
      const response = await axios.post(`${base_backend_url}/api/users/admin/login`, {
        email,
        password
      }, {withCredentials: true});
      if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
      set({loading: false, showSignin: false, isLoggedIn: true, error: null});
      return response.data;
    }
    catch(error){
      // console.error("Signin error: ", error.response?.data?.message);
      set({loading: false, error: error.response?.data?.message || "Signin failed. Please try again."});
      throw error;
    }
  },
  logoutUser: async () => {
    set({loading: true, error: null});
    try{
      const response = await axios.post(`${base_backend_url}/api/users/logout`, {}, {withCredentials: true});
      localStorage.removeItem("token");
      set({loading: false, isLoggedIn: false, error: null});
      return response.data;
    }
    catch(error){
      set({loading: false, error: error.response?.data?.message || "Logout failed. Please try again."});
      throw error;
    }
  }
}));
