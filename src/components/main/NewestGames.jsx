import { useEffect, useState } from "react"
import { Card, CardContent } from "../ui/card"
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel"
import axios from "axios"
import { API_SERVER_HOST } from "@/api/publicapi"

const NewestGames = () => {
    const [games, setGames] = useState([])

    useEffect(() => {
        axios.get(`${API_SERVER_HOST}/api/games/newest`).then(response => {
            setGames(response.data)
        })
            .catch(error => {
                console.error("최신게임 로드 실패!!", error)
            })
    }, [])
    return (
        <div className="text-3xl font-bold">최신발매게임
            <Carousel>
                <CarouselContent>
                    {games.map((game) => (
                        <CarouselItem key={game.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                            <Card className="shadow-lg">
                                <CardContent className="flex flex-col items-center justify-center p-4">
                                    {/* 🔹 게임 이미지 */}
                                    <img
                                        src={`${API_SERVER_HOST}${game.img}`}
                                        alt={game.gameName}
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                    {/* 🔹 게임 이름 */}
                                    <span className="text-lg font-semibold mt-2">{game.gameName}</span>
                                    {/* 🔹 출시 연도 */}
                                    <span className="text-sm text-gray-500">{game.year}</span>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    )
}
export default NewestGames