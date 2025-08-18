import axios, { type AxiosInstance } from "axios";

// --- Interfaces ---
// This interface defines the data structure for the farmer's profile,
// matching the Pydantic model on your FastAPI backend.
export interface FarmerProfile {
  farmer_name: string;
  commodity: string;
  grade: string;
  minimum_price: number;
  location: string;
}
    
// This interface defines the expected structure of the successful API response.
export interface AgentResponse {
  agent_run_log: string;
}


// --- Live Agent Service ---
// This class handles all communication with your deployed backend.
export class AgentService {
  private static instance: AgentService;
  private api: AxiosInstance;

  private constructor() {
    // The baseURL is now set to your live Google Cloud Run URL.
    const baseURL = import.meta.env.VITE_BACKEND_API_KEY;
    if (!baseURL) {
      throw new Error("The API URL is missing.");
    }
    this.api = axios.create({ baseURL });
  }

  public static getInstance(): AgentService {
    if (!AgentService.instance) {
      AgentService.instance = new AgentService();
    }
    return AgentService.instance;
  }

  /**
   * Activates the Proactive Sales Agent on the backend.
   * @param profile - The farmer's profile data.
   * @returns A promise that resolves with the complete agent run log.
   */
  async runAgent(profile: FarmerProfile): Promise<AgentResponse> {
    try {
      // Makes a POST request to the /setuAgent endpoint with the farmer's profile.
      const response = await this.api.post('/setuAgent', profile);
      return response.data;
    } catch (error) {
      console.error("Error activating the sales agent:", error);
      // Provides a user-friendly error message if the API call fails.
      throw new Error("Failed to get a response from the agent. Please check the backend server.");
    }
  }
}