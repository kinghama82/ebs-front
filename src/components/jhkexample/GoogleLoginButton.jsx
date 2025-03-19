"use client"
import { API_SERVER_HOST } from '@/api/publicapi';
import { useRouter } from 'next/navigation';

const GoogleLoginButton = () => {
  const router = useRouter();

  const handleGoogleLogin = () => {
    // 백엔드의 OAuth2 로그인 엔드포인트로 이동
    router.push(`${API_SERVER_HOST}/oauth2/authorization/google`);
  };

  return (
    <button 
      onClick={handleGoogleLogin} 
      className="w-[48%] rounded-lg mr-3"
    >
      <img src='./googlelogin.png'/>
    </button>
  );
};

export default GoogleLoginButton;
