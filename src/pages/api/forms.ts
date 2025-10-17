import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise
  const db = client.db('ai_form_generator')
  const formsCollection = db.collection('forms')

  if (req.method === 'POST') {
    const { userId, title, schemaJson } = req.body
    if (!userId || !title || !schemaJson) {
      return res.status(400).json({ message: 'Missing required fields' })
    }
    const newForm = {
      userId,
      title,
      schemaJson,
      createdAt: new Date(),
    }
    const result = await formsCollection.insertOne(newForm)
    return res.status(201).json({ id: result.insertedId })
  }

  if (req.method === 'GET') {
    const { userId } = req.query
    if (!userId) return res.status(400).json({ message: 'Missing userId' })
    const forms = await formsCollection.find({ userId }).toArray()
    return res.status(200).json(forms)
  }

  if (req.method === 'DELETE') {
    const { id } = req.body
    if (!id) return res.status(400).json({ message: 'Missing form id' })
    await formsCollection.deleteOne({ _id: new ObjectId(id) })
    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ message: 'Method Not Allowed' })
}