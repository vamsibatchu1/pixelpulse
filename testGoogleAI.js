import 'dotenv/config'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.API_KEY)

// Get the generative model
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

const prompt = 'Write a short story about a brave knight and a dragon.'
const result = await model.generateContent(prompt)

// Log the response
console.log(result.response.text())

// Run the test
testGoogleAI()
