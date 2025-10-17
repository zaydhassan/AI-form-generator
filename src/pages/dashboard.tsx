import { useState, useEffect } from 'react'
import { useUser, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs'
import FormRenderer from '../components/FormRenderer'
import { ExternalLink, Trash2 } from "lucide-react"

const Dashboard = () => {
  const { user } = useUser()
  const [aiPrompt, setAiPrompt] = useState('')
  const [formSchema, setFormSchema] = useState<any[]>([])
  const [forms, setForms] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  async function fetchForms() {
    if (!user?.id) return
    const res = await fetch(`/api/forms?userId=${user.id}`)
    const data = await res.json()
    setForms(Array.isArray(data) ? data : [])
  }

  useEffect(() => {
    if (user?.id) fetchForms()
  }, [user])

  async function handleGenerateForm() {
    if (!aiPrompt) return alert('Please enter a prompt.')
    setLoading(true)
    try {
      const res = await fetch('/api/generate-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      })
      const data = await res.json()
      setFormSchema(Array.isArray(data.schema) ? data.schema : [])
    } catch (error) {
      setFormSchema([])
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveForm() {
    setSaving(true)
    const res = await fetch('/api/forms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user?.id,
        title: aiPrompt,
        schemaJson: formSchema,
      }),
    })
    if (res.ok) {
      setFormSchema([])
      setAiPrompt('')
      fetchForms()
    }
    setSaving(false)
  }

  async function handleDeleteForm(id: string) {
    const res = await fetch('/api/forms', {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    })
    if (res.ok) fetchForms()
  }

  function copyFormLink(formId: string) {
    const link = `${window.location.origin}/form/${formId}`
    navigator.clipboard.writeText(link)
    alert('Link copied!')
  }

  return (
    <>
      <SignedIn>
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6">AI-Powered Form Generator</h1>
          <textarea
            placeholder="Describe your form... e.g. Create a contact form with name, email, and message"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 mb-4"
            rows={4}
          />
          <button
            onClick={handleGenerateForm}
            disabled={loading}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-md hover:opacity-90 transition"
          >
            {loading ? 'Generating...' : 'Generate Form'}
          </button>
          {Array.isArray(formSchema) && formSchema.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl font-semibold mb-4">Form Preview</h2>
              <FormRenderer schema={formSchema} />
              <button
                onClick={handleSaveForm}
                disabled={saving}
                className="mt-6 w-full bg-purple-600 text-white px-4 py-3 rounded-md font-bold shadow hover:bg-purple-700 transition"
              >
                {saving ? 'Saving...' : 'Save Form to Dashboard'}
              </button>
            </div>
          )}

          {/* --- Saved Forms Section --- */}
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6">Your Saved Forms</h2>
            {forms.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
                No forms yet. Create and save your first form above!
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {forms.map((form) => (
                  <div key={form._id} className="bg-white rounded-xl p-6 shadow flex flex-col min-h-[120px] justify-between border">
                    <div>
                      <div className="font-bold text-lg">{form.title}</div>
                      <div className="text-gray-500 text-sm mt-1 italic">
                        {form.schemaJson?.map((f) => f.label).join(", ")}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-6">
                      <a
                        href={`/form/${form._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border rounded p-2 text-primary hover:bg-primary hover:text-white transition"
                        title="Open Form"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                      <button
                        onClick={() => copyFormLink(form._id)}
                        className="border rounded p-2 text-gray-600 hover:bg-gray-200 transition"
                        title="Copy Link"
                      >
                        Copy Link
                      </button>
                      <button
                        onClick={() => handleDeleteForm(form._id)}
                        className="border rounded p-2 text-red-500 hover:bg-red-50 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}

export default Dashboard
