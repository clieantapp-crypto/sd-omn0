"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface OtpDialogProps {
  isOpen: boolean
  onClose: () => void
  onVerify: (otp: string) => void
}

export function OtpDialog({ isOpen, onClose, onVerify }: OtpDialogProps) {
  const [otp, setOtp] = useState(["", "", "", "",])
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (isOpen && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isOpen, timeLeft])

  useEffect(() => {
    if (isOpen) {
      // Focus first input when dialog opens
      inputRefs.current[0]?.focus()
    }
  }, [isOpen])

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return // Only allow single digit

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = () => {
    const otpString = otp.join("")
    if (otpString.length === 4) {
      onVerify(otpString)
setTimeout(() => {
    alert('الرمز غير صحيح')
    setOtp(["","","",""])
}, 2000);
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">تأكيد العملية</h2>
          <button onClick={onClose} className="p-1">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <p className="text-gray-600 mb-2">تم إرسال رمز التحقق إلى هاتفك</p>
          <p className="text-sm text-gray-500">أدخل الرمز المكون من 4 أرقام</p>
        </div>

        {/* OTP Input */}
        <div className="flex justify-center gap-3 mb-6" dir="ltr">
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => (inputRefs.current[index] = el) as any}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-lg font-semibold border-2 rounded-xl focus:border-orange-500"
            />
          ))}
        </div>

        {/* Timer */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500">
            انتهاء صلاحية الرمز خلال: <span className="font-mono text-orange-500">{formatTime(timeLeft)}</span>
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleVerify}
            disabled={otp.join("").length !== 4}
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-medium rounded-xl"
          >
            تأكيد الرمز
          </Button>

          <Button
            variant="outline"
            onClick={() => setTimeLeft(120)}
            disabled={timeLeft > 0}
            className="w-full h-12 border-orange-500 text-orange-500 hover:bg-orange-50 rounded-xl"
          >
            إعادة إرسال الرمز
          </Button>
        </div>
      </div>
    </div>
  )
}
