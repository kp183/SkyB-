"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api, getToken, getCurrentStoredUser, removeToken } from "@/lib/api";

export interface BotChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
  price?: number;
}

export interface SkyBotProduct {
  id: number;
  name: string;
  price: number;
  mrp?: number | null;
  image_url?: string | null;
  min_price?: number;
}

interface SkyBotContextType {
  isOpen: boolean;
  activeProduct: SkyBotProduct | null;
  sessionId: number | null;
  messages: BotChatMessage[];
  counterPrice: number | null;
  savings: number | null;
  roundNumber: number;
  isFinalRound: boolean;
  isAccepted: boolean;
  isApplied: boolean;
  loading: boolean;
  error: string | null;
  openSkyBot: (product?: SkyBotProduct | null, initialOffer?: number) => Promise<void>;
  closeSkyBot: () => void;
  sendOffer: (offerPrice: number) => Promise<void>;
  applyDealToCart: () => Promise<void>;
}

const SkyBotContext = createContext<SkyBotContextType | undefined>(undefined);

export const SkyBotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<SkyBotProduct | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<BotChatMessage[]>([]);
  const [counterPrice, setCounterPrice] = useState<number | null>(null);
  const [savings, setSavings] = useState<number | null>(null);
  const [roundNumber, setRoundNumber] = useState<number>(0);
  const [isFinalRound, setIsFinalRound] = useState<boolean>(false);
  const [isAccepted, setIsAccepted] = useState<boolean>(false);
  const [isApplied, setIsApplied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const formatCurrentTime = () => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleAuthError = useCallback(
    (err: any): boolean => {
      const msg = (err?.message || "").toLowerCase();
      if (
        err?.status === 401 ||
        msg.includes("credentials") ||
        msg.includes("token") ||
        msg.includes("401") ||
        msg.includes("unauthorized")
      ) {
        removeToken();
        setIsOpen(false);
        router.push(`/login?next=${encodeURIComponent(pathname || "/")}`);
        return true;
      }
      return false;
    },
    [pathname, router]
  );

  const openSkyBot = useCallback(
    async (product?: SkyBotProduct | null, initialOffer?: number) => {
      // 1. Strict Guest Check: Guests must NEVER see the panel open
      const token = getToken();
      if (!token) {
        setIsOpen(false);
        router.push(`/login?next=${encodeURIComponent(pathname || "/")}`);
        return;
      }

      setError(null);
      setIsApplied(false);
      setIsAccepted(false);
      setCounterPrice(null);
      setSavings(null);
      setRoundNumber(0);
      setIsFinalRound(false);

      // Get real user name if available
      const storedUser = getCurrentStoredUser();
      const customerName = storedUser?.name ? storedUser.name.split(" ")[0] : null;
      const greetingSalutation = customerName
        ? `Namaste <strong class="text-primary">${customerName}</strong>! 🙏`
        : `Namaste! 🙏`;

      if (product) {
        setActiveProduct(product);
        setIsOpen(true);
        setLoading(true);

        try {
          const res = await api.startBargain(product.id);
          setSessionId(res.session_id);
          setMessages([
            {
              id: "msg-welcome",
              sender: "bot",
              text: `${greetingSalutation} I see you love our ${product.name}. The catalog price is ₹${Math.round(
                product.price
              )}. What offer would you like to put on the table?`,
              time: formatCurrentTime(),
            },
          ]);

          if (initialOffer && initialOffer > 0) {
            await sendOfferInternal(res.session_id, initialOffer, product);
          }
        } catch (err: any) {
          if (handleAuthError(err)) return;
          setError("Unable to start negotiation session right now. Please try again.");
          setMessages([
            {
              id: "msg-err",
              sender: "bot",
              text: "Sorry, unable to start bargaining session. Please try again in a moment.",
              time: formatCurrentTime(),
            },
          ]);
        } finally {
          setLoading(false);
        }
      } else {
        // Open without preloaded product
        setActiveProduct(null);
        setSessionId(null);
        setMessages([
          {
            id: "msg-general",
            sender: "bot",
            text: `${greetingSalutation} I am SkyBot AI. To negotiate an instant savings deal, tap 'Bargain' on any product card or catalog item!`,
            time: formatCurrentTime(),
          },
        ]);
        setIsOpen(true);
      }
    },
    [pathname, router, handleAuthError]
  );

  const closeSkyBot = useCallback(() => {
    setIsOpen(false);
  }, []);

  const sendOfferInternal = async (
    sessId: number,
    offerPrice: number,
    prod: SkyBotProduct
  ) => {
    const userMsg: BotChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: `Can you do ₹${Math.round(offerPrice)}?`,
      time: formatCurrentTime(),
      price: offerPrice,
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setError(null);

    try {
      const res = await api.submitBargainOffer(sessId, offerPrice);
      setRoundNumber(res.round_number);
      setCounterPrice(res.counter_price);
      setIsFinalRound(res.is_final_round);

      const calculatedSavings = Math.max(0, Math.round(prod.price - res.counter_price));
      setSavings(calculatedSavings);

      if (res.status === "accepted" || res.counter_price <= offerPrice) {
        setIsAccepted(true);
      }

      const botMsg: BotChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: res.message,
        time: formatCurrentTime(),
        price: res.counter_price,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      if (handleAuthError(err)) return;
      setError("Could not process your offer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sendOffer = useCallback(
    async (offerPrice: number) => {
      if (!sessionId || !activeProduct) return;
      await sendOfferInternal(sessionId, offerPrice, activeProduct);
    },
    [sessionId, activeProduct]
  );

  const applyDealToCart = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      await api.acceptBargain(sessionId);
      setIsApplied(true);
      setIsAccepted(true);
      // Dispatch custom event to notify Navbar and Cart components
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cart-updated"));
      }
    } catch (err: any) {
      if (handleAuthError(err)) return;
      setError("Failed to apply deal to cart. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [sessionId, handleAuthError]);

  return (
    <SkyBotContext.Provider
      value={{
        isOpen,
        activeProduct,
        sessionId,
        messages,
        counterPrice,
        savings,
        roundNumber,
        isFinalRound,
        isAccepted,
        isApplied,
        loading,
        error,
        openSkyBot,
        closeSkyBot,
        sendOffer,
        applyDealToCart,
      }}
    >
      {children}
    </SkyBotContext.Provider>
  );
};

export const useSkyBot = () => {
  const context = useContext(SkyBotContext);
  if (!context) {
    throw new Error("useSkyBot must be used within a SkyBotProvider");
  }
  return context;
};
