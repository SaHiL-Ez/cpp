// Type definition for remedies and pesticides
export type RemedyOrPesticide = {
    name: string; // Name of the remedy or pesticide
    type: "chemical" | "natural"; // Type: chemical or natural
    instructions: string; // Instructions for usage
    amount: string; // Amount to be used
    usage: string; // Usage guidelines
  };
  
  // Function to fetch remedies and pesticides based on the detected pest or disease
  export async function fetchRemediesAndPesticides(pestOrDisease: string): Promise<RemedyOrPesticide[]> {
    const res = await fetch("/api/gemini-remedies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pestOrDisease }),
    });
    if (!res.ok) {
      throw new Error("Failed to fetch remedies from Gemini API");
    }
    const data = await res.json();
    return data.remedies || [];
  }