import React, { useState, useRef } from 'react';

// ResizableImage 컴포넌트
const ResizableImage = ({ src, alt }) => {
    const [width, setWidth] = useState(300); // 이미지 초기 너비
    const [height, setHeight] = useState(200); // 이미지 초기 높이
    const [isResizing, setIsResizing] = useState(false); // 크기 조정 상태
    const [startX, setStartX] = useState(0); // 드래그 시작 X 좌표
    const [startY, setStartY] = useState(0); // 드래그 시작 Y 좌표
    const [startWidth, setStartWidth] = useState(0); // 드래그 시작 너비
    const [startHeight, setStartHeight] = useState(0); // 드래그 시작 높이
    const imageRef = useRef(null); // 이미지 참조

    // 크기 조정 시작
    const startResizing = (e) => {
        setIsResizing(true);
        setStartX(e.clientX);
        setStartY(e.clientY);
        setStartWidth(width);
        setStartHeight(height);

        // 마우스 이동 이벤트와 마우스 업 이벤트 리스너 추가
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', stopResizing);
    };

    // 크기 조정 중인 이미지 크기 업데이트
    const onMouseMove = (e) => {
        if (!isResizing) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        // 새로운 너비와 높이 계산
        const newWidth = Math.max(100, startWidth + dx); // 최소 너비 100px
        const newHeight = Math.max(100, startHeight + dy); // 최소 높이 100px

        setWidth(newWidth);
        setHeight(newHeight);
    };

    // 크기 조정 종료
    const stopResizing = () => {
        setIsResizing(false);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', stopResizing);
    };

    return (
        <div
            style={{
                position: 'relative',
                display: 'inline-block',
                width: `${width}px`,
                height: `${height}px`,
            }}
        >
            <img
                ref={imageRef}
                src={src}
                alt={alt}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                    cursor: 'pointer', // 이미지를 클릭할 수 있다는 느낌 주기
                    border: '2px solid #D97706',
                }}
            />

            {/* 크기 조정 핸들 */}
            {isResizing && (
                <div
                    onMouseDown={startResizing} // 크기 조정 시작
                    style={{
                        position: 'absolute',
                        bottom: '0',
                        right: '0',
                        width: '15px',
                        height: '15px',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        cursor: 'se-resize', // 크기 조정 커서
                        borderRadius: '50%',
                        border: '2px solid #fff',
                    }}
                />
            )}
        </div>
    );
};

export default ResizableImage;
