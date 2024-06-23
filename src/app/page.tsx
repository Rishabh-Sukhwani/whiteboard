"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import LoginButton from '../components/loginButton';

const Home = () => {
  const { status } = useSession();
  const router = useRouter();
  const pathRef = useRef(null);

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      pathRef.current.style.strokeDasharray = length;
      pathRef.current.style.strokeDashoffset = length;
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-black-500 to-purple-600 text-white">
      <style jsx>{`
        @keyframes drawPath {
          to {
            stroke-dashoffset: 0;
          }
        }
        .whiteboard-path {
          animation: drawPath 7s ease-out forwards;
        }
      `}</style>

      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8">Welcome to the Whiteboard App</h1>
      
      <svg className="w-24 h-24 mb-8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          ref={pathRef}
          className="whiteboard-path"
          d="M15.989,4 L14.486,5.5 L5.25,5.5 L5.10647279,5.5058012 C4.20711027,5.57880766 3.5,6.3318266 3.5,7.25 L3.5,9.49 L6.11032966,7.8500658 C7.11458474,7.21884459 8.42578385,7.4788108 9.11805049,8.41878234 L9.21263533,8.55766707 C9.60754263,9.18595342 9.66531956,9.96466959 9.37643726,10.6398047 L9.29698911,10.8062836 L8.08925622,13.0916763 C7.8957274,13.4579003 8.03572001,13.911669 8.4019376,14.1051994 C8.59519714,14.2073288 8.82158817,14.2192865 9.02227723,14.1418514 L9.12020755,14.0956881 L10.8791978,13.102709 C11.2392458,12.8979206 11.6971362,13.0237834 11.9019246,13.3838314 C12.0896473,13.7138755 11.9995312,14.1261343 11.7058795,14.3502913 L11.6208022,14.4065583 L9.85592161,15.4028701 C9.18921021,15.7781116 8.37750848,15.7888601 7.70109472,15.4314042 C6.6502057,14.8760541 6.22026466,13.6064091 6.69296688,12.535549 L6.76304763,12.3908405 L7.97078427,10.1054407 C8.09599053,9.86851294 8.08527176,9.58278305 7.94266635,9.35590187 C7.74227866,9.03709073 7.34143087,8.9208341 7.00672527,9.06794099 L6.90856446,9.12003478 L3.5,11.262 L3.5,16.754591 C3.5,17.7210893 4.28350169,18.504591 5.25,18.504591 L18.75,18.504591 C19.7164983,18.504591 20.5,17.7210893 20.5,16.754591 L20.5,9.443 L22,7.946 L22,16.754591 C22,18.5495164 20.5449254,20.004591 18.75,20.004591 L5.25,20.004591 C3.45507456,20.004591 2,18.5495164 2,16.754591 L2,7.25 C2,5.51696854 3.35645477,4.10075407 5.06557609,4.00514479 L5.25,4 L15.989,4 Z M21.175499,3.54486123 L21.3057053,3.66549405 L21.4262125,3.79573486 C22.1894032,4.68737541 22.1487912,6.0305334 21.3046801,6.87410524 L17.0238193,11.1477533 C16.760843,11.4102865 16.4369385,11.6036013 16.0810348,11.7104319 L13.7534665,12.409092 C13.224498,12.5678711 12.6669685,12.2677732 12.5081894,11.7388048 C12.4499495,11.54478 12.4520104,11.3376424 12.5140993,11.1448148 L13.2530235,8.84996054 C13.3626608,8.50946335 13.5519023,8.20001385 13.805051,7.94727999 L18.095697,3.66366511 C18.9405104,2.82023607 20.2840592,2.78081537 21.175499,3.54486123 Z M19.155487,4.72519469 L14.864841,9.00880957 C14.7804581,9.09305419 14.7173776,9.19620402 14.6808318,9.30970309 L14.2335301,10.6988744 L15.6497924,10.2737587 C15.768427,10.2381485 15.8763951,10.1737102 15.9640539,10.0861992 L20.244074,5.81339079 L20.3188279,5.72689957 C20.5422483,5.42598751 20.517571,4.99885441 20.2447063,4.72581529 C19.9440539,4.42497074 19.456482,4.42469294 19.155487,4.72519469 Z"
          stroke="#ffffff"
          strokeWidth="0.5"
          fill="none"
        />
      </svg>
      
      <p className="text-xl mb-8 text-center max-w-md">
        Collaborate, brainstorm, and visualize your ideas in real-time with our intuitive whiteboard app.
      </p>
      
      <LoginButton />
      
      <div className="mt-12 text-sm">
        <a href="#" className="underline mr-4">Learn More</a>
        <a href="#" className="underline">Contact Us</a>
      </div>
    </div>
  );
};

export default Home;