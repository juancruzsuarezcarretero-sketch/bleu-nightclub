"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useMounted } from "@/lib/useMounted";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function ModalContent({
  onClose,
  title,
  children,
}: Omit<ModalProps, "isOpen">) {
  return (
    <div className="glass-card rounded-xl p-6 shadow-glow">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-bebas text-2xl tracking-wider text-[#F0F0F0]">
          {title}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-[#F0F0F0]/60 transition-colors hover:bg-white/10 hover:text-[#F0F0F0]"
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>
      </div>
      {children}
    </div>
  );
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const mounted = useMounted();

  useEffect(() => {
    if (!mounted) return;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, mounted]);

  if (!isOpen) return null;

  if (!mounted) {
    return (
      <>
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
        <div className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2">
          <ModalContent onClose={onClose} title={title}>
            {children}
          </ModalContent>
        </div>
      </>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        key="panel"
        initial={{ opacity: 0, scale: 0.98, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 12 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2"
      >
        <ModalContent onClose={onClose} title={title}>
          {children}
        </ModalContent>
      </motion.div>
    </AnimatePresence>
  );
}
