'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const questions = [
  "Are you already registered for PM Kisan Yojana?",
  "Do you own cultivable land in your name? 🌾",
  "Did you or any member of your family pay income tax in the last assessment year? 💰",
  "Are you or any family member currently holding or have previously held a constitutional post (e.g., President, Governor)? 🏛",
  "Are you a retired government employee or pensioner receiving a monthly pension of ₹10,000 or more? 👨‍💼",
  "Is any member of your family a registered professional like a doctor, engineer, or chartered accountant? 👩‍⚕"
];

export default function KisanYojanaPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (answer: boolean) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestionIndex === 0 && answer) {
      setShowResult(true);
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  const isEligible = () => {
    if (answers.length > 1) { // Check eligibility only after the first question
        const [_alreadyRegistered, ownsLand, paidTax, constitutionalPost, pensioner, professional] = answers;
        return ownsLand && !paidTax && !constitutionalPost && !pensioner && !professional;
    }
    return false;
  };
  
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResult(false);
  }

  const renderResult = () => {
    if (answers[0]) {
      return (
        <CardContent className="text-center">
          <p className="text-xl font-semibold mb-4">✅ You are already registered for PM Kisan Yojana.</p>
          <Button asChild variant="link">
            <Link href="#">Explore more schemes</Link>
          </Button>
          <div className="mt-6">
            <Button onClick={resetQuiz}>Start Over</Button>
          </div>
        </CardContent>
      );
    }

    if (isEligible()) {
      return (
        <CardContent className="text-center">
            <p className="text-xl font-semibold text-green-600 mb-4">
              ✅ You are eligible to apply for PM Kisan Yojana.
            </p>
            <p className="mb-4">
              Click the link below to go directly to the registration form:
            </p>
            <Button asChild className="mb-6">
                <a href="https://pmkisan.gov.in/RegistrationFormupdated.aspx" target="_blank" rel="noopener noreferrer">
                    Register for PM Kisan Yojana
                </a>
            </Button>
            <div className="text-left mt-4 p-4 border rounded-lg bg-gray-50">
                <h4 className="font-bold mb-2">Steps to Register:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Click the registration link to open the official portal.</li>
                    <li>Choose between Rural or Urban farmer registration.</li>
                    <li>Enter your Aadhaar number, phone number, and state.</li>
                    <li>Complete the captcha verification and click 'Get OTP'.</li>
                    <li>Fill in the required personal and landholding details.</li>
                    <li>Submit the application and save your registration number.</li>
                </ol>
            </div>
            <Button onClick={resetQuiz} variant="outline" className="mt-6">Start Over</Button>
        </CardContent>
      );
    }

    return (
      <CardContent className="text-center">
        <p className="text-xl font-semibold text-red-600 mb-4">
          ❌ Sorry, based on your answers, you are not eligible for PM Kisan Yojana.
        </p>
        <Button onClick={resetQuiz} className="mt-6">Try Again</Button>
      </CardContent>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
       <div className="w-full max-w-2xl mx-auto">
        <Button asChild variant="ghost" className="mb-4">
            <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
            </Link>
        </Button>
        <Card className="w-full">
            <CardHeader>
            <CardTitle className="text-center text-2xl">PM Kisan Yojana Eligibility Check</CardTitle>
            </CardHeader>
            {showResult ? renderResult() : (
            <CardContent>
                <p className="text-center text-lg mb-8">{questions[currentQuestionIndex]}</p>
                <div className="flex justify-center gap-4">
                <Button onClick={() => handleAnswer(true)} className="bg-green-600 hover:bg-green-700 w-24">Yes</Button>
                <Button onClick={() => handleAnswer(false)} className="bg-red-600 hover:bg-red-700 w-24">No</Button>
                </div>
            </CardContent>
            )}
        </Card>
      </div>
    </div>
  );
}