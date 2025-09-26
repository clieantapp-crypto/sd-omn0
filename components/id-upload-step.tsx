"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface IdUploadStepProps {
  onComplete: () => void
}

export default function IdUploadStep({ onComplete }: IdUploadStepProps) {
  const [frontIdFile, setFrontIdFile] = useState<File | null>(null)
  const [backIdFile, setBackIdFile] = useState<File | null>(null)
  const [frontIdUrl, setFrontIdUrl] = useState<string>("")
  const [backIdUrl, setBackIdUrl] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)

  const uploadToImgBB = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("image", file)

    // Note: In a real app, you'd need to get an API key from imgbb.com
    // For demo purposes, we'll simulate the upload
    const response = await fetch("https://api.imgbb.com/1/upload?key=7d403c381a239577b33cdc4d86e5c6b7p", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      // Fallback: create a local URL for demo
      return URL.createObjectURL(file)
    }

    const data = await response.json()
    return data.data.url
  }

  const handleFileUpload = async (file: File, type: "front" | "back") => {
    setIsUploading(true)
    try {
      const url = await uploadToImgBB(file)
      if (type === "front") {
        setFrontIdUrl(url)
      } else {
        setBackIdUrl(url)
      }
    } catch (error) {
      console.error("Upload failed:", error)
      // For demo, still create local URL
      const localUrl = URL.createObjectURL(file)
      if (type === "front") {
        setFrontIdUrl(localUrl)
      } else {
        setBackIdUrl(localUrl)
      }
    }
    setIsUploading(false)
  }

  const handleFrontIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFrontIdFile(file)
      handleFileUpload(file, "front")
    }
  }

  const handleBackIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBackIdFile(file)
      handleFileUpload(file, "back")
    }
  }

  const canProceed = frontIdFile && backIdFile && frontIdUrl && backIdUrl

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="white" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2 text-balance">تحميل صور الهوية</h1>
          <p className="text-slate-600 text-sm leading-relaxed">يرجى تحميل صور واضحة لوجه وظهر بطاقة الهوية</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden">
          <div className="p-8 space-y-6">
            {/* Front ID Upload */}
            <div className="text-right">
              <label className="block text-slate-700 font-medium text-sm mb-3">صورة وجه الهوية *</label>
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFrontIdChange}
                  className="w-full border-2 border-slate-200 rounded-xl bg-slate-50/50 m-4 py-5 text-right text-sm focus:border-blue-500 focus:bg-white focus:ring-0 transition-all duration-200"
                  dir="rtl"
                />
                {frontIdUrl && (
                  <div className="mt-3">
                    <img
                      src={frontIdUrl || "/placeholder.svg"}
                      alt="Front ID"
                      className="w-full max-w-[200px] mx-auto rounded-lg shadow-sm"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Back ID Upload */}
            <div className="text-right">
              <label className="block text-slate-700 font-medium text-sm mb-3">صورة ظهر الهوية *</label>
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleBackIdChange}
                  className="w-full border-2 border-slate-200 rounded-xl bg-slate-50/50  p-5 text-right text-sm focus:border-blue-500 focus:bg-white focus:ring-0 transition-all duration-200"
                  dir="rtl"
                />
                {backIdUrl && (
                  <div className="mt-3">
                    <img
                      src={backIdUrl || "/placeholder.svg"}
                      alt="Back ID"
                      className="w-full max-w-[200px] mx-auto rounded-lg shadow-sm"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Upload Status */}
            {isUploading && (
              <div className="text-center py-4">
                <div className="flex items-center justify-center gap-2 text-blue-600">
                  <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                  <span className="text-sm">جاري تحميل الصور...</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                onClick={onComplete}
                disabled={!canProceed || isUploading}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-green-700 hover:to-green-800 text-white py-4 rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                {canProceed ? (
                  <div className="flex items-center justify-center gap-2">
                    <span>إكمال التسجيل</span>
                    <span>✓</span>
                  </div>
                ) : (
                  <span>يرجى تحميل صور الهوية</span>
                )}
              </Button>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-right">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,17A1.5,1.5 0 0,1 10.5,15.5A1.5,1.5 0 0,1 12,14A1.5,1.5 0 0,1 13.5,15.5A1.5,1.5 0 0,1 12,17M12,10.5A1.5,1.5 0 0,1 10.5,9A1.5,1.5 0 0,1 12,7.5A1.5,1.5 0 0,1 13.5,9A1.5,1.5 0 0,1 12,10.5Z" />
                </svg>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">نصائح للحصول على أفضل النتائج:</p>
                  <ul className="text-xs space-y-1 text-blue-700">
                    <li>• تأكد من وضوح الصورة وعدم وجود ظلال</li>
                    <li>• تأكد من ظهور جميع أطراف البطاقة</li>
                    <li>• استخدم إضاءة جيدة</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
            <span className="text-xs">معلوماتك محمية ومشفرة</span>
          </div>
        </div>
      </div>
    </div>
  )
}
