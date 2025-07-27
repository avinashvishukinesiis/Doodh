"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Droplets, Eye, Home, Hand, Flower2, ChevronDown, ChevronUp, Instagram, Mail, Youtube } from "lucide-react"

interface FormData {
  name: string
  email: string
  phone: string
  pincode: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  pincode?: string
}

export default function HomePage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    pincode: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [showOtpForm, setShowOtpForm] = useState(false)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [phoneNumber, setPhoneNumber] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0);

  const carouselImages = [
    '/placeholder-user.png',
    '/placeholder-user2.png',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number"
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required"
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit pincode"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setPhoneNumber(formData.phone)
    setShowOtpForm(true)
    setIsSubmitting(false)
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleOtpSubmit = async () => {
    const otpValue = otp.join("")
    if (otpValue.length !== 6) {
      alert("Please enter complete OTP")
      return
    }

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    alert("OTP verified successfully! Welcome to Doodh & Co.")
    setShowOtpForm(false)
    setFormData({ name: "", email: "", phone: "", pincode: "" })
    setOtp(["", "", "", "", "", ""])
    setIsSubmitting(false)
  }

  const handleResendOtp = async () => {
    alert("OTP resent successfully!")
  }

  const faqData = [
    {
      question: "Doodh & Co. Different From Other Milk Brands?",
      answer:
        "We focus on preserving traditional dairy practices while ensuring transparency and quality at every step of our supply chain.",
    },
    {
      question: "How Do I Get Doodh & Co. Milk?",
      answer:
        "We're currently in our pre-launch phase. Join our waitlist to be the first to know when we start deliveries in your area.",
    },
    {
      question: "Where Is The Milk Sourced From?",
      answer:
        "Our milk comes directly from local farmers who follow traditional and sustainable farming practices, ensuring the highest quality and freshness.",
    },
    {
      question: "Will You Deliver In My City?",
      answer:
        "We're expanding gradually across India. Enter your pincode in our form to check if we'll be delivering to your area soon.",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 p-4 md:p-6">
        <div className="container mx-auto flex justify-between items-center">
          <button className="text-sm md:text-base hover:underline font-ibm text-customYellow">JOIN US</button>
          <div className="flex items-center">
            <img src="/Layer_1.png" alt="cow logo" />
          </div>
          <button className="text-sm md:text-base hover:underline font-ibm text-customYellow">LEARN MORE</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/cowImg.png)" }}
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative h-full z-10 px-4 max-w-4xl mx-auto">
          <div className="h-full flex items-center flex-col justify-between">
            <div className="relative top-44">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 tracking-wide text-customYellow font-yatra">
                Preserving India's Dairy Heritage
              </h1>
              <p className="text-lg md:text-xl mb-8 font-light text-customYellow font-ibm">
                Simple Packaging. Pure Milk. Transparency.
                <br />
                Just The Way It Should Be.
              </p>
            </div>
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 tracking-wider text-customYellow font-yatra">Doodh & Co.</h2>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 md:py-24 bg-hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-customBlue font-yatra mb-8">BE THE FIRST TO KNOW</h2>
          <p className="mb-2 max-w-2xl mx-auto text-customBlue font-ibm font-medium">
            We're Almost Ready To Serve Our First Batch Of Pure, Honest Milk.
          </p>
          <p className="text-customBlue font-ibm mb-8 max-w-2xl mx-auto font-medium">
            Sign Up To Be Among The First To Bring <span className="font-semibold">Doodh & Co.</span> Home.
          </p>

          <Card className="max-w-md mx-auto bg-customYellowText rounded-none border border-customBlue backdrop-blur-sm">
            <CardContent className="p-6">
              {!showOtpForm ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="Name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className={`bg-blue-100 border-0 font-ibm ${errors.name ? "ring-2 ring-red-500" : ""}`}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`bg-blue-100 border-0 font-ibm ${errors.email ? "ring-2 ring-red-500" : ""}`}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <Input
                      type="tel"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className={`bg-blue-100 border-0 font-ibm ${errors.phone ? "ring-2 ring-red-500" : ""}`}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <Input
                      type="text"
                      placeholder="Pincode"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange("pincode", e.target.value)}
                      className={`bg-blue-100 border-0 font-ibm ${errors.pincode ? "ring-2 ring-red-500" : ""}`}
                    />
                    {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-customYellowSoft hover:bg-customYellow hover:border hover:border-customYellowSoft text-customBlue font-ibm"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Joining..." : "Verify & Join the Waitlist"}
                  </Button>
                </form>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-blue-600">OTP Verification</h3>

                  <div className="text-center">
                    <p className="text-gray-600 text-sm mb-4">We Have Sent A Verification Code To</p>
                    <p className="text-gray-800 font-medium">
                      +91-{phoneNumber.slice(0, 2)}XXX {phoneNumber.slice(-4)}
                    </p>
                  </div>

                  <div className="flex justify-center gap-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-12 text-center text-lg font-semibold bg-blue-100 border-2 border-blue-200 rounded-lg focus:border-blue-400 focus:outline-none"
                      />
                    ))}
                  </div>

                  <div className="text-center">
                    <button onClick={handleResendOtp} className="text-blue-600 text-sm hover:underline">
                      Resend OTP
                    </button>
                  </div>

                  <Button
                    onClick={handleOtpSubmit}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Verifying..." : "Confirm"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        {/* Values Section */}
        <div className="pt-16 md:pt-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
              <div className="text-center">
                <Droplets className="w-12 h-12 md:w-16 md:h-16 text-customBlue mx-auto mb-4" />
                <h3 className="font-semibold text-customBlueText md:text-customBlueLight font-ibm text-sm md:text-base mb-2">OUR MILK IS</h3>
                <p className="text-customBlueText md:text-customBlueLight font-ibm text-xs md:text-sm">100% ORGANIC</p>
              </div>

              <div className="text-center">
                <Eye className="w-12 h-12 md:w-16 md:h-16 text-customBlue mx-auto mb-4" />
                <h3 className="font-semibold text-customBlueText md:text-customBlueLight font-ibm text-sm md:text-base mb-2">TRANSPARENT</h3>
                <p className="text-customBlueText md:text-customBlueLight font-ibm text-xs md:text-sm">SUPPLY CHAIN</p>
              </div>

              <div className="text-center">
                <Home className="w-12 h-12 md:w-16 md:h-16 text-customBlue mx-auto mb-4" />
                <h3 className="font-semibold text-customBlueText md:text-customBlueLight font-ibm text-sm md:text-base mb-2">SUPPORTING</h3>
                <p className="text-customBlueText md:text-customBlueLight font-ibm text-xs md:text-sm">FAMILY NOURISHMENT</p>
              </div>

              <div className="text-center">
                <Hand className="w-12 h-12 md:w-16 md:h-16 text-customBlue mx-auto mb-4" />
                <h3 className="font-semibold text-customBlueText md:text-customBlueLight font-ibm text-sm md:text-base mb-2">WE WORK WITH</h3>
                <p className="text-customBlueText md:text-customBlueLight font-ibm text-xs md:text-sm">LOCAL FARMERS</p>
              </div>

              <div className="text-center col-span-2 md:col-span-1">
                <Flower2 className="w-12 h-12 md:w-16 md:h-16 text-customBlue mx-auto mb-4" />
                <h3 className="font-semibold text-customBlueText md:text-customBlueLight text-sm md:text-base mb-2">PURE FODDER</h3>
                <p className="text-customBlueText md:text-customBlueLight text-xs md:text-sm">FOR THE COW</p>
              </div>
            </div>
          </div>
        </div>
      </section>






      {/* Coming Soon Timeline */}
      <section className="py-8 bg-yellow-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-around items-center gap-4 md:gap-8 text-center">
            {["COMING SOON", "Doodh & Co", "COMING SOON", "Doodh & Co", "COMING SOON", "Doodh & Co", "COMING SOON"].map(
              (item, index) => (
                <div key={index} className="text-xs md:text-sm font-medium font-ibm text-customBlue">
                  {item}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-customBlueBright">
        <div className="container mx-auto md:pr-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="text-white bg-customBlue py-16 md:py-24">
              <div className="mb-8 w-full">
                <div className="flex flex-wrap gap-2 mb-6 w-full items-center justify-center">
                  {Array.from({ length: 15 }, (_, i) => (
                    <div key={i} className="w-4 h-4 bg-customYellowDimond transform rotate-45" />
                  ))}
                </div>
                <div className="relative w-full aspect-[4/3] overflow-hidden rounded-md p-4">
                  <img
                    src={carouselImages[currentIndex]}
                    alt={`Slide ${currentIndex + 1}`}
                    className="w-full h-full object-cover transition-all duration-700 ease-in-out"
                  />

                  {/* Navigation dots */}
                  {/* <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {carouselImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-customBlueText' : 'bg-white/40'
                          }`}
                      />
                    ))}
                  </div> */}
                </div>
                <p className="text-sm leading-relaxed font-ibm text-customYellow pl-4">
                  Doodh & Co. is born from a simple need: to make pure, honest milk accessible to everyone. We believe
                  in transparency and trust in every step, from farm to your family's table. Our mission is to change
                  the system from within.
                </p>
                <div className="flex flex-wrap gap-2 mt-6 justify-center">
                  {Array.from({ length: 15 }, (_, i) => (
                    <div key={i} className="w-4 h-4 bg-customYellowDimond transform rotate-45" />
                  ))}
                </div>
              </div>
            </div>

            <div className="py-16 md:py-24 h-full flex flex-col items-center justify-center">
              <h2 className="text-3xl md:text-4xl font-medium font-yatra text-customYellowText mb-8">YOUR QUESTIONS, ANSWERED!</h2>

              <div className="space-y-4">
                {faqData.map((faq, index) => (
                  <div key={index} className="backdrop-blur-sm border-t-2 border-customBlueText">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full p-4 text-left flex justify-between items-center text-customBlueText font-ibm"
                    >
                      <span className="font-medium">{faq.question}</span>
                      {expandedFaq === index ? (
                        <ChevronUp className="w-5 h-5 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 flex-shrink-0" />
                      )}
                    </button>
                    {expandedFaq === index && <div className="px-4 pb-4 text-customBlueText font-ibm">{faq.answer}</div>}
                  </div>
                ))}
                <div className="border border-customBlueText" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <footer className="pt-16 md:pt-24 bg-custom-gradient text-center">
        <div className="container mx-auto px-4">
          <p className="text-xl md:text-2xl text-customBlue font-yatra max-w-4xl mx-auto leading-relaxed">
            Doodh & Co's mission is simple: to blend traditional practices with humble intent & modern resources, making
            pure milk accessible to more people at an effective cost.
          </p>
        </div>


        {/* Footer */}
        <div className="py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-9xl font-semibold text-customBlue mb-4 font-yatra">Doodh & Co.</h2>
            </div>
            <div className="px-4 md:px-14">
              <div className="grid md:grid-cols-4 gap-8 text-sm border-y border-customBlue px-6 py-8">
                <div>
                  <div className="flex items-center mb-4">
                    <img src="/footerLogo.png" alt="Cow illustration logo" />
                  </div>
                </div>

                <div className="text-start">
                  <h4 className="font-semibold text-customBlue font-ibm text-lg mb-3">FROM COW TO CUP</h4>
                  <p className="text-customBlue font-ibm mb-2 text-sm font-medium">Get early access to our
                    first batch of pure milk</p>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Enter Mail"
                      className={`bg-[#D1EEFF] border border-customBlue focus:outline-none focus:ring-0 focus:ring-transparent focus:border-customBlueText focus:shadow-none font-ibm w-full rounded-md px-4 py-2`}
                    />
                    <p className="absolute right-2 text-sm bottom-0 top-0 uppercase flex items-center justify-center font-ibm text-customBlue cursor-pointer">join now</p>
                  </div>
                </div>

                <div className="text-start">
                  <h4 className="font-semibold text-customBlue font-ibm text-lg mb-3">RESOURCES</h4>
                  <ul className="space-y-1 text-customBlue font-ibm text-sm font-medium">
                    <li>Terms & Conditions</li>
                    <li>Refund & Cancellation</li>
                    <li>Privacy Policy</li>
                  </ul>
                </div>

                <div className="text-start">
                  <h4 className="font-semibold text-customBlue font-ibm text-lg mb-3">CONTACT</h4>
                  <p className="text-customBlue font-ibm mb-1 text-sm font-medium flex gap-4 items-center">Instagram <Instagram width={16} /></p>
                  <p className="text-customBlue font-ibm mb-1 text-sm font-medium flex gap-4 items-center">Call Us <Mail width={16} /></p>
                  <p className="text-customBlue font-ibm text-sm font-medium flex gap-4 items-center">Youtube <Youtube width={16} /></p>
                </div>
              </div>
            </div>


            <div className="pt-4 px-4 md:px-20 text-start text-md text-customBlue font-ibm font-medium">
              DOODH & CO. | 2024 | ALL RIGHTS RESERVED
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
