import { Suspense } from 'react';
import SingleReservationComponent from './singleReservationComponent';

const SingleReservation = () => {
  return (
    <main className='items-center h-screen bg-white p-4 flex flex-col'>
      <section className='lg:w-[360px] w-full py-5'>
        <Suspense>
          <SingleReservationComponent />
        </Suspense>
      </section>
    </main>
  );
};

export default SingleReservation;
