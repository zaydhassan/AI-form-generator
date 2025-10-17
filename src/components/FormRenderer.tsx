import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { Loader, CheckCircle2, Image as ImageIcon } from "lucide-react";

interface Field {
  name: string;
  label: string;
  type: "text" | "email" | "number" | "image";
  required?: boolean;
}

interface FormRendererProps {
  schema: Field[];
  onSubmitSuccess?: () => void;
}

export default function FormRenderer({ schema, onSubmitSuccess }: FormRendererProps) {
  const { control, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data: Record<string, string | FileList | undefined>) => {
    setLoading(true);
    try {
      for (const field of schema) {
        if (field.type === "image" && data[field.name] && (data[field.name] as FileList).length > 0) {
          const file = (data[field.name] as FileList)[0];
          const formData = new FormData();
          formData.append("file", file);
          const uploadRes = await axios.post("/api/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
         
          data[field.name] = uploadRes.data.url;
        }
      }
      setSuccess(true);
      reset();
      onSubmitSuccess?.();
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error(error);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg space-y-7 border border-gray-100 max-w-xl mx-auto transition-all"
    >
      {schema.map((field) => (
        <div key={field.name} className="flex flex-col mb-2">
          <label
            htmlFor={field.name}
            className="text-lg font-semibold text-gray-700 mb-2"
          >
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {field.type === "image" ? (
            <Controller
              name={field.name}
              control={control}
              rules={{ required: field.required }}
              render={({ field: controllerField }) => (
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    id={field.name}
                    accept="image/*"
                    onChange={(e) => controllerField.onChange(e.target.files)}
                    className="block w-full rounded-xl border border-gray-300 px-4 py-3 text-lg text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#7429f5] transition"
                  />
                  <ImageIcon className="w-6 h-6 text-[#7429f5]" />
                </div>
              )}
            />
          ) : (
            <Controller
              name={field.name}
              control={control}
              rules={{ required: field.required }}
              render={({ field: controllerField }) => (
                <input
                  id={field.name}
                  type={field.type}
                  autoComplete="off"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  {...controllerField}
                  className="rounded-xl border border-gray-300 px-4 py-3 text-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7429f5] transition"
                />
              )}
            />
          )}
        </div>
      ))}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#7429f5] hover:bg-[#a56ff2] text-white py-4 px-10 rounded-xl font-bold text-lg shadow-lg transition flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader className="w-5 h-5 animate-spin" /> Submitting...
          </>
        ) : (
          <>
            Submit <CheckCircle2 className="w-5 h-5" />
          </>
        )}
      </button>
      {success && (
        <div className="text-green-600 mt-4 font-semibold flex items-center gap-2 justify-center animate-fade-in">
          <CheckCircle2 className="w-5 h-5" /> Form submitted successfully!
        </div>
      )}
    </form>
  );
}