"use client";

import { useState } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { t } = useTranslation();

  const locale = params?.locale || "en";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/farmer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: t("login_failed"), description: data.error, variant: "destructive" });
      } else {
        toast({ title: t("login_successful") });
        router.push(`/${locale}/dashboard`);
      }
    } catch {
      toast({ title: t("error"), description: t("something_went_wrong"), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader>
          <CardTitle className="text-3xl text-center text-green-800">{t("login")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              name="phone"
              placeholder={t("phone_number")}
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
              type="tel"
            />
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={loading}
            >
              {loading ? t("logging_in") : t("login")}
            </Button>
          </form>
          <div className="mt-4 text-center">
            {t("new_user")}{" "}
            <Button variant="link" className="text-green-700 p-0" onClick={() => router.push(`/${locale}/register`)}>
              {t("register")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
