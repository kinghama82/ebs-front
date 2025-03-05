import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export function HistoryTab() {
  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">게임 메이트</TabsTrigger>
        <TabsTrigger value="password">최근 플레이 게임</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="m-1">
        게임 메이트 공간
      </TabsContent>
      <TabsContent value="password" className="m-1">
        최근 플레이 게임
      </TabsContent>
    </Tabs>
  )
}
