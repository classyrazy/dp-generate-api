"use client";

import Image from "next/image";

interface SolanaStudentCardProps {
  userName?: string;
  userImage?: string;
  showDownloadButton?: boolean;
}

export default function SolanaStudentCard({
  userName = "ADEMIDE",
  userImage = "/images/user-image.png",
  showDownloadButton = true
}: SolanaStudentCardProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch('/api/screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: `${window.location.origin}/card?userName=${encodeURIComponent(userName)}&userImage=${encodeURIComponent(userImage)}&hideButton=true`,
          fileName: `solana-student-${userName.toLowerCase()}.png`
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate screenshot');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `solana-student-${userName.toLowerCase()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  return (
    <section className="text-white w-full h-screen overflow-hidden relative z-[2] p-8 bg-black" id="outputSection">
      {/* Download Button */}
      {showDownloadButton && (
        <button 
          onClick={handleDownload}
          className="absolute top-4 right-4 z-20 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <span>Download</span>
        </button>
      )}

      <h1 className="text-5xl font-semibold tracking-tight relative z-[2]">
        Solana Student
        <Image 
          src="/images/sol-coin.png" 
          alt="Solana coin image" 
          width={40}
          height={40}
          className="inline-block w-10 h-10 ml-[-20px]" 
        />
        <br />
        Africa Summit 2025
      </h1>
      
      <p className="text-5xl italic text-[#FFC350] font-serif">Grandfinale</p>
      
      {/* Background blur effect */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-[750px] h-[600px] blur-[300px] absolute top-0 right-[-400px] rounded-full bottom-0 my-auto z-[1] opacity-80"></div>
      
      <div className="flex items-center space-x-8 mt-4 relative z-10">
        <div className="left">
          <Image 
            src={userImage} 
            alt="User Image" 
            width={300}
            height={400}
            className="w-[300px] h-[400px] object-cover rounded-xl"
          />
        </div>
        <div className="right">
          <h2 className="italic text-5xl font-semibold tracking-tight">{userName}</h2>
          <p className="text-2xl font-thin">WILL BE <br />ATTENDING</p>
        </div>
      </div>
      
      <div className="mt-5">
        <Image 
          src="/images/bottom-gibbit.png" 
          alt="Icon Gibbits"
          width={700}
          height={200}
          className="relative left-[-50px] top-10 max-w-[700px] scale-[1.2]" 
        />
      </div>
    </section>
  );
}
