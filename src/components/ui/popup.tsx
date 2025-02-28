import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface PopupProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    comp?: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, comp, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-gray-50 rounded-2xl shadow-lg max-w-2xl w-full h-[400px] relative"
            >
                <div className="flex items-center justify-between h-[60px] border-b border-gray-400">
                    <div className="w-full">{comp}</div>
                    <button
                        className="absolute top-5 right-3 text-gray-500 shadow-2xl shadow-gray-100 hover:text-gray-800"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>
                </div>

                {children}
            </motion.div>
        </div>
    );
};

export default Popup;
