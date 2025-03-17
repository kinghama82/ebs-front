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
        {/* 🔥 폼 제출을 방지하기 위해 `type="button"` 추가 */}
        <button type="button" onClick={openPostcode} className="p-2 bg-blue-500 text-white rounded-md">
          <Search size={18} />
        </button>
      </div>
  );
};

export default AddressSearch;
