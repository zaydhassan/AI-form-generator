import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import FormRenderer from '../../components/FormRenderer'

export default function PublicFormPage() {
  const router = useRouter()
  const { id } = router.query

  interface Field {
  name: string;
  label: string;
  type: "text" | "email" | "number" | "image";
  required?: boolean;
}

const [formSchema, setFormSchema] = useState<Field[]>([])

  useEffect(() => {
    if (!id) return
    fetch(`/api/forms?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.schemaJson) return
        setFormSchema(data.schemaJson)
      })
  }, [id])

  if (formSchema.length === 0) {
    return <p>Loading form...</p>
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Fill Form</h1>
      <FormRenderer schema={formSchema} />
    </div>
  )
}