// app/games/[id]/page.js


import GameBoxComponent from '@/components/common/GameBoxComponent';

export default async function GameDetailPage({ params }) {
    // params가 promise인 경우 await해서 해결합니다.
    const { id } = await params;

    try {
        return(
            <div className='max-w-6xl mx-auto mt-2'>
                <GameBoxComponent id={id}/>
            </div>
        
        )
            
    } catch (error) {
        return <div>게임 정보를 불러오는 중 오류가 발생했습니다.</div>;
    }
}
