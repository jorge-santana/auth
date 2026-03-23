"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { get2faSecret } from "./actions";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";

interface TwoFactorAuthFormProps {
  twoFactorActivated: boolean;
}

export default function TwoFactorAuthForm({
  twoFactorActivated,
}: TwoFactorAuthFormProps) {
  const [isActivated, setIsActivated] = useState(twoFactorActivated);
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);

  const handleEnableClick = async () => {
    const response = await get2faSecret();
    if (response.success) {
      toast.success(response.message, {
        style: { background: "green", color: "white" },
      });

      setCode(response.data as string);
      setStep(2);
    }
  };

  return (
    <div>
      {isActivated && (
        <div>
          <Button variant={"destructive"}>
            Desabilitar autenticação de dois fatores
          </Button>
        </div>
      )}

      {!isActivated && (
        <div>
          {step === 1 && (
            <Button onClick={handleEnableClick}>
              Habilitar autenticação de dois fatores
            </Button>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground py-2">
                Leia este QR code no seu App de Autenticação preferido, por
                exemplo no Google Authenticator ou Microsoft Authenticator.
              </p>
              <QRCodeSVG value={code} />
              <Button onClick={() => setStep(3)}>QR code escaneado</Button>
              <Button onClick={() => setStep(1)} variant="outline">
                Cancelar
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
