import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { imageApi } from '../../api/services'
import { ImagePlus, Upload, AlertTriangle } from 'lucide-react'

export default function ImageUploadPage() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef()

  const handleFile = (f) => {
    if (!f) return
    setFile(f)
    setResult(null)
    setPreview(URL.createObjectURL(f))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])
  }

  const handleAnalyse = async () => {
    if (!file) return
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await imageApi.analyze(formData)
      setResult(res.data.data)
      toast.success('Image analysis complete')
    } catch {
      toast.error('Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Medical Image Screening</h2>
        <p className="text-gray-500 mt-1 text-sm">
          Upload an X-ray, MRI, CT scan, or dermatology image for AI-assisted analysis.
        </p>
      </div>

      {/* Upload area */}
      <div
        className="card border-2 border-dashed border-gray-200 hover:border-primary-400 transition-colors cursor-pointer mb-6"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.bmp,.tiff,.tif"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {preview ? (
          <div className="flex flex-col items-center gap-3">
            <img src={preview} alt="Preview" className="max-h-56 rounded-lg object-contain" />
            <p className="text-sm text-gray-500">{file.name}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-8 text-gray-400">
            <Upload size={36} className="text-gray-300" />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Drop image here or click to browse</p>
              <p className="text-xs mt-1">JPG, PNG, BMP, TIFF — max 10 MB</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 mb-6">
        <button onClick={handleAnalyse} disabled={!file || loading} className="btn-primary">
          {loading ? 'Analysing...' : 'Analyse image'}
        </button>
        <button onClick={() => { setFile(null); setPreview(null); setResult(null) }} className="btn-secondary">
          Clear
        </button>
      </div>

      {result && (
        <div className={`card border-l-4 ${result.requiresUrgentReview ? 'border-l-red-500' : 'border-l-primary-400'}`}>
          <div className="flex items-center gap-2 mb-4">
            <ImagePlus size={18} className="text-primary-600" />
            <h3 className="font-semibold text-gray-900">AI Screening Result</h3>
            {result.requiresUrgentReview && (
              <span className="badge-critical ml-auto">Urgent review needed</span>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Image type</p>
              <p className="font-medium text-gray-900 mt-0.5">{result.imageType}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Primary finding</p>
              <p className="font-medium text-gray-900 mt-0.5">{result.finding}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Confidence</p>
              <p className="text-gray-700 mt-0.5">{(result.confidenceScore * 100).toFixed(0)}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Recommendation</p>
              <p className="text-gray-700 mt-0.5 leading-relaxed">{result.recommendation}</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-start gap-2 text-xs text-gray-400">
            <AlertTriangle size={13} className="mt-0.5 shrink-0" />
            AI screening is not a substitute for professional radiological diagnosis.
          </div>
        </div>
      )}
    </div>
  )
}
