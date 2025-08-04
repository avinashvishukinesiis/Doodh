"use client"

import type React from "react"
import Marquee from "react-fast-marquee";

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Droplets, Eye, Home, Hand, Flower2, ChevronDown, ChevronUp, Instagram, Mail, Youtube } from "lucide-react"
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "@/firebase"
import { useRef } from "react";
import Link from "next/link";

declare global {
  interface Window {
    confirmationResult: any;
  }
}

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
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

  const faqRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const scrollToFaq = () => {
    faqRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

  // Helper function to initialize RecaptchaVerifier
  const initializeRecaptcha = () => {
    try {
      // Clear any existing recaptcha
      const recaptchaContainer = document.getElementById('recaptcha-container');
      if (recaptchaContainer) {
        recaptchaContainer.innerHTML = '';
      }

      // Clear existing verifier if it exists
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
      }

      // Create new RecaptchaVerifier
      const newRecaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => console.log("Recaptcha resolved"),
          'expired-callback': () => {
            console.log("Recaptcha expired");
            // Clear and reinitialize on expiry
            setRecaptchaVerifier(null);
          }
        }
      );

      setRecaptchaVerifier(newRecaptchaVerifier);
      return newRecaptchaVerifier;
    } catch (error) {
      console.error("Error initializing recaptcha:", error);
      return null;
    }
  };

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
    e.preventDefault();
    setIsSubmitting(true);
    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone || formData.phone.length !== 10) newErrors.phone = "Valid phone is required";
    if (!formData.pincode) newErrors.pincode = "Pincode is required";
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Get or create RecaptchaVerifier
      let verifier = recaptchaVerifier;
      if (!verifier) {
        verifier = initializeRecaptcha();
        if (!verifier) {
          throw new Error("Failed to initialize reCAPTCHA");
        }
      }

      const confirmation = await signInWithPhoneNumber(auth, `+91${formData.phone}`, verifier);
      window.confirmationResult = confirmation;

      setPhoneNumber(formData.phone);
      setShowOtpForm(true);
    } catch (error: any) {
      console.error("SMS send failed:", error);

      // Handle specific reCAPTCHA errors
      if (error.message?.includes("reCAPTCHA has already been rendered")) {
        // Force reinitialize
        setRecaptchaVerifier(null);
        try {
          const newVerifier = initializeRecaptcha();
          if (newVerifier) {
            const confirmation = await signInWithPhoneNumber(auth, `+91${formData.phone}`, newVerifier);
            window.confirmationResult = confirmation;
            setPhoneNumber(formData.phone);
            setShowOtpForm(true);
            setIsSubmitting(false);
            return;
          }
        } catch (retryError) {
          console.error("Retry failed:", retryError);
        }
      }

      alert("Failed to send OTP. Please try again.");

      // Clear recaptcha on error
      const recaptchaContainer = document.getElementById('recaptcha-container');
      if (recaptchaContainer) {
        recaptchaContainer.innerHTML = '';
      }
      setRecaptchaVerifier(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    // Handle paste (when user pastes entire OTP)
    if (value.length > 1) {
      const pastedOtp = value.slice(0, 6).split('');
      const newOtp = [...otp];

      pastedOtp.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });

      setOtp(newOtp);

      // Focus on next empty field or last field
      const nextIndex = Math.min(index + pastedOtp.length, 5);
      document.getElementById(`otp-${nextIndex}`)?.focus();
      return;
    }

    // Single digit input
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  }

  const handleBackToForm = () => {
    setShowOtpForm(false);
    setOtp(["", "", "", "", "", ""]);

    // Clear recaptcha when going back
    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
      setRecaptchaVerifier(null);
    }

    const recaptchaContainer = document.getElementById('recaptcha-container');
    if (recaptchaContainer) {
      recaptchaContainer.innerHTML = '';
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleOtpSubmit = async () => {
    setIsSubmitting(true);
    const code = otp.join("");

    if (code.length < 6) {
      alert("Enter complete 6-digit OTP");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await window.confirmationResult.confirm(code);
      console.log("User verified:", result.user);

      // Here you can:
      // 1. Store user data in your database
      // 2. Save form data (name, email, pincode)
      // 3. Add user to waitlist
      // 4. Show success message

      alert("Phone verified successfully! You've been added to our waitlist.");

      // Reset form
      setShowOtpForm(false);
      setFormData({ name: "", email: "", phone: "", pincode: "" });
      setOtp(["", "", "", "", "", ""]);

    } catch (error: any) {
      console.error("Invalid OTP", error);

      // Handle specific error types
      if (error.code === 'auth/invalid-verification-code') {
        alert("Invalid OTP. Please check and try again.");
      } else if (error.code === 'auth/code-expired') {
        alert("OTP has expired. Please request a new one.");
        setShowOtpForm(false);
      } else {
        alert("Verification failed. Please try again.");
      }

      // Clear OTP inputs on error
      setOtp(["", "", "", "", "", ""]);
      document.getElementById('otp-0')?.focus();
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleResendOtp = async () => {
    try {
      setIsSubmitting(true);

      // Always reinitialize for resend
      const verifier = initializeRecaptcha();
      if (!verifier) {
        throw new Error("Failed to initialize reCAPTCHA for resend");
      }

      const confirmation = await signInWithPhoneNumber(auth, `+91${phoneNumber}`, verifier);
      window.confirmationResult = confirmation;

      // Clear OTP inputs
      setOtp(["", "", "", "", "", ""]);
      document.getElementById('otp-0')?.focus();

      alert("New OTP sent successfully!");
    } catch (error) {
      console.error("Resend failed:", error);
      alert("Failed to resend OTP. Please try again.");

      // Clear recaptcha on error
      const recaptchaContainer = document.getElementById('recaptcha-container');
      if (recaptchaContainer) {
        recaptchaContainer.innerHTML = '';
      }
      setRecaptchaVerifier(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  const cleanupRecaptcha = () => {
    const recaptchaContainer = document.getElementById('recaptcha-container');
    if (recaptchaContainer) {
      recaptchaContainer.innerHTML = '';
    }
  }

  // Add cleanup on component unmount
  useEffect(() => {
    return () => {
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
      }
    };
  }, [recaptchaVerifier]);

  // const storeUserData = async (user: any) => {
  //   try {
  //     // If you're using Firestore
  //     const db = getFirestore();
  //     await addDoc(collection(db, 'waitlist'), {
  //       uid: user.uid,
  //       phone: user.phoneNumber,
  //       name: formData.name,
  //       email: formData.email,
  //       pincode: formData.pincode,
  //       joinedAt: new Date(),
  //       verified: true
  //     });
  //   } catch (error) {
  //     console.error('Error storing user data:', error);
  //   }
  // }

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
          <button className="text-sm md:text-base hover:underline font-ibm text-customYellow" onClick={scrollToContact}>JOIN US</button>
          <div className="flex items-center">
            <img src="/Layer_1.png" alt="cow logo" />
          </div>
          <button className="text-sm md:text-base hover:underline font-ibm text-customYellow" onClick={scrollToFaq}>LEARN MORE</button>
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
      <section className="py-16 md:py-24 bg-hero-gradient" ref={contactRef}>
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
                  {/* Your existing form inputs remain the same */}
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
                      placeholder="Phone (10 digits)"
                      value={formData.phone}
                      onChange={(e) => {
                        // Only allow numbers and limit to 10 digits
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        handleInputChange("phone", value);
                      }}
                      className={`bg-blue-100 border-0 font-ibm ${errors.phone ? "ring-2 ring-red-500" : ""}`}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <Input
                      type="text"
                      placeholder="Pincode (6 digits)"
                      value={formData.pincode}
                      onChange={(e) => {
                        // Only allow numbers and limit to 6 digits
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        handleInputChange("pincode", value);
                      }}
                      className={`bg-blue-100 border-0 font-ibm ${errors.pincode ? "ring-2 ring-red-500" : ""}`}
                    />
                    {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-customYellowSoft hover:bg-customYellow hover:border hover:border-customYellowSoft text-customBlue font-ibm"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending OTP..." : "Send OTP & Join Waitlist"}
                  </Button>
                </form>
              ) : (
                // Enhanced OTP verification form
                <div className="space-y-6">
                  {/* Back button */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={handleBackToForm}
                      className="text-blue-600 text-sm hover:underline flex items-center gap-1"
                    >
                      ← Back to form
                    </button>
                    <h3 className="text-xl font-semibold text-blue-600 font-ibm">OTP Verification</h3>
                    <div></div> {/* Spacer for centering */}
                  </div>

                  <div className="text-center">
                    <p className="text-gray-600 text-sm mb-2 font-ibm">We sent a verification code to</p>
                    <p className="text-gray-800 font-medium font-ibm">
                      +91-{phoneNumber.slice(0, 2)}XXX-XXX{phoneNumber.slice(-2)}
                    </p>
                    <p className="text-gray-500 text-xs mt-2 font-ibm">
                      Enter the 6-digit code below
                    </p>
                  </div>

                  {/* OTP input fields */}
                  <div className="flex justify-center gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pastedData = e.clipboardData.getData('text');
                          if (/^\d{6}$/.test(pastedData)) {
                            const digits = pastedData.split('');
                            setOtp(digits);
                            document.getElementById('otp-5')?.focus();
                          }
                        }}
                        className="w-12 h-12 text-center text-lg font-semibold bg-blue-100 border-2 border-blue-200 rounded-lg focus:border-blue-400 focus:outline-none transition-colors"
                      />
                    ))}
                  </div>

                  {/* Timer and resend */}
                  <div className="text-center">
                    <p className="text-gray-500 text-sm mb-2 font-ibm">Didn't receive the code?</p>
                    <button
                      onClick={handleResendOtp}
                      className="text-blue-600 text-sm hover:underline font-ibm font-medium"
                    >
                      Resend OTP
                    </button>
                  </div>

                  {/* Verify button */}
                  <Button
                    onClick={handleOtpSubmit}
                    className="w-full bg-customYellowSoft hover:bg-customYellow text-customBlue font-ibm font-semibold"
                    disabled={isSubmitting || otp.join('').length < 6}
                  >
                    {isSubmitting ? "Verifying..." : "Verify & Join Waitlist"}
                  </Button>

                  {/* Help text */}
                  <div className="text-center">
                    <p className="text-gray-500 text-xs font-ibm">
                      Having trouble? Make sure you have good network connectivity
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          <div id="recaptcha-container"></div>
        </div>
        {/* Values Section */}
        <div className="pt-16 md:pt-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
              <div className="text-center">
                <img src="./spade.png" className="h-12 md:h-12 text-customBlue mx-auto mb-4" />
                <p className="font-medium text-customBlueText md:text-customBlue font-ibm text-sm md:text-base mb-2">OUR MILK IS</p>
                <p className="text-customBlueText font-medium md:text-customBlue font-ibm text-sm md:text-base">100% ORGANIC</p>
              </div>

              <div className="text-center">
                <img src="./eye.png" className="h-12 md:h-12 text-customBlue mx-auto mb-4" />
                <p className="font-medium text-customBlueText md:text-customBlue font-ibm text-sm md:text-base mb-2">TRANSPARENT</p>
                <p className="text-customBlueText font-medium md:text-customBlue font-ibm text-sm md:text-base">SUPPLY CHAIN</p>
              </div>

              <div className="text-center">
                <img src="./armn.png" className="h-12 md:h-12 text-customBlue mx-auto mb-4" />
                <p className="font-medium text-customBlueText md:text-customBlue font-ibm text-sm md:text-base mb-2">SUPPORTING</p>
                <p className="text-customBlueText font-medium md:text-customBlue font-ibm text-sm md:text-base">FAMILY NOURISHMENT</p>
              </div>

              <div className="text-center">
                <img src="./palm.png" className="h-12 md:h-12 text-customBlue mx-auto mb-4" />
                <p className="font-medium text-customBlueText md:text-customBlue font-ibm text-sm md:text-base mb-2">WE WORK WITH</p>
                <p className="text-customBlueText font-medium md:text-customBlue font-ibm text-sm md:text-base">LOCAL FARMERS</p>
              </div>

              <div className="text-center col-span-2 md:col-span-1">
                <img src="./flower.png" className="h-12 md:h-12 text-customBlue mx-auto mb-4" />
                <p className="font-medium text-customBlueText md:text-customBlue font-ibm text-sm md:text-base mb-2">PURE FODDER</p>
                <p className="text-customBlueText font-medium md:text-customBlue font-ibm text-sm md:text-base">FOR THE COW</p>
              </div>
            </div>
          </div>
        </div>
      </section>






      {/* Coming Soon Timeline */}
      <section className="py-4 bg-customYellowText">
        <Marquee
          speed={50}
          gradient={false}
          className="text-customBlue text-xs md:text-sm font-medium font-ibm"
        >
          {[
            "COMING SOON",
            "Doodh & Co",
            "COMING SOON",
            "Doodh & Co",
            "COMING SOON",
            "Doodh & Co",
            "COMING SOON",
          ].map((item, index) => (
            <span key={index} className="mx-6">
              {item}
            </span>
          ))}
        </Marquee>
      </section>

      {/* FAQ Section */}
      <section ref={faqRef} className="bg-customBlueBright">
        <div className="w-full mx-auto md:pr-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="text-white bg-customBlue py-16 md:py-24">
              <div className="mb-8 w-full">
                <div className="flex flex-wrap gap-2 mb-6 w-full items-center justify-center">
                  {Array.from({ length: 15 }, (_, i) => (
                    <div key={i} className="w-4 h-4 bg-customYellowDimond transform rotate-45" />
                  ))}
                </div>
                <div className="relative w-full aspect-[4/3] overflow-hidden rounded-md p-4 md:px-24">
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

            <div className="py-16 md:py-24 h-full flex flex-col items-center justify-center px-4 md:px-0">
              <h2 className="text-3xl md:text-4xl font-medium font-yatra text-customYellowText mb-8">YOUR QUESTIONS, ANSWERED!</h2>

              <div className="space-y-4 w-full">
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
      <div className="pt-16 md:pt-24 bg-custom-gradient text-center flex flex-col gap-12 md:gap-24">
        <div className="container mx-auto px-4">
          <p className="text-xl md:text-2xl text-customBlue font-yatra max-w-4xl mx-auto leading-relaxed">
            Doodh & Co's mission is simple: to blend traditional practices with humble intent & modern resources, making
            pure milk accessible to more people at an effective cost.
          </p>
        </div>
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-9xl font-semibold text-customBlue mb-4 font-yatra">Doodh & Co.</h2>
        </div>
      </div>
      {/* Footer */}
      <footer className="py-12 bg-customYellow">
        <div className="container mx-auto px-4">
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
                <Link href={'https://youtube.com/@doodhandco?si=1UsV8aZTJcEmsgaW'} target="_blank"><p className="text-customBlue font-ibm text-sm font-medium flex gap-4 items-center">Youtube <Youtube width={16} /></p></Link>
              </div>
            </div>
          </div>


          <div className="pt-4 px-4 md:px-20 text-start text-md text-customBlue font-ibm font-medium">
            DOODH & CO. | 2024 | ALL RIGHTS RESERVED
          </div>
        </div>
      </footer>

    </div>
  )
}
