import axios, { type AxiosInstance } from "axios";

// --- Interfaces (matching your Pydantic models) ---

// Used for the /general_advisory endpoint
export interface LocationData {
  latitude: number;
  longitude: number;
  crop: string;
  language: string;
}

export interface FinancialQuery {
  goal: string;
  latitude: number;
  longitude: number;
}

// Interface for the expected API response
export interface FinancialAdvisoryResponse {
  advisory: string;
}

// Defines the expected structure for a successful advisory response
export interface AdvisoryResponse {
  advisory_report: string;
}

// Defines the expected structure for a successful disease detection response
export interface DiseaseAnalysisResponse {
  plant: string;
  filename: string;
  analysis: string;
}


// --- Updated Assistant Service ---
// This class is now configured to work with your live backend endpoints.

export class Assistant {
  private static instance: Assistant;
  private api: AxiosInstance;
  private financeApi: AxiosInstance;

  private constructor() {
    // The baseURL is set to your live Google Cloud Run URL.
    const baseURL = import.meta.env.VITE_BACKEND_API_KEY;
    const baseURLFinance = import.meta.env.VITE_BACKEND_FINANCE_API_KEY;
    
    if (!baseURL && !baseURLFinance) {
      throw new Error("API URL is missing.");
    }
    this.api = axios.create({ baseURL });
    this.financeApi = axios.create({ baseURL: baseURLFinance })
  }

  public static getInstance(): Assistant {
    if (!Assistant.instance) {
      Assistant.instance = new Assistant();
    }
    return Assistant.instance;
  }

  /**
   * Fetches a general agricultural advisory for a given location and crop.
   * This method is used by the Crop Recommender, Scheme Advisor, and General Query chatboxes.
   * @param location - The location data including coordinates, crop, and language.
   * @returns A promise that resolves with the advisory report.
   */

  public async getAdvisory(location: LocationData): Promise<AdvisoryResponse> {
    try {
      // Calls the /general_advisory/ endpoint with the location data.
      const response = await this.api.post('/general_advisory/', location);
      return response.data;
    } catch (error) {
      console.error("Error fetching general advisory:", error);
      throw new Error("Failed to get an advisory from the assistant.");
    }
  }

  /**
   * Identifies a plant disease from an uploaded image and text context.
   * This method is used by the Disease Detector chatbox.
   * @param image - The image file of the plant (from an <input type="file">).
   * @param plantName - The name of the plant (e.g., "Tomato").
   * @param context - The user's text query or context about the issue.
   * @returns A promise that resolves with the disease analysis.
   */

  public async identifyDisease(image: File, plantName: string, context: string): Promise<DiseaseAnalysisResponse> {
    // The /detect/ endpoint expects 'multipart/form-data', so we use the FormData API.
    const formData = new FormData();
    formData.append("image", image);
    formData.append("plant_name", plantName);
    formData.append("context", context);

    try {
      const response = await this.api.post('/detect/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error during disease detection:", error);
      throw new Error("Failed to analyze the plant image.");
    }
  }

  public async getFinancialAdvisory(query: string, latitude: number, longitude: number): Promise<string> {
    const payload: FinancialQuery = {
      goal: query,
      latitude,
      longitude,
    }
    try {
      const response = await this.financeApi.post<FinancialAdvisoryResponse>('/financial_advisory', payload);
      return response.data.advisory;
    } catch (error) {
      console.error("Error fetching financial advisory:", error);
      if (axios.isAxiosError(error) && error.response) {
        // Return the detailed error message from the FastAPI backend if available
        return `Error from server: ${error.response.data.detail || "An unknown error occurred."}`;
      }
      throw new Error("Failed to get a response from the financial advisor.");
    }
  }
}
