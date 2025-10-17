import { NextApiRequest, NextApiResponse } from 'next'
import cloudinary from '../../lib/cloudinary'
import formidable from 'formidable'
import fs from 'fs'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const form = new formidable.IncomingForm()

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: 'File upload error', error: err })
    }

    const file = files.file as formidable.File

    try {
      const result = await cloudinary.uploader.upload(file.filepath, {
        folder: 'ai-powered-forms',
        resource_type: 'auto',
      })

      return res.status(200).json({ url: result.secure_url })
    } catch (error) {
      return res.status(500).json({ message: 'Cloudinary upload failed', error })
    }
  })
}