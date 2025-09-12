// src/ai/flows/pesticide-db.ts
export const pesticideDB: Record<string, any[]> = {
    "Tomato___Early_blight": [
      {
        name: "Mancozeb",
        type: "chemical",
        description: "A broad-spectrum fungicide for early blight in tomatoes.",
        instructions: "Mix 2.5g per liter of water and spray on affected plants.",
        amount: "2.5g/L",
        usage: "Spray at 7-10 day intervals."
      },
      {
        name: "Chlorothalonil",
        type: "chemical",
        description: "A contact fungicide effective against blight.",
        instructions: "Mix 2g per liter of water and spray thoroughly.",
        amount: "2g/L",
        usage: "Repeat every 7 days during disease period."
      },
      {
        name: "Neem Oil",
        type: "natural",
        description: "Natural oil with antifungal properties.",
        instructions: "Mix 5ml neem oil with 1L water and spray.",
        amount: "5ml/L",
        usage: "Spray every 7 days."
      },
      {
        name: "Trichoderma viride",
        type: "natural",
        description: "A beneficial fungus that suppresses blight pathogens.",
        instructions: "Apply as per label instructions to soil and foliage.",
        amount: "As per label",
        usage: "Apply at planting and repeat as needed."
      }
    ],
    // Add more diseases as needed
  };