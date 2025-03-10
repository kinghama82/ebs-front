"use client";
import { Search } from "lucide-react";
import { useEffect } from "react";

const AddressSearch = ({ onSelect }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const openPostcode = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        onSelect(data.roadAddress); // 선택된 주소를 부모 컴포넌트로 전달
      },
    }).open();
  };

  return (
    <div>
      <button><Search onClick={openPostcode}/></button>
      
    </div>
  );
};

export default AddressSearch;
