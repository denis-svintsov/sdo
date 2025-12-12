import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Phone, Video, MoreVertical, Paperclip } from "lucide-react";

export default function Chat() {
  return (
    <Layout>
      <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-lg border bg-background shadow-sm">
        {/* Sidebar */}
        <div className="w-80 border-r bg-muted/20">
          <div className="p-4 border-b">
            <Input placeholder="Поиск чатов..." />
          </div>
          <div className="overflow-y-auto h-full">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`flex items-center gap-3 p-4 hover:bg-muted/50 cursor-pointer ${i === 1 ? 'bg-muted/50' : ''}`}>
                <Avatar>
                  <AvatarFallback>ГР</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between">
                    <span className="font-medium truncate">Продвинутый Angular</span>
                    <span className="text-xs text-muted-foreground">10:45</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">Алексей: Ссылка на материалы уже в...</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>PA</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">Продвинутый Angular</h3>
                <p className="text-xs text-muted-foreground">24 участника • 3 онлайн</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon"><Phone className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon"><Video className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
             <div className="flex justify-center my-4">
                <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">Сегодня</span>
             </div>
             
             <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>ИП</AvatarFallback>
                </Avatar>
                <div>
                   <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">Иван Петров</span>
                      <span className="text-xs text-muted-foreground">10:30</span>
                   </div>
                   <div className="bg-muted p-3 rounded-lg rounded-tl-none text-sm mt-1">
                      Коллеги, подскажите, где найти ссылку на Яндекс.Телемост для сегодняшнего занятия?
                   </div>
                </div>
             </div>

             <div className="flex gap-3 flex-row-reverse">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan" />
                  <AvatarFallback>Я</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-end">
                   <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">10:32</span>
                      <span className="text-sm font-semibold">Вы</span>
                   </div>
                   <div className="bg-primary text-primary-foreground p-3 rounded-lg rounded-tr-none text-sm mt-1">
                      Привет! Ссылка должна быть в календаре, сейчас продублирую.
                   </div>
                </div>
             </div>

              <div className="flex gap-3 flex-row-reverse">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan" />
                  <AvatarFallback>Я</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-end">
                   <div className="bg-primary text-primary-foreground p-3 rounded-lg rounded-tr-none text-sm mt-1 underline cursor-pointer">
                      https://telemost.yandex.ru/j/123456789
                   </div>
                </div>
             </div>
          </div>

          <div className="p-4 border-t flex gap-2">
            <Button variant="ghost" size="icon"><Paperclip className="h-4 w-4" /></Button>
            <Input placeholder="Напишите сообщение..." className="flex-1" />
            <Button size="icon"><Send className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
