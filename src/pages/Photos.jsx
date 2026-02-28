import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

export default function Photos() {
  const [images, setImages] = useState([])

  const handleUpload = (e) => {
    const files = Array.from(e.target.files)
    const previews = files.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }))
    setImages([...images, ...previews])
  }

  return (
    <div className="space-y-10">

      <h1 className="text-3xl font-bold">Project Photos</h1>

      <input
        type="file"
        multiple
        onChange={handleUpload}
        className="border p-2 rounded-md"
      />

      <div className="grid md:grid-cols-3 gap-6">
        {images.map((img, index) => (
          <Card key={index} className="rounded-2xl border shadow-sm">
            <CardContent>
              <img
                src={img.url}
                alt="preview"
                className="rounded-xl object-cover w-full h-48"
              />
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  )
}