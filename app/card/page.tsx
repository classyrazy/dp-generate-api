import { Suspense } from 'react';
import SolanaStudentCard from '@/components/InvitationCard';

function CardContent({ searchParams }: { searchParams: { userName?: string; userImage?: string; hideButton?: string } }) {
  return (
    <SolanaStudentCard 
      userName={searchParams.userName || "ADEMIDE"}
      userImage={searchParams.userImage || "/images/user-image.png"}
      showDownloadButton={searchParams.hideButton !== 'true'}
    />
  );
}

export default function CardPage({ searchParams }: { searchParams: { userName?: string; userImage?: string; hideButton?: string } }) {
  return (
    <div className="w-full h-screen bg-black">
      <Suspense fallback={<div>Loading...</div>}>
        <CardContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
