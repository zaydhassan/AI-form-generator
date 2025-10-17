import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../lib/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise
  const db = client.db('ai_form_generator')
  const submissionsCollection = db.collection('submissions')

  if (req.method === 'POST') {
    const { formId, submissionData } = req.body

    if (!formId || !submissionData) {
      return res.status(400).json({ message: 'Missing formId or submissionData' })
    }

    const newSubmission = {
      formId,
      submissionData,
      createdAt: new Date(),
    }

    const result = await submissionsCollection.insertOne(newSubmission)
    return res.status(201).json({ id: result.insertedId })
  }

  if (req.method === 'GET') {
    const { formId } = req.query
    if (!formId) return res.status(400).json({ message: 'Missing formId' })

    const submissions = await submissionsCollection.find({ formId }).toArray()
    return res.status(200).json(submissions)
  }

  return res.status(405).json({ message: 'Method Not Allowed' })
}