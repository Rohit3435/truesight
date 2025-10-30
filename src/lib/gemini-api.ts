// Gemini API Wrapper for TrueSight
// This file contains functions to interact with Google's Gemini API

// API Key
const GEMINI_API_KEY = "AIzaSyCvyzKcu52SCyol3sJPSjB1kMtGqk0xrcA";
const API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

export type ToxicityAnalysisResult = {
  toxicity_score: number;
  toxic_indicators: string[];
  mental_health_flag: boolean;
  distress_indicators: string[];
  summary_analysis: string;
};

export type IdentityAnalysisResult = {
  consistency_score: number;
  red_flags: string[];
  conclusion: string;
};

// Analyze text for toxicity and mental health concerns
export async function analyzeToxicityAndMentalHealth(text: string): Promise<ToxicityAnalysisResult> {
  try {
    const url = `${API_BASE_URL}/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;
    
    // Create the prompt for toxicity analysis
    const prompt = `
      You are an AI trained to analyze social media text for signs of toxicity and mental health distress. Your task is to provide a comprehensive analysis of the provided text.

      Toxicity Analysis:
      Identify and categorize any toxic language, including hate speech, insults, threats, harassment, or extreme negativity. Assign a toxicity score from 0 (harmless) to 10 (highly toxic).

      Mental Health Analysis:
      Look for language that suggests emotional distress, loneliness, self-harm ideation, or signs of a mental health crisis. Flag any content that raises a concern. This is a very sensitive task, so be cautious and only flag based on clear indicators.

      Output:
      Respond in a structured JSON format with the following keys:

      toxicity_score: [integer from 0-10]
      toxic_indicators: [list of specific phrases or examples of toxic content found]
      mental_health_flag: [boolean - true if distress is detected, false otherwise]
      distress_indicators: [list of specific phrases or examples of mental health distress]
      summary_analysis: [a brief, objective text summary of the findings]

      Text to Analyze:
      ${text}
    `;

    const payload = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("Could not extract JSON from response");
    }
  } catch (error) {
    console.error("Error analyzing toxicity:", error);
    // Return a fallback analysis in case of error
    return {
      toxicity_score: 5,
      toxic_indicators: ["Error retrieving indicators"],
      mental_health_flag: false,
      distress_indicators: [],
      summary_analysis: "Error analyzing content. Please try again later."
    };
  }
}

// Analyze behavior across platforms to detect if someone is real or fake
export async function analyzeIdentity(twitterProfile: string, redditProfile: string): Promise<IdentityAnalysisResult> {
  try {
    const url = `${API_BASE_URL}/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;
    
    // Create the prompt for identity verification
    const prompt = `
      You are a behavioral profiler for a digital identity verification service. Your task is to analyze a person's online behavior across multiple public sources and identify potential red flags for a fake or deceptive identity.

      Data to Analyze:

      Twitter Profile: ${twitterProfile}

      Reddit Profile: ${redditProfile}

      Analysis Points:

      Consistency Check: Do the bios, language, and interests align across platforms?

      Activity Patterns: Is the posting behavior consistent, or does it look like a bot (e.g., posting the same thing repeatedly, very high frequency)?

      Language Style: Is the language natural or does it sound like a canned or machine-generated text?

      Output:
      Provide a JSON response with the following:

      consistency_score: [integer from 0-10, where 10 is highly consistent]
      red_flags: [list of specific inconsistencies or suspicious behaviors detected]
      conclusion: [a concise conclusion on the likelihood of the profile being fake or real]
    `;

    const payload = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("Could not extract JSON from response");
    }
  } catch (error) {
    console.error("Error analyzing identity:", error);
    // Return a fallback analysis in case of error
    return {
      consistency_score: 5,
      red_flags: ["Error retrieving red flags"],
      conclusion: "Could not analyze profile consistency due to an error."
    };
  }
}

// Sample social media posts for testing
export const sampleSocialMediaData = {
  twitterPosts: `
    Just had the worst customer service experience at @AirlineName. Never flying with them again! #awful #customerservicesucks
    
    Can't believe how stupid some people are. If you don't understand basic science, maybe just keep quiet? 🙄
    
    Feeling really down today. Sometimes I wonder if anyone would even notice if I just disappeared.
    
    Another beautiful day in paradise! Beach time with the fam! #blessed #vacation
    
    @PoliticianName is the most corrupt official we've ever had. Total disaster for our country!
    
    Excited to announce I'm starting a new position at @TechCompany as Senior Developer! #newjob #techjobs
    
    Seriously considering deleting all my social media accounts and just disappearing. Too much toxicity.
    
    Check out my new blog post on mental health awareness and the importance of seeking help when needed. Link in bio.
    
    Just blocked another troll. Why do people think it's okay to send threatening messages to strangers? Get a life.
    
    My dog just did the cutest thing! [photo] #dogsoftwitter #furbaby
  `,
  
  redditComments: `
    I completely disagree with your assessment. The study you cited has been debunked multiple times and the authors even retracted their conclusion.
    
    This is absolutely beautiful work! The attention to detail is incredible. How long did it take you to complete?
    
    OP is clearly a shill for BigCorp. Look at their post history - nothing but corporate propaganda.
    
    Thanks for sharing this resource! As someone dealing with anxiety, these techniques have been really helpful.
    
    Are you seriously that dense? The answer is right in front of your face but you're too stubborn to see it.
    
    I've been struggling with similar thoughts. Some days are just harder than others, but we have to keep going.
    
    This is why I have trust issues. People will smile to your face and then stab you in the back first chance they get.
    
    The problem with this subreddit is all the armchair experts who've never actually worked in the field.
    
    I'm a lawyer specializing in this area. The advice you received is dangerously incorrect and could cause serious legal problems.
    
    What a fascinating perspective! I hadn't considered that angle before. This completely changes how I view the issue.
  `
};
