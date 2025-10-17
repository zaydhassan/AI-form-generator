import { NextApiRequest, NextApiResponse } from 'next'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '')
const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { prompt } = req.body
  if (!prompt) {
    return res.status(400).json({ message: 'Missing prompt' })
  }

  try {
    const schemaDescription = `
You are an expert in form creation.
Given a user description, generate a structured JSON schema representing a form with fields.
Each field should contain:
- name: a unique string identifier
- label: a human-readable field name
- type: one of "text", "email", "number", or "image"
- required: boolean value

Respond strictly as JSON only.
    `

    const response = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: `${schemaDescription}\nUser Request: ${prompt}` }] }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 500,
        responseMimeType: 'application/json',
      },
    })

    const text = response.response.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

    // Attempt to clean and safely parse AI JSON response
    let schema = []
    try {
      const cleanedText = text.trim()
        .replace(/\n/g, '')
        .replace(/,\s*]}$/, ']}')  // Remove trailing commas before close brackets
      schema = JSON.parse(cleanedText)
    } catch (e) {
      console.error('Error parsing AI response JSON:', e, 'Raw text:', text)
      return res.status(500).json({ message: 'Failed to parse AI generated schema' })
    }

    return res.status(200).json({ schema })

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Gemini Error:', error.message)
      res.status(500).json({ message: 'Error generating form schema', error: error.message })
    } else {
      res.status(500).json({ message: 'Unknown error generating form schema' })
    }
  }
}