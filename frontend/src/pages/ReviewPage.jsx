import React from "react";
import { Star } from "lucide-react";
import Navbar from "../components/Navbar";

const reviews = [
  {
    name: "Dewi Lestari",
    photo: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    comment:
      "Rasanya enak banget! Teksturnya lembut dan manisnya pas. Pasti order lagi!",
    date: "25 Mei 2025",
  },
  {
    name: "Rian Pratama",
    photo: "https://i.pravatar.cc/150?img=2",
    rating: 4,
    comment:
      "Pelayanan cepat dan makanannya masih hangat waktu sampai. Recommended!",
    date: "24 Mei 2025",
  },
  {
    name: "Siti Nurhaliza",
    photo: "https://i.pravatar.cc/150?img=3",
    rating: 5,
    comment: "Porsinya pas, harga terjangkau, dan rasanya bikin nagih!",
    date: "22 Mei 2025",
  },
  {
    name: "Agus Santoso",
    photo: "https://i.pravatar.cc/150?img=4",
    rating: 4,
    comment: "Rasa enak, tapi pengiriman agak lama. Masih oke kok.",
    date: "20 Mei 2025",
  },
  {
    name: "Maya Fitriani",
    photo: "https://i.pravatar.cc/150?img=5",
    rating: 5,
    comment: "Top banget! Kue ulang tahunnya disukai semua orang!",
    date: "19 Mei 2025",
  },
  {
    name: "Fajar Nugraha",
    photo: "https://i.pravatar.cc/150?img=6",
    rating: 5,
    comment: "Sudah langganan lama, kualitas selalu terjaga.",
    date: "18 Mei 2025",
  },
  {
    name: "Nina Kurnia",
    photo: "https://i.pravatar.cc/150?img=7",
    rating: 4,
    comment: "Rotinya lembut dan wangi. Anak-anak suka banget!",
    date: "17 Mei 2025",
  },
];

const StarRating = ({ rating }) => {
  return (
    <div className="flex text-yellow-400">
      {Array(5)
        .fill()
        .map((_, i) => (
          <Star key={i} size={18} fill={i < rating ? "#facc15" : "none"} />
        ))}
    </div>
  );
};

const ReviewCard = ({ review }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 w-80 h-48 flex flex-col justify-between">
      <div className="flex gap-3 items-center">
        <img
          src={review.photo}
          alt={review.name}
          className="w-12 h-12 rounded-full border-2 border-yellow-400"
        />
        <div>
          <h3 className="text-md font-semibold">{review.name}</h3>
          <p className="text-xs text-gray-400">{review.date}</p>
        </div>
      </div>
      <StarRating rating={review.rating} />
      <p className="text-sm text-gray-700">{review.comment}</p>
    </div>
  );
};

export default function ReviewPage() {
  return (
    <div className="min-h-screen bg-yellow-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-center pt-10 mb-6 text-yellow-700">
          Ulasan Pelanggan
        </h1>

        {/* Scrollable Horizontal Container */}
        <div className="overflow-x-auto pb-6">
          <div className="grid grid-flow-col auto-cols-max gap-6">
            {/* Each "column" contains 2 cards stacked vertically */}
            {Array.from({ length: Math.ceil(reviews.length / 3) }).map(
              (_, colIndex) => (
                <div key={colIndex} className="grid grid-rows-3 gap-4">
                  {reviews
                    .slice(colIndex * 3, colIndex * 3 + 3)
                    .map((review, index) => (
                      <ReviewCard key={index} review={review} />
                    ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
