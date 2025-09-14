import SolanaStudentCard from "@/components/InvitationCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Solana Student Card Generator
          </h1>
          <p className="text-gray-600 mb-8">
            Generate and download your Solana Student Africa Summit 2025 card
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <SolanaStudentCard 
            userName="ADEMIDE"
            userImage="/images/user-image.png"
            showDownloadButton={true}
          />
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Click the download button to save your card as an image
          </p>
        </div>
      </div>
    </div>
  );
}
