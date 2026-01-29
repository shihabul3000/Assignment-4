"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { X, Star, Loader2, MessageSquare } from "lucide-react";
import { reviewService } from "../services/review.service";
import toast from "react-hot-toast";

interface ReviewModalProps {
    bookingId: string;
    tutorName: string;
    onClose: () => void;
    onSuccess: () => void;
}

export const ReviewModal = ({ bookingId, tutorName, onClose, onSuccess }: ReviewModalProps) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [hover, setHover] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (comment.trim().length < 5) {
            return toast.error("Please write a bit more about your experience.");
        }

        setLoading(true);
        try {
            await reviewService.createReview(bookingId, { rating, comment });
            toast.success("Thank you for your review!");
            onSuccess();
        } catch (error) {
            toast.error("Failed to submit review. Maybe you already reviewed this?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-xl font-bold text-slate-900 font-heading">Rate Experience</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 text-slate-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="text-center">
                        <p className="text-sm text-slate-500 mb-2">How was your session with</p>
                        <h3 className="text-lg font-bold text-slate-900">{tutorName}?</h3>
                    </div>

                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="transition-transform active:scale-95"
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                                onClick={() => setRating(star)}
                            >
                                <Star
                                    size={32}
                                    className={`${star <= (hover || rating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-slate-200"
                                        } transition-colors`}
                                />
                            </button>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                            <MessageSquare size={14} /> Your Feedback
                        </label>
                        <textarea
                            className="w-full min-h-[100px] rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                            placeholder="Write a review for the tutor..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full h-12 text-sm font-bold" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                        Submit Review
                    </Button>
                </form>
            </div>
        </div>
    );
};
