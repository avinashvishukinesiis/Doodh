"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Droplets, Eye, Home, Hand, Flower2, ChevronDown, ChevronUp, Crown } from "lucide-react"

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

    alert("Thank you for joining our waitlist!")
    setFormData({ name: "", email: "", phone: "", pincode: "" })
    setIsSubmitting(false)
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
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

          <Card className="max-w-md mx-auto bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`bg-blue-100 border-0 ${errors.name ? "ring-2 ring-red-500" : ""}`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`bg-blue-100 border-0 ${errors.email ? "ring-2 ring-red-500" : ""}`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Input
                    type="tel"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={`bg-blue-100 border-0 ${errors.phone ? "ring-2 ring-red-500" : ""}`}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <Input
                    type="text"
                    placeholder="Pincode"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange("pincode", e.target.value)}
                    className={`bg-blue-100 border-0 ${errors.pincode ? "ring-2 ring-red-500" : ""}`}
                  />
                  {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Joining..." : "Verify & Join the Waitlist"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        {/* Values Section */}
        <div className="pt-16 md:pt-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
              <div className="text-center">
                <Droplets className="w-12 h-12 md:w-16 md:h-16 text-customBlue mx-auto mb-4" />
                <h3 className="font-semibold text-customBlueLight font-ibm text-sm md:text-base mb-2">OUR MILK IS</h3>
                <p className="text-customBlueLight font-ibm text-xs md:text-sm">100% ORGANIC</p>
              </div>

              <div className="text-center">
                <Eye className="w-12 h-12 md:w-16 md:h-16 text-customBlue mx-auto mb-4" />
                <h3 className="font-semibold text-customBlueLight font-ibm text-sm md:text-base mb-2">TRANSPARENT</h3>
                <p className="text-customBlueLight font-ibm text-xs md:text-sm">SUPPLY CHAIN</p>
              </div>

              <div className="text-center">
                <Home className="w-12 h-12 md:w-16 md:h-16 text-customBlue mx-auto mb-4" />
                <h3 className="font-semibold text-customBlueLight font-ibm text-sm md:text-base mb-2">SUPPORTING</h3>
                <p className="text-customBlueLight font-ibm text-xs md:text-sm">FAMILY NOURISHMENT</p>
              </div>

              <div className="text-center">
                <Hand className="w-12 h-12 md:w-16 md:h-16 text-customBlue mx-auto mb-4" />
                <h3 className="font-semibold text-customBlueLight font-ibm text-sm md:text-base mb-2">WE WORK WITH</h3>
                <p className="text-customBlueLight font-ibm text-xs md:text-sm">LOCAL FARMERS</p>
              </div>

              <div className="text-center col-span-2 md:col-span-1">
                <Flower2 className="w-12 h-12 md:w-16 md:h-16 text-customBlue mx-auto mb-4" />
                <h3 className="font-semibold text-customBlueLight text-sm md:text-base mb-2">PURE FODDER</h3>
                <p className="text-customBlueLight text-xs md:text-sm">FOR THE COW</p>
              </div>
            </div>
          </div>
        </div>
      </section>






      {/* Coming Soon Timeline */}
      <section className="py-8 bg-yellow-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-center">
            {["COMING SOON", "Q1 '25", "COMING SOON", "Q2 '25", "COMING SOON", "Q3 '25", "COMING SOON"].map(
              (item, index) => (
                <div key={index} className="text-xs md:text-sm font-semibold text-gray-700">
                  {item}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-400 to-blue-600">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="text-white">
              <div className="mb-8 w-full">
                <div className="flex flex-wrap gap-2 mb-6 w-full items-center">
                  {Array.from({ length: 15 }, (_, i) => (
                    <div key={i} className="w-4 h-4 bg-yellow-400 transform rotate-45" />
                  ))}
                </div>
                <div className="p-4 mb-6">
                  <img
                    src="/placeholder-user.png"
                    alt="Traditional dairy practices"
                    className="w-full object-cover rounded"
                  />
                </div>
                <p className="text-sm leading-relaxed font-ibm text-customYellow">
                  Doodh & Co. is born from a simple need: to make pure, honest milk accessible to everyone. We believe
                  in transparency and trust in every step, from farm to your family's table. Our mission is to change
                  the system from within.
                </p>
                <div className="flex flex-wrap gap-2 mt-6">
                  {Array.from({ length: 15 }, (_, i) => (
                    <div key={i} className="w-4 h-4 bg-yellow-400 transform rotate-45" />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">YOUR QUESTIONS, ANSWERED!</h2>

              <div className="space-y-4">
                {faqData.map((faq, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full p-4 text-left flex justify-between items-center text-white hover:bg-white/5 transition-colors"
                    >
                      <span className="font-medium">{faq.question}</span>
                      {expandedFaq === index ? (
                        <ChevronUp className="w-5 h-5 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 flex-shrink-0" />
                      )}
                    </button>
                    {expandedFaq === index && <div className="px-4 pb-4 text-white/90">{faq.answer}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-blue-200 to-yellow-100 text-center">
        <div className="container mx-auto px-4">
          <p className="text-xl md:text-2xl text-blue-800 max-w-4xl mx-auto leading-relaxed">
            Doodh & Co's mission is simple: to blend traditional practices with humble intent & modern resources, making
            pure milk accessible to more people at an effective cost.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-yellow-200 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-6xl font-bold text-blue-600 mb-4">Doodh & Co.</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-sm">
            <div>
              <div className="flex items-center mb-4">
                <img src="/footerLogo.png" alt="Cow illustration logo" />
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-blue-800 mb-3">FROM COW TO CUP</h4>
              <p className="text-blue-700 mb-2">Our daily secret to our fresh batch of pure milk</p>
              <Button variant="outline" size="sm" className="text-xs bg-transparent">
                LEARN MORE ABOUT US
              </Button>
            </div>

            <div>
              <h4 className="font-semibold text-blue-800 mb-3">RESOURCES</h4>
              <ul className="space-y-1 text-blue-700">
                <li>Terms & Conditions</li>
                <li>Refund & Cancellation</li>
                <li>Privacy Policy</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-blue-800 mb-3">CONTACT</h4>
              <p className="text-blue-700 mb-1">Instagram @</p>
              <p className="text-blue-700 mb-1">Call Us</p>
              <p className="text-blue-700">Youtube @</p>
            </div>
          </div>

          <div className="border-t border-blue-300 mt-8 pt-4 text-center text-xs text-blue-600">
            DOODH & CO. | 2024 | ALL RIGHTS RESERVED
          </div>
        </div>
      </footer>
    </div>
  )
}
