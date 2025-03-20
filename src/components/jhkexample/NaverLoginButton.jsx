"use client"
import { API_SERVER_HOST } from '@/api/publicapi';
import { useRouter } from 'next/navigation';

const NaverLoginButton = () => {
  const router = useRouter();

  const handleNaverLogin = () => {
    // 네이버 OAuth2 로그인 요청
    router.push(`${API_SERVER_HOST}/oauth2/authorization/naver`);
  };

  return (
    <button 
      onClick={handleNaverLogin} 
      className="w-[48%] rounded-lg"
    >
      <img src='./naverlogin.png'/>
    </button>
  );
};

export default NaverLoginButton;
