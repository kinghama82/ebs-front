"use client";

import BasicMenu from "@/components/menus/BasicMenu";
import React, { useState } from 'react';

const myPage = () => {
    const buttonStyle = { backgroundColor: '#d5ba98' };
    const [selectedRadio, setSelectedRadio] = useState('btnradio1');
    const handleRadioChange = (event) => {
        setSelectedRadio(event.target.id);
      };
    return (
        
    
    <div>
        <BasicMenu></BasicMenu>
        <div className="w-full max-w-6xl mx-auto"> {/* 부모 div에 공백 및 최대 너비 설정 */}
                <h1 className="mt-4 text-4xl font-bold text-center">마이 페이지</h1>

                <div className="bg-white my-2 w-full flex flex-col md:flex-row md:space-x-12 justify-between">
                    {/* main과 aside의 너비를 BasicMenu의 너비(max-w-5xl)로 맞춤 */}
                    <main className="bg-slate-200 w-full px-10 py-40 rounded-lg">

                    </main>
                    
                    
                    {/* main과 동일한 너비로 설정 */}
                    <aside className="bg-slate-200 w-full px-10 py-40 rounded-lg">
                
                    <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
      <input
        type="radio"
        className="btn-check"
        name="btnradio"
        id="btnradio1"
        autoComplete="off"
        checked={selectedRadio === 'btnradio1'} // 선택된 버튼에 맞게 체크
        onChange={handleRadioChange} // 라디오 버튼 클릭 시 상태 업데이트
      />
      <label
        className="btn"
        style={{
          backgroundColor: selectedRadio === 'btnradio1' ? '#d5ba98' : 'transparent', // 선택되었을 때 배경색 설정
          color: selectedRadio === 'btnradio1' ? 'black' : '#d5ba98', // 텍스트 색상 설정 (선택되면 검정, 아니면 배경색과 동일)
          outline: '1px solid black', // outline을 유지
        }}
        htmlFor="btnradio1" // for를 htmlFor로 변경
      >
        Radio 1
      </label>

      <input
        type="radio"
        className="btn-check"
        name="btnradio"
        id="btnradio2"
        autoComplete="off"
        checked={selectedRadio === 'btnradio2'} // 선택된 버튼에 맞게 체크
        onChange={handleRadioChange} // 라디오 버튼 클릭 시 상태 업데이트
      />
      <label
        className="btn"
        style={{
          backgroundColor: selectedRadio === 'btnradio2' ? '#d5ba98' : 'transparent', // 선택되었을 때 배경색 설정
          color: selectedRadio === 'btnradio2' ? 'black' : '#d5ba98', // 텍스트 색상 설정 (선택되면 검정, 아니면 배경색과 동일)
          outline: '1px solid black', // outline을 유지
        }}
        htmlFor="btnradio2" // for를 htmlFor로 변경
      >
        Radio 2
      </label>
    </div>
                    </aside>
            </div>

                {/* main과 aside 사이에 버튼을 추가 */}
                <div className="flex justify-start space-x-4 my-2">
                    <button className="bg-orange-100 text-black font-bold px-4 py-2 rounded-md mt-2 ">내글보기</button>
                    <button className="bg-orange-100 text-black font-bold px-4 py-2 rounded-md mt-2 ">전적통계</button>
                </div>


            <div className="bg-slate-200 w-full h-[160px] md:h-[400px]"></div>

         </div>
    </div>
    );
}
    export default myPage;