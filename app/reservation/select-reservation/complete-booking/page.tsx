import { Spinner } from '@nextui-org/react';
import { Suspense } from 'react';
import CompleteBookingComponent from './completeBooking';

const CompleteBooking = () => {
  return (
    <main className='items-center h-screen bg-white p-4 flex flex-col'>
      <section className='lg:w-[360px] w-full py-5'>
        <Suspense
          fallback={
            <div className='loadingContainer flex flex-col justify-center items-center'>
              <Spinner />
            </div>
          }
        >
          <CompleteBookingComponent />
        </Suspense>
      </section>
    </main>
  );
};

export default CompleteBooking;
